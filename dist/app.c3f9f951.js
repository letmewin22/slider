// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@emotionagency/utils/build/raf/raf.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raf = exports.RAF = void 0;
class RAF {
    constructor() {
        this.cbArray = [];
        this.animation();
    }
    on(cb) {
        this.cbArray.push(cb);
    }
    off(cb) {
        this.cbArray = this.cbArray.filter(e => e !== cb);
    }
    animation() {
        this.cbArray.forEach(cb => cb());
        requestAnimationFrame(this.animation.bind(this));
    }
}
exports.RAF = RAF;
const RAFInstance = new RAF();
exports.raf = {
    on: (cb) => RAFInstance.on(cb),
    off: (cb) => RAFInstance.off(cb),
};

},{}],"node_modules/debounce/index.js":[function(require,module,exports) {
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear' 
 * that is a function which will clear the timer to prevent previously scheduled executions. 
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */
function debounce(func, wait, immediate){
  var timeout, args, context, timestamp, result;
  if (null == wait) wait = 100;

  function later() {
    var last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  var debounced = function(){
    context = this;
    args = arguments;
    timestamp = Date.now();
    var callNow = immediate && !timeout;
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  debounced.clear = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  debounced.flush = function() {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;
      
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
};

// Adds compatibility for ES modules
debounce.debounce = debounce;

module.exports = debounce;

},{}],"node_modules/@emotionagency/utils/build/resize/resize.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resize = exports.Resize = void 0;
const debounce_1 = require("debounce");
class Resize {
    constructor() {
        this.cbArray = [];
        this.init();
    }
    bounds() {
        const methods = ['resizeHandler'];
        methods.forEach(fn => {
            this[fn] = this[fn].bind(this);
        });
    }
    init() {
        this.bounds();
        this.debounced = debounce_1.debounce(this.resizeHandler, 60);
        window.addEventListener('resize', this.debounced);
    }
    resizeHandler() {
        this.cbArray.forEach(cb => cb());
    }
    on(cb) {
        cb();
        this.cbArray.push(cb);
    }
    off(cb) {
        this.cbArray = this.cbArray.filter(e => e !== cb);
    }
    destroy() {
        window.removeEventListener('resize', this.resizeHandler);
    }
}
exports.Resize = Resize;
const resizeInstance = new Resize();
exports.resize = {
    on: (cb) => resizeInstance.on(cb),
    off: (cb) => resizeInstance.off(cb),
};

},{"debounce":"node_modules/debounce/index.js"}],"node_modules/@emotionagency/utils/build/math.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = exports.lerp = void 0;
const lerp = (a, b, n) => {
    return a * (1 - n) + b * n;
};
exports.lerp = lerp;
const clamp = (num, a, b) => {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
};
exports.clamp = clamp;

},{}],"node_modules/@emotionagency/utils/build/createNewElement.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewElement = void 0;
const createNewElement = (tag, classes) => {
    const elem = document.createElement(tag);
    elem.classList.add(classes);
    return elem;
};
exports.createNewElement = createNewElement;

},{}],"node_modules/@emotionagency/utils/build/mutationObserver.js":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mutationObserver = (target, outsideCallback) => {
    const config = {
        childList: true,
    };
    const callback = function (mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                outsideCallback();
                // console.log('A child node has been added or removed.')
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(target, config);
    return () => observer.disconnect();
};
exports.default = mutationObserver;

},{}],"node_modules/@emotionagency/utils/build/index.js":[function(require,module,exports) {
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationObserver = exports.createNewElement = exports.lerp = exports.clamp = exports.resize = exports.raf = void 0;
const raf_1 = require("./raf/raf");
Object.defineProperty(exports, "raf", { enumerable: true, get: function () { return raf_1.raf; } });
const resize_1 = require("./resize/resize");
Object.defineProperty(exports, "resize", { enumerable: true, get: function () { return resize_1.resize; } });
const math_1 = require("./math");
Object.defineProperty(exports, "clamp", { enumerable: true, get: function () { return math_1.clamp; } });
Object.defineProperty(exports, "lerp", { enumerable: true, get: function () { return math_1.lerp; } });
const createNewElement_1 = require("./createNewElement");
Object.defineProperty(exports, "createNewElement", { enumerable: true, get: function () { return createNewElement_1.createNewElement; } });
const mutationObserver_1 = __importDefault(require("./mutationObserver"));
exports.mutationObserver = mutationObserver_1.default;

},{"./raf/raf":"node_modules/@emotionagency/utils/build/raf/raf.js","./resize/resize":"node_modules/@emotionagency/utils/build/resize/resize.js","./math":"node_modules/@emotionagency/utils/build/math.js","./createNewElement":"node_modules/@emotionagency/utils/build/createNewElement.js","./mutationObserver":"node_modules/@emotionagency/utils/build/mutationObserver.js"}],"js/Slider.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slider = void 0;

