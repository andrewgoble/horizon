/**
 * Cart Upsells Component
 * Dynamically loads and displays product recommendations in the cart drawer
 */
class CartUpsells extends HTMLElement {
  #cachedRecommendations = {};
  #activeFetch = null;

  connectedCallback() {
    // Only load if cart has items
    if (this.hasAttribute('hidden') || !this.dataset.productId) {
      return;
    }

    this.#loadRecommendations();
  }

  /**
   * Load product recommendations based on cart items
   */
  async #loadRecommendations() {
    const { productId, url, maxProducts, sectionId } = this.dataset;

    if (!productId || !url) {
      this.hidden = true;
      return;
    }

    const intent = 'complementary';
    const fetchUrl = `${url}&product_id=${productId}&section_id=${sectionId || 'cart-upsells'}&intent=${intent}`;
    const cacheKey = fetchUrl;

    // Check cache first
    if (this.#cachedRecommendations[cacheKey]) {
      this.#renderProducts(this.#cachedRecommendations[cacheKey]);
      return;
    }

    // Show loading state
    const loadingEl = this.querySelector('.cart-upsells__loading');
    const contentEl = this.querySelector('.cart-upsells__content');
    if (loadingEl) loadingEl.hidden = false;
    if (contentEl) contentEl.hidden = true;

    // Abort any existing fetch
    this.#activeFetch?.abort();
    this.#activeFetch = new AbortController();

    try {
      const response = await fetch(fetchUrl, {
        signal: this.#activeFetch.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract product cards from the rendered HTML
      // The section returns resource-card elements
      const productCards = Array.from(doc.querySelectorAll('.resource-card'));
      
      if (productCards.length === 0) {
        this.hidden = true;
        return;
      }

      const products = productCards.map((card) => {
        const link = card.querySelector('a[href*="/products/"]');
        const productId = link?.href.match(/\/products\/([^/?]+)/)?.[1];
        return {
          id: productId,
          html: card.outerHTML,
        };
      });

      // Cache the results
      this.#cachedRecommendations[cacheKey] = products;

      // Render products
      this.#renderProducts(products);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Cart upsells error:', error);
        this.hidden = true;
      }
    } finally {
      this.#activeFetch = null;
      if (loadingEl) loadingEl.hidden = true;
    }
  }

  /**
   * Render products in carousel format
   */
  #renderProducts(products) {
    if (!products || products.length === 0) {
      this.hidden = true;
      return;
    }

    const contentEl = this.querySelector('.cart-upsells__content');
    if (!contentEl) return;

    // Filter out products already in cart
    const cartItemIds = new Set();
    document.querySelectorAll('.cart-items__table [data-product-id]').forEach((el) => {
      const id = el.dataset.productId;
      if (id) cartItemIds.add(id.toString());
    });

    // Also check product card links
    document.querySelectorAll('.product-card[data-product-id]').forEach((el) => {
      const id = el.dataset.productId;
      if (id) cartItemIds.add(id.toString());
    });

    const filteredProducts = products.filter((product) => {
      if (!product.id) return true;
      // Extract numeric ID from product handle if needed
      return !cartItemIds.has(product.id);
    });

    if (filteredProducts.length === 0) {
      this.hidden = true;
      return;
    }

    // Limit to max products
    const maxProducts = parseInt(this.dataset.maxProducts || 9);
    const productsToShow = filteredProducts.slice(0, maxProducts);

    // Create slides for carousel - one product per slide
    // The CSS will handle showing 3 at a time
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

    // Create carousel wrapper
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'cart-upsells__carousel resource-list__carousel';
    carouselWrapper.style.setProperty('--gutter-slide-width', 'var(--padding-md)');
    carouselWrapper.style.setProperty('--slide-width-max', 'calc((100% - (2 * var(--gutter-slide-width))) / 3)');

    // Create slideshow component
    const slideshow = document.createElement('slideshow-component');
    slideshow.className = 'resource-list__carousel';
    slideshow.setAttribute('ref', 'cartUpsellsCarousel');
    slideshow.setAttribute(
      'style',
      `--slideshow-timeline: ${Array.from({ length: slideCount }, (_, i) => `--slide-${i}`).join(' ')};`
    );
    slideshow.setAttribute('initial-slide', '0');

    // Create slideshow container
    const container = document.createElement('slideshow-container');
    container.setAttribute('ref', 'slideshowContainer');

    // Add arrows if needed
    if (needsArrows) {
      const arrowsHTML = this.#createArrows();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = arrowsHTML;
      container.appendChild(tempDiv.firstElementChild);
    }

    // Create slides container
    const slidesContainer = document.createElement('slideshow-slides');
    slidesContainer.setAttribute('tabindex', '-1');
    slidesContainer.setAttribute('ref', 'scroller');
    slidesContainer.setAttribute('gutters', 'start end');

    // Add slides
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = slides;
    Array.from(tempDiv.children).forEach((slide) => {
      slidesContainer.appendChild(slide);
    });

    // Assemble structure
    container.appendChild(slidesContainer);
    slideshow.appendChild(container);
    carouselWrapper.appendChild(slideshow);
    contentEl.appendChild(carouselWrapper);
    contentEl.hidden = false;
  }

  /**
   * Create navigation arrows for carousel
   */
  #createArrows() {
    // Use the theme's slideshow-arrows component structure
    // The arrows will be rendered by the slideshow component automatically
    // We just need to include the slideshow-arrows element
    return '<slideshow-arrows></slideshow-arrows>';
  }
}

if (!customElements.get('cart-upsells')) {
  customElements.define('cart-upsells', CartUpsells);
}

