'use strict';

/**
 * Canvas shim for environments where native canvas is not available
 */

// This file provides a minimal substitute for the canvas package when needed
const canvasShim = {
  // Basic Canvas constructor
  Canvas: function(width, height) {
    this.width = width || 300;
    this.height = height || 150;
    this.getContext = function(contextType) {
      return {
        // Minimal 2D context implementation
        fillRect: function() {},
        clearRect: function() {},
        getImageData: function() { return { data: [] }; },
        putImageData: function() {},
        createImageData: function() { return { data: [] }; },
        setTransform: function() {},
        drawImage: function() {},
        save: function() {},
        restore: function() {},
        translate: function() {},
        scale: function() {},
        rotate: function() {},
        fillText: function() {},
        measureText: function() { return { width: 0 }; },
        beginPath: function() {},
        closePath: function() {},
        moveTo: function() {},
        lineTo: function() {},
        fill: function() {},
        stroke: function() {},
        arc: function() {},
        drawFocusIfNeeded: function() {},
        isPointInPath: function() { return false; },
        isPointInStroke: function() { return false; }
      };
    };
    this.toDataURL = function() { return ''; };
    this.toBuffer = function() { return Buffer.from([]); };
  },
  
  // createCanvas function
  createCanvas: function(width, height) {
    return new this.Canvas(width, height);
  },
  
  // Image constructor
  Image: function() {
    this.width = 0;
    this.height = 0;
    this.complete = false;
    this.onload = function() {};
    this.onerror = function() {};
    this.src = '';
  },
  
  // loadImage function (returns a promise)
  loadImage: function() {
    return Promise.resolve(new this.Image());
  },
  
  // registerFont function (no-op)
  registerFont: function() {}
};

// Compatibility with both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = canvasShim;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return canvasShim; });
} else {
  this.canvas = canvasShim;
} 