var _utils = require("@emotionagency/utils");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Slider = /*#__PURE__*/function () {
  function Slider() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Slider);

    _defineProperty(this, "slider", document.querySelector('.js-slider'));

    _defineProperty(this, "sliderInner", this.slider.querySelector('.js-slider__inner'));

    _defineProperty(this, "slides", _toConsumableArray(this.slider.querySelectorAll('.js-slide')));

    _defineProperty(this, "startX", 0);

    _defineProperty(this, "endX", 0);

    _defineProperty(this, "currentX", 0);

    _defineProperty(this, "lastX", 0);

    _defineProperty(this, "min", 0);

    _defineProperty(this, "max", 0);

    _defineProperty(this, "offset", 0);

    this.opts = {
      el: opts.el || '.js-slider',
      ease: opts.ease || 0.1,
      speed: opts.speed || 1.5,
      offset: opts.offset || 220,
      velocity: 25
    };
  }

  _createClass(Slider, [{
    key: "bounds",
    value: function bounds() {
      var _this = this;

      var methods = ['onMousemove', 'onMousedown', 'onMouseup', 'animate', 'resize'];
      methods.forEach(function (fn) {
        _this[fn] = _this[fn].bind(_this);
      });
    }
  }, {
    key: "init",
    value: function init() {
      this.bounds();
      this.slider.addEventListener('mousedown', this.onMousedown);
      this.slider.addEventListener('touchstart', this.onMousedown);
      document.body.addEventListener('mouseup', this.onMouseup);
      this.slider.addEventListener('touchend', this.onMousedown);
      this.setSizes();

      _utils.raf.on(this.animate);

      _utils.resize.on(this.resize);
    }
  }, {
    key: "sizes",
    get: function get() {
      return this.slider.getBoundingClientRect();
    }
  }, {
    key: "setSizes",
    value: function setSizes() {
      var sliderWidth = this.slider.scrollWidth + this.sizes.left;
      this.min = 0;
      this.max = -(sliderWidth - window.innerWidth);
    }
  }, {
    key: "onMousemove",
    value: function onMousemove(e) {
      var _e$clientX, _e$clientX2;

      var left = (_e$clientX = e.clientX) !== null && _e$clientX !== void 0 ? _e$clientX : e.touches[0].clientX;
      console.log((_e$clientX2 = e.clientX) !== null && _e$clientX2 !== void 0 ? _e$clientX2 : e.touches[0].clientX);
      this.currentX = this.endX + (left - this.startX) * this.opts.speed;
      this.currentX = (0, _utils.clamp)(this.currentX, this.min + this.offset, this.max - this.offset);
    }
  }, {
    key: "onMousedown",
    value: function onMousedown(e) {
      var _e$clientX3;

      document.body.addEventListener('mousemove', this.onMousemove, {
        passive: true
      });
      document.body.addEventListener('touchmove', this.onMousemove, {
        passive: true
      });
      this.startX = (_e$clientX3 = e.clientX) !== null && _e$clientX3 !== void 0 ? _e$clientX3 : e.touches[0].clientX;
      this.slider.classList.add('is-grabbing');
      this.slides.forEach(function (slide, idx) {
        slide.style.transform = "translateX(".concat(-16 * idx, "px)");
      });
      this.offset += this.opts.offset;
      this.currentX = (0, _utils.clamp)(this.currentX, this.min, this.max);
    }
  }, {
    key: "onMouseup",
    value: function onMouseup() {
      this.offset = 0;
      this.currentX = (0, _utils.clamp)(this.currentX, this.min, this.max);
      document.body.removeEventListener('mousemove', this.onMousemove, {
        passive: true
      });
      document.body.removeEventListener('touchmove', this.onMousemove, {
        passive: true
      });
      this.slides.forEach(function (slide, idx) {
        slide.style.transform = 'translateX(0px)';
      });
      this.endX = this.currentX;
      this.slider.classList.remove('is-grabbing');
    }
  }, {
    key: "resize",
    value: function resize() {
      this.setSizes();
    }
  }, {
    key: "animate",
    value: function animate() {
      this.lastX = (0, _utils.lerp)(this.lastX, this.currentX, this.opts.ease);
      this.lastX = Math.floor(this.lastX * 100) / 100;
      var sd = this.currentX - this.lastX;
      var acc = sd / window.innerWidth;
      var velo = +acc;
      this.sliderInner.style.transform = "translate3d(".concat(this.lastX, "px, 0, 0) skewX(").concat(velo * this.opts.velocity, "deg)");
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.slider.removeEventListener('mousedown', this.onMousedown);
      document.body.removeEventListener('mouseup', this.onMouseup);
      document.body.removeEventListener('mousemove', this.onMousemove, {
        passive: true
      });

      _utils.raf.off(this.animate);

      _utils.resize.off(this.resize);
    }
  }]);

  return Slider;
}();

exports.Slider = Slider;
},{"@emotionagency/utils":"node_modules/@emotionagency/utils/build/index.js"}],"img/1.jpg":[function(require,module,exports) {
module.exports = "/1.dc197a9a.jpg";
},{}],"js/app.js":[function(require,module,exports) {
"use strict";

var _Slider = require("./Slider");

var _ = _interopRequireDefault(require("/img/1.jpg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {Slider} from './ref/Slider2'
window.addEventListener('load', function () {
  var items = document.querySelectorAll('[data-bg]');
  items.forEach(function (el) {
    var url = el.getAttribute('data-bg');
    el.style.backgroundImage = "url(".concat(_.default, ")");
    el.setAttribute('data-bg', url);
  });
  var slider = new _Slider.Slider();
  slider.init();
});
},{"./Slider":"js/Slider.js","/img/1.jpg":"img/1.jpg"}],"C:/Users/Леонид/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49610" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/Леонид/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.js.map