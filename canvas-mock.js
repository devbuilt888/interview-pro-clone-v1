'use strict';

// Empty mock implementation for canvas
// This prevents build errors on Vercel where the native canvas dependency fails to compile

module.exports = {
  // Required minimum to prevent PDF.js from failing when it tries to use canvas
  createCanvas: function() {
    return {
      getContext: function() {
        return {
          drawImage: function() {},
          fillText: function() {},
          scale: function() {},
          measureText: function() { return { width: 0 }; },
          fillRect: function() {},
          save: function() {},
          restore: function() {},
          clearRect: function() {}
        };
      },
      width: 0,
      height: 0
    };
  },
  loadImage: function() {
    return Promise.resolve({
      width: 0,
      height: 0
    });
  }
}; 