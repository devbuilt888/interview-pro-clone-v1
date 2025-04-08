/**
 * This file fixes issues with source map files in chrome-aws-lambda
 * It's used to prevent webpack errors during bundle preprocessing
 */

// This is a no-op module that gets called when webpack tries to process .map files
module.exports = function fixMapFileProcessing(source) {
  // Return an empty module to prevent errors
  return 'module.exports = {};';
}; 