# Changelog

## Unreleased

### Docs
- The quick start said fonts load through `GlobalStyles`; they don't. It now shows `<FontLoader />`, and Storybook loads the fonts too (it was rendering JetBrains Mono as Courier).

## 1.0.5

### Fixed
- `CountUp` never animated when `triggerOnView` was on (the default): the observed element used `display: contents`, which has no box, so `IntersectionObserver` never reported it in view and the number stayed at `from`.
- `DataTable`: `onSelectionChange` fired twice per click under React StrictMode (it ran inside a state updater). It now fires exactly once.
- `useModal` / `useCommandPalette`: `toggle()` notified `onOpenChange` twice under StrictMode, for the same reason. Both hooks now share a single `useDisclosure` implementation.
- Dev-only warnings no longer throw `ReferenceError: process is not defined` when the package is loaded without a bundler that defines `process` (e.g. from an ESM CDN).
- `DataTable`'s missing-`rowKey` warning is logged once instead of on every render.

### Docs
- Install and import examples used a package name that isn't this one (`@unityui/core`); they now use `@marcllopis/unityui`, in the README and in Storybook.
- Added the MIT `LICENSE` file the README already linked to, plus repository, issues and keyword metadata for npm.
