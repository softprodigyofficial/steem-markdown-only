'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAccountName = validateAccountName;
/**
 * This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://github.com/steemit/steemit.com/blob/06c90aa8260f09c4ae061e652d884f68b8a6a409/app/utils/ChainValidation.js
 */

function validateAccountName(value) {
  var label = void 0;
  var suffix = void 0;

  suffix = 'Account name should ';
  if (!value) {
    return suffix + 'not be empty.';
  }
  var length = value.length;
  if (length < 3) {
    return suffix + 'be longer.';
  }
  if (length > 16) {
    return suffix + 'be shorter.';
  }
  if (/\./.test(value)) {
    suffix = 'Each account segment should ';
  }
  var ref = value.split('.');
  for (var i = 0, len = ref.length; i < len; i += 1) {
    label = ref[i];
    if (!/^[a-z]/.test(label)) {
      return suffix + 'start with a letter.';
    }
    if (!/^[a-z0-9-]*$/.test(label)) {
      return suffix + 'have only letters, digits, or dashes.';
    }
    if (/--/.test(label)) {
      return suffix + 'have only one dash in a row.';
    }
    if (!/[a-z0-9]$/.test(label)) {
      return suffix + 'end with a letter or digit.';
    }
    if (!(label.length >= 3)) {
      return suffix + 'be longer';
    }
  }
  return null;
}

exports.default = null;
