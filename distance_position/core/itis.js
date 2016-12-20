/** 
 * @original axis.js
 * @coder toddmotto
 * @github https://github.com/toddmotto/axis
 * @desc_added Aug 23, 2016
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.itis = factory();
  }
}(this, function () {

  'use strict';

  var itis = {};

  var types = 'Array Object String Date RegExp Function Boolean Number Null Undefined'.split(' ');

  function type() {
    return Object.prototype.toString.call(this).slice(8, -1);
  }

  for (var i = types.length; i--;) {
    itis[types[i]] = (function (self) {
      return function (elem) {
        return type.call(elem) === self;
      };
    })(types[i]);
  }

  // custom additions
  itis['Empty'] = function (x) {
    return itis.Null(x) || itis.Undefined(x)
  }

  return itis;

}));
