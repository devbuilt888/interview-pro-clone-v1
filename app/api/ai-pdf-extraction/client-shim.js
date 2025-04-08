// This is a client-side shim for chrome-aws-lambda to prevent errors during client-side bundling

const chromiumShim = {
  // Empty implementation to prevent errors
  executablePath: null,
  headless: true,
  args: [],
  defaultViewport: null
};

export default chromiumShim; 