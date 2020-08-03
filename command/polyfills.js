'use strict';

require('whatwg-fetch');

require('core-js/es/map');

require('core-js/es/set');

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable(); //promise/lib/es6-extensions.js低版本UC上有问题，替换成pinkie-promise

  window.Promise = require('pinkie-promise');
} //低版本浏览器不支持fetch添加一个腻子包
//android5 IOS 8.4 有Object.assign兼容性问题

/*兼容性处理 Object.assign 用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象*/

if (typeof Object.assign !== 'function') {
  Object.assign = function (target, varArgs) {
    // .length of function is 2
    if (target === null) {
      // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource !== null) {
        // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }

    return to;
  };
}

if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}
