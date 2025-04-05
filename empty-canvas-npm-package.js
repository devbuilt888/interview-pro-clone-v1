/**
 * Empty canvas shim
 * Provides empty implementations of canvas for PDF.js in serverless environments
 */
module.exports = {
  createCanvas: function() { 
    return {
      getContext: function() { return {}; },
      width: 0,
      height: 0
    }; 
  },
  loadImage: function() { 
    return Promise.resolve({
      width: 0,
      height: 0
    }); 
  },
  // Since node-canvas has various exports, supply dummy ones
  CanvasRenderingContext2D: function() {},
  CanvasPattern: function() {},
  CanvasGradient: function() {},
  Image: function() {},
  ImageData: function() {},
  PNGStream: function() {},
  JPEGStream: function() {},
  PDFStream: function() {}
}; 