# Horizon

[Getting started](#getting-started) |
[Staying up to date with Horizon changes](#staying-up-to-date-with-horizon-changes) |
[Developer tools](#developer-tools) |
[Jambys developer onboarding](#jambys-developer-onboarding) |
[Contributing](#contributing) |
[License](#license)

Horizon is the flagship of a new generation of first party Shopify themes. It incorporates the latest Liquid Storefronts features, including [theme blocks](https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start?framework=liquid).

- **Web-native in its purest form:** Themes run on the [evergreen web](https://www.w3.org/2001/tag/doc/evergreen-web/). We leverage the latest web browsers to their fullest, while maintaining support for the older ones through progressive enhancement—not polyfills.
- **Lean, fast, and reliable:** Functionality and design defaults to “no” until it meets this requirement. Code ships on quality. Themes must be built with purpose. They shouldn’t support each and every feature in Shopify.
- **Server-rendered:** HTML must be rendered by Shopify servers using Liquid. Business logic and platform primitives such as translations and money formatting don’t belong on the client. Async and on-demand rendering of parts of the page is OK, but we do it sparingly as a progressive enhancement.
- **Functional, not pixel-perfect:** The Web doesn’t require each page to be rendered pixel-perfect by each browser engine. Using semantic markup, progressive enhancement, and clever design, we ensure that themes remain functional regardless of the browser.

## Jambys developer onboarding

This section orients new developers to the Jambys fork of Horizon.

### 1) Summary of development standards

- Follow the centralized guide in `horizon/DEVELOPMENT-STANDARDS-REFERENCE.md`. Key points:
  - CSS: BEM naming, minimal specificity, no hardcoded colors; use semantic variables and design tokens; accessibility-first focus (focus indicators, reduced motion, dark mode readiness).
  - JavaScript: Zero external dependencies, `async/await`, early returns, component framework with custom elements and typed CustomEvents; AbortController for cancellable work; URL/URLSearchParams for state.
  - Liquid: Clean syntax, co-locate component-specific `{% stylesheet %}` and `{% javascript %}`, and leverage settings via scoped CSS variables on sections/blocks.
  - Accessibility: Enforce WCAG 2.2 color contrast and component patterns (accordions, modals, carousels, tabs, etc.).
  - Workflow: Read relevant rules before edits, test contrast, document changes, and keep living docs updated.

### 2) Summary of updates to the Horizon fork

- Brand color system aligned to Jambys:
  - Primary `#36409a` (Jambys blue); hover `#2a2f7a`; backgrounds `#f5f5f5`; borders `#e6e6e6`.
  - Replaced legacy colors (old blue `#000f9f`, black in primary roles) across `config/settings_data.json` with accessible equivalents.
  - Standardized hover/contrast relationships per WCAG 2.2.
- Fonts & colors migration (V1) completed; preview file `horizon-font-color-preview.html` documents typography and palette usage.
- Theme structure fixes and missing assets/snippets added for GitHub integration; brand stylesheet introduced at `horizon/assets/jambys-brand.css`.
- Settings data protection guidelines established; always pull from Shopify before editing `settings_data.json` and document modifications in `horizon/HORIZON-DEVELOPMENT-LOG.md`.

See `horizon/HORIZON-DEVELOPMENT-LOG.md` for dated commits and details.

### 3) Cursor references and rules

- Color contrast enforcement (WCAG 2.2 1.4.3/1.4.11) across `.css/.js/.ts/.liquid/.html` with guidance and examples.
- CSS standards: variables over literals, BEM, scoped variables on section/block `style`, container queries, cascade layers, logical properties.
- JavaScript standards: component framework, event-driven communication, defensive programming, debouncing, optimistic UI.
- Liquid and sections/blocks/theme-settings standards; localization/locales best practices.
- Living docs: Keep `.cursor/prompts` and `.cursor/references` updated with new patterns and pitfalls.

### 4) Quick links to key docs

- Development Standards Reference: `horizon/DEVELOPMENT-STANDARDS-REFERENCE.md`
- Horizon Replatform Guide: `horizon/jambys-horizon-replatform-guide.md`
- V1 Migration Summary (Fonts & Colors): `horizon/jambys-v1-migration-summary-fonts-colors.md`
- Developer Handoff: `Jambys-Theme-Developer-Handoff.md`

## Getting started

We recommend using the Skeleton Theme as a starting point for theme development. [Learn more on Shopify.dev](https://shopify.dev/themes/getting-started/create).

> If you're building a theme for the Shopify Theme Store, then do not use Horizon as a starting point. Themes based on, derived from, or incorporating Horizon are not eligible for submission to to the Shopify Theme Store. Use the [Skeleton Theme](https://github.com/Shopify/skeleton-theme) instead. Learn about the [theme developer tools](https://shopify.dev/docs/storefronts/themes/tools).

Please note that the main branch may include code for features not yet released. The "stable" version of Horizon is available in the theme store.

## Staying up to date with Horizon changes

Say you're building a new theme off Horizon but you still want to be able to pull in the latest changes, you can add a remote `upstream` pointing to this Horizon repository.

1. Navigate to your local theme folder.
2. Verify the list of remotes and validate that you have both an `origin` and `upstream`:

```sh
git remote -v
```

3. If you don't see an `upstream`, you can add one that points to Shopify's Horizon repository:

```sh
git remote add upstream https://github.com/Shopify/horizon.git
```

4. Pull in the latest Horizon changes into your repository:

```sh
git fetch upstream
git pull upstream main
```

## Developer tools

There are a number of really useful tools that the Shopify Themes team uses during development. Horizon is already set up to work with these tools.

### Shopify CLI

[Shopify CLI](https://shopify.dev/docs/storefronts/themes/tools/cli) helps you build Shopify themes faster and is used to automate and enhance your local development workflow. It comes bundled with a suite of commands for developing Shopify themes—everything from working with themes on a Shopify store (e.g. creating, publishing, deleting themes) or launching a development server for local theme development.

You can follow this [quick start guide for theme developers](https://shopify.dev/docs/themes/tools/cli) to get started.

### Theme Check

We recommend using [Theme Check](https://github.com/shopify/theme-check) as a way to validate and lint your Shopify themes.

We've added Theme Check to Horizon's [list of VS Code extensions](/.vscode/extensions.json) so if you're using Visual Studio Code as your code editor of choice, you'll be prompted to install the [Theme Check VS Code](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) extension upon opening VS Code after you've forked and cloned Horizon.

You can also run it from a terminal with the following Shopify CLI command:

```bash
shopify theme check
```

You can follow the [theme check documentation](https://shopify.dev/docs/storefronts/themes/tools/theme-check) for more details.

### Continuous Integration

Horizon uses [GitHub Actions](https://github.com/features/actions) to maintain the quality of the theme. [This is a starting point](https://github.com/Shopify/horizon-private/blob/main/.github/workflows/ci.yml) and what we suggest to use in order to ensure you're building better themes. Feel free to build off of it!

#### Shopify/theme-check-action

Horizon runs [Theme Check](#Theme-Check) on every commit via [Shopify/theme-check-action](https://github.com/Shopify/theme-check-action).

## Contributing

We are not accepting contributions to Horizon at this time.

## License

Copyright (c) 2025-present Shopify Inc. See [LICENSE](/LICENSE.md) for further details.
