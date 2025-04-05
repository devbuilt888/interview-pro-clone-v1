'use strict';

/**
 * Empty canvas shim to prevent native dependency issues
 * Used to satisfy PDF.js and other canvas dependent modules
 * without requiring native binaries
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