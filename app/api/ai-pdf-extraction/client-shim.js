// This is a client-side shim for chrome-aws-lambda to prevent errors during client-side bundling

const chromiumShim = {
  // Empty implementation to prevent errors
  executablePath: null,
  headless: true,
  args: [],
  defaultViewport: null,
  // Add mock functions that might be referenced
  puppeteer: {
    launch: () => Promise.resolve({
      newPage: () => Promise.resolve({
        goto: () => Promise.resolve(),
        setViewport: () => Promise.resolve(),
        screenshot: () => Promise.resolve(),
        close: () => Promise.resolve()
      }),
      close: () => Promise.resolve()
    })
  }
};

// Export both default and named exports to handle different import styles
module.exports = chromiumShim;
export default chromiumShim; 