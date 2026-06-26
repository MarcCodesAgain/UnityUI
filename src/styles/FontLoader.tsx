// ─── FontLoader ───────────────────────────────────────────────────────────────
//
// @import inside a <style> tag is spec-invalid and silently ignored in browsers.
// Use <FontLoader /> once at your app root (before <GlobalStyles />) instead.
//
// Example:
//   <FontLoader />
//   <GlobalStyles />
//   <ThemeProvider theme={theme}>
//     <App />
//   </ThemeProvider>

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800' +
  '&family=JetBrains+Mono:wght@400;500;600&display=swap';

export function FontLoader() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONT_HREF} />
    </>
  );
}
