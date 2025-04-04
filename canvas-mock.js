// Empty mock implementation for canvas
// This prevents build errors on Vercel where the native canvas dependency fails to compile

module.exports = {
  // Required minimum to prevent PDF.js from failing when it tries to use canvas
  createCanvas: () => ({
    getContext: () => ({
      drawImage: () => {},
      fillText: () => {},
      scale: () => {},
      measureText: () => ({ width: 0 }),
      fillRect: () => {},
      save: () => {},
      restore: () => {},
      clearRect: () => {}
    }),
    width: 0,
    height: 0
  }),
  loadImage: () => Promise.resolve({
    width: 0,
    height: 0
  })
}; 