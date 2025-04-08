/**
 * Simple loader for handling .node binary files in webpack
 */
module.exports = function nodeLoader() {
  return 'module.exports = {};';
}; 