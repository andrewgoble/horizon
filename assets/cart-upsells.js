/**
 * Cart Upsells Component
 * Dynamically loads and displays product recommendations in the cart drawer
 */

// Module-level cache persists across element replacements when Horizon re-renders the cart
const cartUpsellsCache = {};

class CartUpsells extends HTMLElement {
  #activeFetch = null;

  static get observedAttributes() {
    return ['data-product-id'];
  }

  connectedCallback() {
    if (this.hasAttribute('hidden') || !this.dataset.productId) {
      return;
    }

    this.#loadRecommendations();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-product-id' && newValue && newValue !== oldValue) {
      const contentEl = this.querySelector('.cart-upsells__content');
      if (contentEl) {
        contentEl.innerHTML = '';
        contentEl.hidden = true;
      }
      this.#loadRecommendations();
    }
  }

  async #loadRecommendations() {
    const { productId, url } = this.dataset;

    if (!productId || !url) {
      this.hidden = true;
      return;
    }

    const loadingEl = this.querySelector('.cart-upsells__loading');
    const contentEl = this.querySelector('.cart-upsells__content');
    if (loadingEl) loadingEl.hidden = false;
    if (contentEl) contentEl.hidden = true;

    try {
      let products = await this.#fetchIntent('complementary');
      if (products.length === 0) {
        products = await this.#fetchIntent('related');
      }
      this.#renderProducts(products);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Cart upsells error:', error);
        this.hidden = true;
      }
    } finally {
      if (loadingEl) loadingEl.hidden = true;
    }
  }

  async #fetchIntent(intent) {
    const { productId, url, sectionId } = this.dataset;
    const fetchUrl = `${url}&product_id=${productId}&section_id=${sectionId || 'cart-upsells'}&intent=${intent}`;

    if (cartUpsellsCache[fetchUrl]) {
      return cartUpsellsCache[fetchUrl];
    }

    this.#activeFetch?.abort();
    this.#activeFetch = new AbortController();

    const response = await fetch(fetchUrl, { signal: this.#activeFetch.signal });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const productCards = Array.from(doc.querySelectorAll('.cart-upsells-product-card'));

    const products = productCards.map((card) => {
      const link = card.querySelector('a[href*="/products/"]');
      const productId = link?.href.match(/\/products\/([^/?]+)/)?.[1];
      return { id: productId, html: card.outerHTML };
    });

    cartUpsellsCache[fetchUrl] = products;
    this.#activeFetch = null;
    return products;
  }

  #renderProducts(products) {
    if (!products || products.length === 0) {
      this.hidden = true;
      return;
    }

    const contentEl = this.querySelector('.cart-upsells__content');
    if (!contentEl) return;

    // Filter out products already in the cart
    const cartItemIds = new Set();
    document.querySelectorAll('.cart-items__table [data-product-id]').forEach((el) => {
      const id = el.dataset.productId;
      if (id) cartItemIds.add(id.toString());
    });

    const filteredProducts = products.filter((product) => {
      if (!product.id) return true;
      return !cartItemIds.has(product.id);
    });

    if (filteredProducts.length === 0) {
      this.hidden = true;
      return;
    }

    const maxProducts = parseInt(this.dataset.maxProducts || 9);
    const productsToShow = filteredProducts.slice(0, maxProducts);

    const slides = productsToShow
      .map(
        (product, index) => `
      <slideshow-slide
        ref="slides[]"
        aria-hidden="${index >= 3 ? 'true' : 'false'}"
        style="view-timeline-name: --slide-${index};"
        class="resource-list__slide"
      >
        <div class="resource-list__item">
          ${product.html}
        </div>
      </slideshow-slide>
    `
      )
      .join('');

    const slideCount = productsToShow.length;
    const needsArrows = slideCount > 3;

    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'cart-upsells__carousel resource-list__carousel';
    carouselWrapper.style.setProperty('--gutter-slide-width', 'var(--padding-md)');
    carouselWrapper.style.setProperty('--slide-width-max', 'calc((100% - (2 * var(--gutter-slide-width))) / 3)');

    const slideshow = document.createElement('slideshow-component');
    slideshow.className = 'resource-list__carousel';
    slideshow.setAttribute('ref', 'cartUpsellsCarousel');
    slideshow.setAttribute(
      'style',
      `--slideshow-timeline: ${Array.from({ length: slideCount }, (_, i) => `--slide-${i}`).join(' ')};`
    );
    slideshow.setAttribute('initial-slide', '0');

    const container = document.createElement('slideshow-container');
    container.setAttribute('ref', 'slideshowContainer');

    if (needsArrows) {
      const arrowsHTML = this.#createArrows();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = arrowsHTML;
      container.appendChild(tempDiv.firstElementChild);
    }

    const slidesContainer = document.createElement('slideshow-slides');
    slidesContainer.setAttribute('tabindex', '-1');
    slidesContainer.setAttribute('ref', 'scroller');
    slidesContainer.setAttribute('gutters', 'start end');

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = slides;
    Array.from(tempDiv.children).forEach((slide) => {
      slidesContainer.appendChild(slide);
    });

    container.appendChild(slidesContainer);
    slideshow.appendChild(container);
    carouselWrapper.appendChild(slideshow);

    contentEl.innerHTML = '';
    contentEl.appendChild(carouselWrapper);
    contentEl.hidden = false;
  }

  #createArrows() {
    return '<slideshow-arrows></slideshow-arrows>';
  }
}

if (!customElements.get('cart-upsells')) {
  customElements.define('cart-upsells', CartUpsells);
}
