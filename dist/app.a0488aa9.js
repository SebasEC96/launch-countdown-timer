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
})({"ts/app.ts":[function(require,module,exports) {
//----------------------MODAL----------------------
var modal = document.getElementById("modal");
var modalBtn = document.getElementById("modalBtn");
var closeBtn = document.getElementById("closeModal");
var clockForm = document.querySelector("#clockForm");
modalBtn.addEventListener("click", function () {
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
});
closeBtn.addEventListener("click", function () {
  modal.style.opacity = "0";
  modal.style.visibility = "hidden";
});
clockForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var formData = new FormData(clockForm);
  var editedDeadline = setDeadline({
    days: Number(formData.get("day")),
    hours: Number(formData.get("hour")),
    minutes: Number(formData.get("minute")),
    seconds: Number(formData.get("second")) + 2
  }); // Hide modal

  modal.style.opacity = "0";
  modal.style.visibility = "hidden"; // Reinitialize Clock

  clearInterval(timeInterval);
  initializeClock(editedDeadline);
  clockForm.reset();
});

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
  }
};

window.addEventListener("load", function () {
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
}); //----------------------Calculate Remaining Time----------------------

var getTimeRemaining = function getTimeRemaining(endtime) {
  var total = Date.parse(endtime) - new Date().getTime();
  var seconds = Math.floor(total / 1000 % 60);
  var minutes = Math.floor(total / 1000 / 60 % 60);
  var hours = Math.floor(total / (1000 * 60 * 60) % 24);
  var days = Math.floor(total / (1000 * 60 * 60 * 24));

  if (days > 99) {
    days = 99;
  }

  return {
    total: total,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}; // Define Clock Main Interval Globally


var timeInterval = setInterval(function () {}, 1000);

var initializeClock = function initializeClock(endtime) {
  var daysSpan = document.querySelectorAll("#days-number");
  var daysSpanFlip = document.querySelectorAll("#flip-days-number");
  var hoursSpan = document.querySelectorAll("#hours-number");
  var hoursSpanFlip = document.querySelectorAll("#flip-hours-number");
  var minutesSpan = document.querySelectorAll("#minutes-number");
  var minutesSpanFlip = document.querySelectorAll("#flip-minutes-number");
  var secondsSpan = document.querySelectorAll("#seconds-number");
  var secondsSpanFlip = document.querySelectorAll("#flip-seconds-number");

  var updateClock = function updateClock() {
    var t = getTimeRemaining(endtime); //Animate Function

    var animateCountdown = function animateCountdown(elementTop, elementBottom, spanFlipTop, spanFlipBottom, time) {
      elementTop.style.animation = "top-to-bottom 0.5s linear";
      elementBottom.style.animation = "bottom-to-top 0.5s linear";

      var animationTopCB = function animationTopCB() {
        elementTop.style.animation = "";
        elementTop.removeEventListener("animationend", animationTopCB);
        spanFlipTop.innerHTML = ("0" + time).slice(-2);
      };

      var animationBottomCB = function animationBottomCB() {
        elementBottom.style.animation = "";
        elementBottom.removeEventListener("animationend", animationBottomCB);
        spanFlipBottom.innerHTML = ("0" + time).slice(-2);
      };

      elementTop.addEventListener("animationend", animationTopCB);
      elementBottom.addEventListener("animationend", animationBottomCB);
    }; // Update Seconds if has changed (Always)


    if (t.seconds >= 0) {
      var flipCardTopS = document.getElementById("flip-card-top-s");
      var flipCardBottomS = document.getElementById("flip-card-bottom-s");
      secondsSpan[0].innerHTML = ("0" + t.seconds).slice(-2);
      animateCountdown(flipCardTopS, flipCardBottomS, secondsSpanFlip[0], secondsSpan[1], t.seconds);
      secondsSpanFlip[1].innerHTML = ("0" + t.seconds).slice(-2);
    } // Update Minutes if has changed


    if (parseInt(minutesSpan[0].innerHTML) !== t.minutes && t.minutes >= 0) {
      console.log(minutesSpan[0].innerHTML);
      console.log(t.minutes.toString());
      var flipCardTopM = document.getElementById("flip-card-top-m");
      var flipCardBottomM = document.getElementById("flip-card-bottom-m");
      minutesSpan[0].innerHTML = ("0" + t.minutes).slice(-2);
      animateCountdown(flipCardTopM, flipCardBottomM, minutesSpanFlip[0], minutesSpan[1], t.minutes);
      minutesSpanFlip[1].innerHTML = ("0" + t.minutes).slice(-2);
    } // Update Hours if has changed


    if (parseInt(hoursSpan[0].innerHTML) !== t.hours && t.hours >= 0) {
      var flipCardTopH = document.getElementById("flip-card-top-h");
      var flipCardBottomH = document.getElementById("flip-card-bottom-h");
      hoursSpan[0].innerHTML = ("0" + t.hours).slice(-2);
      animateCountdown(flipCardTopH, flipCardBottomH, hoursSpanFlip[0], hoursSpan[1], t.hours);
      hoursSpanFlip[1].innerHTML = ("0" + t.hours).slice(-2);
    } // Update Days if has changed


    if (parseInt(daysSpan[0].innerHTML) !== t.days && t.days >= 0) {
      var flipCardTopD = document.getElementById("flip-card-top-d");
      var flipCardBottomD = document.getElementById("flip-card-bottom-d");
      daysSpan[0].innerHTML = ("0" + t.days).slice(-2);
      animateCountdown(flipCardTopD, flipCardBottomD, daysSpanFlip[0], daysSpan[1], t.days);
      daysSpanFlip[1].innerHTML = ("0" + t.days).slice(-2);
    } // Stops the countdown when it reaches zero


    if (t.total <= 0) {
      clearInterval(timeInterval);
    }
  };

  timeInterval = setInterval(function () {
    updateClock();
  }, 1000);
}; //


var setDeadline = function setDeadline(_a) {
  var days = _a.days,
      hours = _a.hours,
      minutes = _a.minutes,
      seconds = _a.seconds;
  return new Date(new Date().getTime() + days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000).toISOString();
};
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41433" + '/');

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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","ts/app.ts"], null)
//# sourceMappingURL=/app.a0488aa9.js.map