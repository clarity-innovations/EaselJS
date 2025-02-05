(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../src/createjs/events/Event.js
  var require_Event = __commonJS({
    "../src/createjs/events/Event.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Event(type, bubbles, cancelable) {
          this.type = type;
          this.target = null;
          this.currentTarget = null;
          this.eventPhase = 0;
          this.bubbles = !!bubbles;
          this.cancelable = !!cancelable;
          this.timeStamp = (/* @__PURE__ */ new Date()).getTime();
          this.defaultPrevented = false;
          this.propagationStopped = false;
          this.immediatePropagationStopped = false;
          this.removed = false;
        }
        var p = Event.prototype;
        p.preventDefault = function() {
          this.defaultPrevented = this.cancelable && true;
        };
        p.stopPropagation = function() {
          this.propagationStopped = true;
        };
        p.stopImmediatePropagation = function() {
          this.immediatePropagationStopped = this.propagationStopped = true;
        };
        p.remove = function() {
          this.removed = true;
        };
        p.clone = function() {
          return new Event(this.type, this.bubbles, this.cancelable);
        };
        p.set = function(props) {
          for (var n in props) {
            this[n] = props[n];
          }
          return this;
        };
        p.toString = function() {
          return "[Event (type=" + this.type + ")]";
        };
        createjs.Event = Event;
      })();
    }
  });

  // ../src/createjs/events/EventDispatcher.js
  var require_EventDispatcher = __commonJS({
    "../src/createjs/events/EventDispatcher.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function EventDispatcher() {
          this._listeners = null;
          this._captureListeners = null;
        }
        var p = EventDispatcher.prototype;
        EventDispatcher.initialize = function(target) {
          target.addEventListener = p.addEventListener;
          target.on = p.on;
          target.removeEventListener = target.off = p.removeEventListener;
          target.removeAllEventListeners = p.removeAllEventListeners;
          target.hasEventListener = p.hasEventListener;
          target.dispatchEvent = p.dispatchEvent;
          target._dispatchEvent = p._dispatchEvent;
          target.willTrigger = p.willTrigger;
        };
        p.addEventListener = function(type, listener, useCapture) {
          var listeners;
          if (useCapture) {
            listeners = this._captureListeners = this._captureListeners || {};
          } else {
            listeners = this._listeners = this._listeners || {};
          }
          var arr = listeners[type];
          if (arr) {
            this.removeEventListener(type, listener, useCapture);
          }
          arr = listeners[type];
          if (!arr) {
            listeners[type] = [listener];
          } else {
            arr.push(listener);
          }
          return listener;
        };
        p.on = function(type, listener, scope, once, data, useCapture) {
          if (listener.handleEvent) {
            scope = scope || listener;
            listener = listener.handleEvent;
          }
          scope = scope || this;
          return this.addEventListener(type, function(evt) {
            listener.call(scope, evt, data);
            once && evt.remove();
          }, useCapture);
        };
        p.removeEventListener = function(type, listener, useCapture) {
          var listeners = useCapture ? this._captureListeners : this._listeners;
          if (!listeners) {
            return;
          }
          var arr = listeners[type];
          if (!arr) {
            return;
          }
          for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] == listener) {
              if (l == 1) {
                delete listeners[type];
              } else {
                arr.splice(i, 1);
              }
              break;
            }
          }
        };
        p.off = p.removeEventListener;
        p.removeAllEventListeners = function(type) {
          if (!type) {
            this._listeners = this._captureListeners = null;
          } else {
            if (this._listeners) {
              delete this._listeners[type];
            }
            if (this._captureListeners) {
              delete this._captureListeners[type];
            }
          }
        };
        p.dispatchEvent = function(eventObj, bubbles, cancelable) {
          if (typeof eventObj == "string") {
            var listeners = this._listeners;
            if (!bubbles && (!listeners || !listeners[eventObj])) {
              return true;
            }
            eventObj = new createjs.Event(eventObj, bubbles, cancelable);
          } else if (eventObj.target && eventObj.clone) {
            eventObj = eventObj.clone();
          }
          try {
            eventObj.target = this;
          } catch (e) {
          }
          if (!eventObj.bubbles || !this.parent) {
            this._dispatchEvent(eventObj, 2);
          } else {
            var top = this, list = [top];
            while (top.parent) {
              list.push(top = top.parent);
            }
            var i, l = list.length;
            for (i = l - 1; i >= 0 && !eventObj.propagationStopped; i--) {
              list[i]._dispatchEvent(eventObj, 1 + (i == 0));
            }
            for (i = 1; i < l && !eventObj.propagationStopped; i++) {
              list[i]._dispatchEvent(eventObj, 3);
            }
          }
          return !eventObj.defaultPrevented;
        };
        p.hasEventListener = function(type) {
          var listeners = this._listeners, captureListeners = this._captureListeners;
          return !!(listeners && listeners[type] || captureListeners && captureListeners[type]);
        };
        p.willTrigger = function(type) {
          var o = this;
          while (o) {
            if (o.hasEventListener(type)) {
              return true;
            }
            o = o.parent;
          }
          return false;
        };
        p.toString = function() {
          return "[EventDispatcher]";
        };
        p._dispatchEvent = function(eventObj, eventPhase) {
          var l, arr, listeners = eventPhase <= 2 ? this._captureListeners : this._listeners;
          if (eventObj && listeners && (arr = listeners[eventObj.type]) && (l = arr.length)) {
            try {
              eventObj.currentTarget = this;
            } catch (e) {
            }
            try {
              eventObj.eventPhase = eventPhase | 0;
            } catch (e) {
            }
            eventObj.removed = false;
            arr = arr.slice();
            for (var i = 0; i < l && !eventObj.immediatePropagationStopped; i++) {
              var o = arr[i];
              if (o.handleEvent) {
                o.handleEvent(eventObj);
              } else {
                o(eventObj);
              }
              if (eventObj.removed) {
                this.off(eventObj.type, o, eventPhase == 1);
                eventObj.removed = false;
              }
            }
          }
          if (eventPhase === 2) {
            this._dispatchEvent(eventObj, 2.1);
          }
        };
        createjs.EventDispatcher = EventDispatcher;
      })();
    }
  });

  // ../src/createjs/utils/deprecate.js
  var require_deprecate = __commonJS({
    "../src/createjs/utils/deprecate.js"(exports) {
      exports.createjs = exports.createjs || {};
      createjs.deprecate = function(fallbackMethod, name) {
        "use strict";
        return function() {
          var msg = "Deprecated property or method '" + name + "'. See docs for info.";
          console && (console.warn ? console.warn(msg) : console.log(msg));
          return fallbackMethod && fallbackMethod.apply(this, arguments);
        };
      };
    }
  });

  // ../src/createjs/utils/extend.js
  var require_extend = __commonJS({
    "../src/createjs/utils/extend.js"(exports) {
      exports.createjs = exports.createjs || {};
      createjs.extend = function(subclass, superclass) {
        "use strict";
        function o() {
          this.constructor = subclass;
        }
        o.prototype = superclass.prototype;
        return subclass.prototype = new o();
      };
    }
  });

  // ../src/createjs/utils/indexOf.js
  var require_indexOf = __commonJS({
    "../src/createjs/utils/indexOf.js"(exports) {
      exports.createjs = exports.createjs || {};
      createjs.indexOf = function(array, searchElement) {
        "use strict";
        for (var i = 0, l = array.length; i < l; i++) {
          if (searchElement === array[i]) {
            return i;
          }
        }
        return -1;
      };
    }
  });

  // ../src/createjs/utils/promote.js
  var require_promote = __commonJS({
    "../src/createjs/utils/promote.js"(exports) {
      exports.createjs = exports.createjs || {};
      createjs.promote = function(subclass, prefix) {
        "use strict";
        var subP = subclass.prototype, supP = Object.getPrototypeOf && Object.getPrototypeOf(subP) || subP.__proto__;
        if (supP) {
          subP[(prefix += "_") + "constructor"] = supP.constructor;
          for (var n in supP) {
            if (subP.hasOwnProperty(n) && typeof supP[n] == "function") {
              subP[prefix + n] = supP[n];
            }
          }
        }
        return subclass;
      };
    }
  });

  // ../src/createjs/utils/Ticker.js
  var require_Ticker = __commonJS({
    "../src/createjs/utils/Ticker.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Ticker() {
          throw "Ticker cannot be instantiated.";
        }
        Ticker.RAF_SYNCHED = "synched";
        Ticker.RAF = "raf";
        Ticker.TIMEOUT = "timeout";
        Ticker.timingMode = null;
        Ticker.maxDelta = 0;
        Ticker.paused = false;
        Ticker.removeEventListener = null;
        Ticker.removeAllEventListeners = null;
        Ticker.dispatchEvent = null;
        Ticker.hasEventListener = null;
        Ticker._listeners = null;
        createjs.EventDispatcher.initialize(Ticker);
        Ticker._addEventListener = Ticker.addEventListener;
        Ticker.addEventListener = function() {
          !Ticker._inited && Ticker.init();
          return Ticker._addEventListener.apply(Ticker, arguments);
        };
        Ticker._inited = false;
        Ticker._startTime = 0;
        Ticker._pausedTime = 0;
        Ticker._ticks = 0;
        Ticker._pausedTicks = 0;
        Ticker._interval = 50;
        Ticker._lastTime = 0;
        Ticker._times = null;
        Ticker._tickTimes = null;
        Ticker._timerId = null;
        Ticker._raf = true;
        Ticker._setInterval = function(interval) {
          Ticker._interval = interval;
          if (!Ticker._inited) {
            return;
          }
          Ticker._setupTick();
        };
        Ticker.setInterval = createjs.deprecate(Ticker._setInterval, "Ticker.setInterval");
        Ticker._getInterval = function() {
          return Ticker._interval;
        };
        Ticker.getInterval = createjs.deprecate(Ticker._getInterval, "Ticker.getInterval");
        Ticker._setFPS = function(value) {
          Ticker._setInterval(1e3 / value);
        };
        Ticker.setFPS = createjs.deprecate(Ticker._setFPS, "Ticker.setFPS");
        Ticker._getFPS = function() {
          return 1e3 / Ticker._interval;
        };
        Ticker.getFPS = createjs.deprecate(Ticker._getFPS, "Ticker.getFPS");
        try {
          Object.defineProperties(Ticker, {
            interval: { get: Ticker._getInterval, set: Ticker._setInterval },
            framerate: { get: Ticker._getFPS, set: Ticker._setFPS }
          });
        } catch (e) {
          console.log(e);
        }
        Ticker.init = function() {
          if (Ticker._inited) {
            return;
          }
          Ticker._inited = true;
          Ticker._times = [];
          Ticker._tickTimes = [];
          Ticker._startTime = Ticker._getTime();
          Ticker._times.push(Ticker._lastTime = 0);
          Ticker.interval = Ticker._interval;
        };
        Ticker.reset = function() {
          if (Ticker._raf) {
            var f = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;
            f && f(Ticker._timerId);
          } else {
            clearTimeout(Ticker._timerId);
          }
          Ticker.removeAllEventListeners("tick");
          Ticker._timerId = Ticker._times = Ticker._tickTimes = null;
          Ticker._startTime = Ticker._lastTime = Ticker._ticks = Ticker._pausedTime = 0;
          Ticker._inited = false;
        };
        Ticker.getMeasuredTickTime = function(ticks) {
          var ttl = 0, times = Ticker._tickTimes;
          if (!times || times.length < 1) {
            return -1;
          }
          ticks = Math.min(times.length, ticks || Ticker._getFPS() | 0);
          for (var i = 0; i < ticks; i++) {
            ttl += times[i];
          }
          return ttl / ticks;
        };
        Ticker.getMeasuredFPS = function(ticks) {
          var times = Ticker._times;
          if (!times || times.length < 2) {
            return -1;
          }
          ticks = Math.min(times.length - 1, ticks || Ticker._getFPS() | 0);
          return 1e3 / ((times[0] - times[ticks]) / ticks);
        };
        Ticker.getTime = function(runTime) {
          return Ticker._startTime ? Ticker._getTime() - (runTime ? Ticker._pausedTime : 0) : -1;
        };
        Ticker.getEventTime = function(runTime) {
          return Ticker._startTime ? (Ticker._lastTime || Ticker._startTime) - (runTime ? Ticker._pausedTime : 0) : -1;
        };
        Ticker.getTicks = function(pauseable) {
          return Ticker._ticks - (pauseable ? Ticker._pausedTicks : 0);
        };
        Ticker._handleSynch = function() {
          Ticker._timerId = null;
          Ticker._setupTick();
          if (Ticker._getTime() - Ticker._lastTime >= (Ticker._interval - 1) * 0.97) {
            Ticker._tick();
          }
        };
        Ticker._handleRAF = function() {
          Ticker._timerId = null;
          Ticker._setupTick();
          Ticker._tick();
        };
        Ticker._handleTimeout = function() {
          Ticker._timerId = null;
          Ticker._setupTick();
          Ticker._tick();
        };
        Ticker._setupTick = function() {
          if (Ticker._timerId != null) {
            return;
          }
          var mode = Ticker.timingMode;
          if (mode == Ticker.RAF_SYNCHED || mode == Ticker.RAF) {
            var f = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
            if (f) {
              Ticker._timerId = f(mode == Ticker.RAF ? Ticker._handleRAF : Ticker._handleSynch);
              Ticker._raf = true;
              return;
            }
          }
          Ticker._raf = false;
          Ticker._timerId = setTimeout(Ticker._handleTimeout, Ticker._interval);
        };
        Ticker._tick = function() {
          var paused = Ticker.paused;
          var time = Ticker._getTime();
          var elapsedTime = time - Ticker._lastTime;
          Ticker._lastTime = time;
          Ticker._ticks++;
          if (paused) {
            Ticker._pausedTicks++;
            Ticker._pausedTime += elapsedTime;
          }
          if (Ticker.hasEventListener("tick")) {
            var event = new createjs.Event("tick");
            var maxDelta = Ticker.maxDelta;
            event.delta = maxDelta && elapsedTime > maxDelta ? maxDelta : elapsedTime;
            event.paused = paused;
            event.time = time;
            event.runTime = time - Ticker._pausedTime;
            Ticker.dispatchEvent(event);
          }
          Ticker._tickTimes.unshift(Ticker._getTime() - time);
          while (Ticker._tickTimes.length > 100) {
            Ticker._tickTimes.pop();
          }
          Ticker._times.unshift(time);
          while (Ticker._times.length > 100) {
            Ticker._times.pop();
          }
        };
        var w = window, now = w.performance.now || w.performance.mozNow || w.performance.msNow || w.performance.oNow || w.performance.webkitNow;
        Ticker._getTime = function() {
          return (now && now.call(w.performance) || (/* @__PURE__ */ new Date()).getTime()) - Ticker._startTime;
        };
        createjs.Ticker = Ticker;
      })();
    }
  });

  // ../src/easeljs/display/Bitmap.js
  var require_Bitmap = __commonJS({
    "../src/easeljs/display/Bitmap.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        function Bitmap(imageOrUri) {
          this.DisplayObject_constructor();
          if (typeof imageOrUri == "string") {
            this.image = document.createElement("img");
            this.image.src = imageOrUri;
          } else {
            this.image = imageOrUri;
          }
          this.sourceRect = null;
          this._webGLRenderStyle = createjs.DisplayObject._StageGL_BITMAP;
        }
        var p = createjs.extend(Bitmap, createjs.DisplayObject);
        p.initialize = Bitmap;
        p.isVisible = function() {
          var image = this.image;
          var hasContent = this.cacheCanvas || image && (image.naturalWidth || image.getContext || image.readyState >= 2);
          return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        p.draw = function(ctx, ignoreCache) {
          if (this.DisplayObject_draw(ctx, ignoreCache)) {
            return true;
          }
          var img = this.image, rect = this.sourceRect;
          if (img.getImage) {
            img = img.getImage();
          }
          if (!img) {
            return true;
          }
          if (rect) {
            var x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height, x = 0, y = 0, w = img.width, h = img.height;
            if (x1 < 0) {
              x -= x1;
              x1 = 0;
            }
            if (x2 > w) {
              x2 = w;
            }
            if (y1 < 0) {
              y -= y1;
              y1 = 0;
            }
            if (y2 > h) {
              y2 = h;
            }
            ctx.drawImage(img, x1, y1, x2 - x1, y2 - y1, x, y, x2 - x1, y2 - y1);
          } else {
            ctx.drawImage(img, 0, 0);
          }
          return true;
        };
        p.getBounds = function() {
          var rect = this.DisplayObject_getBounds();
          if (rect) {
            return rect;
          }
          var image = this.image, o = this.sourceRect || image;
          var hasContent = image && (image.naturalWidth || image.getContext || image.readyState >= 2);
          return hasContent ? this._rectangle.setValues(0, 0, o.width, o.height) : null;
        };
        p.clone = function(node) {
          var image = this.image;
          if (image && node) {
            image = image.cloneNode();
            image.src = image.src;
          }
          var o = new Bitmap(image);
          if (this.sourceRect) {
            o.sourceRect = this.sourceRect.clone();
          }
          this._cloneProps(o);
          return o;
        };
        p.toString = function() {
          return "[Bitmap (name=" + this.name + ")]";
        };
        createjs.Bitmap = createjs.promote(Bitmap, "DisplayObject");
      })();
    }
  });

  // ../src/easeljs/display/BitmapText.js
  var require_BitmapText = __commonJS({
    "../src/easeljs/display/BitmapText.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function BitmapText(text, spriteSheet) {
          this.Container_constructor();
          this.text = text || "";
          this.spriteSheet = spriteSheet;
          this.lineHeight = 0;
          this.letterSpacing = 0;
          this.spaceWidth = 0;
          this._oldProps = { text: 0, spriteSheet: 0, lineHeight: 0, letterSpacing: 0, spaceWidth: 0 };
          this._oldStage = null;
          this._drawAction = null;
        }
        var p = createjs.extend(BitmapText, createjs.Container);
        BitmapText.maxPoolSize = 100;
        BitmapText._spritePool = [];
        p.draw = function(ctx, ignoreCache) {
          if (this.DisplayObject_draw(ctx, ignoreCache)) {
            return;
          }
          this._updateState();
          this.Container_draw(ctx, ignoreCache);
        };
        p.getBounds = function() {
          this._updateText();
          return this.Container_getBounds();
        };
        p.isVisible = function() {
          var hasContent = this.cacheCanvas || this.spriteSheet && this.spriteSheet.complete && this.text;
          return !!(this.visible && this.alpha > 0 && this.scaleX !== 0 && this.scaleY !== 0 && hasContent);
        };
        p.clone = function() {
          return this._cloneProps(new BitmapText(this.text, this.spriteSheet));
        };
        p.addChild = p.addChildAt = p.removeChild = p.removeChildAt = p.removeAllChildren = function() {
        };
        p._updateState = function() {
          this._updateText();
        };
        p._cloneProps = function(o) {
          this.Container__cloneProps(o);
          o.lineHeight = this.lineHeight;
          o.letterSpacing = this.letterSpacing;
          o.spaceWidth = this.spaceWidth;
          return o;
        };
        p._getFrameIndex = function(character, spriteSheet) {
          var c, o = spriteSheet.getAnimation(character);
          if (!o) {
            character != (c = character.toUpperCase()) || character != (c = character.toLowerCase()) || (c = null);
            if (c) {
              o = spriteSheet.getAnimation(c);
            }
          }
          return o && o.frames[0];
        };
        p._getFrame = function(character, spriteSheet) {
          var index = this._getFrameIndex(character, spriteSheet);
          return index == null ? index : spriteSheet.getFrame(index);
        };
        p._getLineHeight = function(ss) {
          var frame = this._getFrame("1", ss) || this._getFrame("T", ss) || this._getFrame("L", ss) || ss.getFrame(0);
          return frame ? frame.rect.height : 1;
        };
        p._getSpaceWidth = function(ss) {
          var frame = this._getFrame("1", ss) || this._getFrame("l", ss) || this._getFrame("e", ss) || this._getFrame("a", ss) || ss.getFrame(0);
          return frame ? frame.rect.width : 1;
        };
        p._updateText = function() {
          var x = 0, y = 0, o = this._oldProps, change = false, spaceW = this.spaceWidth, lineH = this.lineHeight, ss = this.spriteSheet;
          var pool = BitmapText._spritePool, kids = this.children, childIndex = 0, numKids = kids.length, sprite;
          for (var n in o) {
            if (o[n] != this[n]) {
              o[n] = this[n];
              change = true;
            }
          }
          if (!change) {
            return;
          }
          var hasSpace = !!this._getFrame(" ", ss);
          if (!hasSpace && !spaceW) {
            spaceW = this._getSpaceWidth(ss);
          }
          if (!lineH) {
            lineH = this._getLineHeight(ss);
          }
          for (var i = 0, l = this.text.length; i < l; i++) {
            var character = this.text.charAt(i);
            if (character == " " && !hasSpace) {
              x += spaceW;
              continue;
            } else if (character == "\n" || character == "\r") {
              if (character == "\r" && this.text.charAt(i + 1) == "\n") {
                i++;
              }
              x = 0;
              y += lineH;
              continue;
            }
            var index = this._getFrameIndex(character, ss);
            if (index == null) {
              continue;
            }
            if (childIndex < numKids) {
              sprite = kids[childIndex];
            } else {
              kids.push(sprite = pool.length ? pool.pop() : new createjs.Sprite());
              sprite.parent = this;
              numKids++;
            }
            sprite.spriteSheet = ss;
            sprite.gotoAndStop(index);
            sprite.x = x;
            sprite.y = y;
            childIndex++;
            x += sprite.getBounds().width + this.letterSpacing;
          }
          while (numKids > childIndex) {
            pool.push(sprite = kids.pop());
            sprite.parent = null;
            numKids--;
          }
          if (pool.length > BitmapText.maxPoolSize) {
            pool.length = BitmapText.maxPoolSize;
          }
        };
        createjs.BitmapText = createjs.promote(BitmapText, "Container");
      })();
    }
  });

  // ../src/easeljs/display/Container.js
  var require_Container = __commonJS({
    "../src/easeljs/display/Container.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Container() {
          this.DisplayObject_constructor();
          this.children = [];
          this.mouseChildren = true;
          this.tickChildren = true;
        }
        var p = createjs.extend(Container, createjs.DisplayObject);
        p._getNumChildren = function() {
          return this.children.length;
        };
        p.getNumChildren = createjs.deprecate(p._getNumChildren, "Container.getNumChildren");
        try {
          Object.defineProperties(p, {
            numChildren: { get: p._getNumChildren }
          });
        } catch (e) {
        }
        p.initialize = Container;
        p.isVisible = function() {
          var hasContent = this.cacheCanvas || this.children.length;
          return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        p.draw = function(ctx, ignoreCache) {
          if (this.DisplayObject_draw(ctx, ignoreCache)) {
            return true;
          }
          var list = this.children.slice();
          for (var i = 0, l = list.length; i < l; i++) {
            var child = list[i];
            if (!child.isVisible()) {
              continue;
            }
            ctx.save();
            child.updateContext(ctx);
            child.draw(ctx);
            ctx.restore();
          }
          return true;
        };
        p.addChild = function(child) {
          if (child == null) {
            return child;
          }
          var l = arguments.length;
          if (l > 1) {
            for (var i = 0; i < l; i++) {
              this.addChild(arguments[i]);
            }
            return arguments[l - 1];
          }
          var par = child.parent, silent = par === this;
          par && par._removeChildAt(createjs.indexOf(par.children, child), silent);
          child.parent = this;
          this.children.push(child);
          if (!silent) {
            child.dispatchEvent("added");
          }
          return child;
        };
        p.addChildAt = function(child, index) {
          var l = arguments.length;
          var indx = arguments[l - 1];
          if (indx < 0 || indx > this.children.length) {
            return arguments[l - 2];
          }
          if (l > 2) {
            for (var i = 0; i < l - 1; i++) {
              this.addChildAt(arguments[i], indx + i);
            }
            return arguments[l - 2];
          }
          var par = child.parent, silent = par === this;
          par && par._removeChildAt(createjs.indexOf(par.children, child), silent);
          child.parent = this;
          this.children.splice(index, 0, child);
          if (!silent) {
            child.dispatchEvent("added");
          }
          return child;
        };
        p.removeChild = function(child) {
          var l = arguments.length;
          if (l > 1) {
            var good = true;
            for (var i = 0; i < l; i++) {
              good = good && this.removeChild(arguments[i]);
            }
            return good;
          }
          return this._removeChildAt(createjs.indexOf(this.children, child));
        };
        p.removeChildAt = function(index) {
          var l = arguments.length;
          if (l > 1) {
            var a = [];
            for (var i = 0; i < l; i++) {
              a[i] = arguments[i];
            }
            a.sort(function(a2, b) {
              return b - a2;
            });
            var good = true;
            for (var i = 0; i < l; i++) {
              good = good && this._removeChildAt(a[i]);
            }
            return good;
          }
          return this._removeChildAt(index);
        };
        p.removeAllChildren = function() {
          var kids = this.children;
          while (kids.length) {
            this._removeChildAt(0);
          }
        };
        p.getChildAt = function(index) {
          return this.children[index];
        };
        p.getChildByName = function(name) {
          var kids = this.children;
          for (var i = 0, l = kids.length; i < l; i++) {
            if (kids[i].name == name) {
              return kids[i];
            }
          }
          return null;
        };
        p.sortChildren = function(sortFunction) {
          this.children.sort(sortFunction);
        };
        p.getChildIndex = function(child) {
          return createjs.indexOf(this.children, child);
        };
        p.swapChildrenAt = function(index1, index2) {
          var kids = this.children;
          var o1 = kids[index1];
          var o2 = kids[index2];
          if (!o1 || !o2) {
            return;
          }
          kids[index1] = o2;
          kids[index2] = o1;
        };
        p.swapChildren = function(child1, child2) {
          var kids = this.children;
          var index1, index2;
          for (var i = 0, l = kids.length; i < l; i++) {
            if (kids[i] == child1) {
              index1 = i;
            }
            if (kids[i] == child2) {
              index2 = i;
            }
            if (index1 != null && index2 != null) {
              break;
            }
          }
          if (i == l) {
            return;
          }
          kids[index1] = child2;
          kids[index2] = child1;
        };
        p.setChildIndex = function(child, index) {
          var kids = this.children, l = kids.length;
          if (child.parent != this || index < 0 || index >= l) {
            return;
          }
          for (var i = 0; i < l; i++) {
            if (kids[i] == child) {
              break;
            }
          }
          if (i == l || i == index) {
            return;
          }
          kids.splice(i, 1);
          kids.splice(index, 0, child);
        };
        p.contains = function(child) {
          while (child) {
            if (child == this) {
              return true;
            }
            child = child.parent;
          }
          return false;
        };
        p.hitTest = function(x, y) {
          return this.getObjectUnderPoint(x, y) != null;
        };
        p.getObjectsUnderPoint = function(x, y, mode) {
          var arr = [];
          var pt = this.localToGlobal(x, y);
          this._getObjectsUnderPoint(pt.x, pt.y, arr, mode > 0, mode == 1);
          return arr;
        };
        p.getObjectUnderPoint = function(x, y, mode) {
          var pt = this.localToGlobal(x, y);
          return this._getObjectsUnderPoint(pt.x, pt.y, null, mode > 0, mode == 1);
        };
        p.getBounds = function() {
          return this._getBounds(null, true);
        };
        p.getTransformedBounds = function() {
          return this._getBounds();
        };
        p.clone = function(recursive) {
          var o = this._cloneProps(new Container());
          if (recursive) {
            this._cloneChildren(o);
          }
          return o;
        };
        p.toString = function() {
          return "[Container (name=" + this.name + ")]";
        };
        p._tick = function(evtObj) {
          if (this.tickChildren) {
            for (var i = this.children.length - 1; i >= 0; i--) {
              var child = this.children[i];
              if (child.tickEnabled && child._tick) {
                child._tick(evtObj);
              }
            }
          }
          this.DisplayObject__tick(evtObj);
        };
        p._cloneChildren = function(o) {
          if (o.children.length) {
            o.removeAllChildren();
          }
          var arr = o.children;
          for (var i = 0, l = this.children.length; i < l; i++) {
            var clone = this.children[i].clone(true);
            clone.parent = o;
            arr.push(clone);
          }
        };
        p._removeChildAt = function(index, silent) {
          if (index < 0 || index > this.children.length - 1) {
            return false;
          }
          var child = this.children[index];
          if (child) {
            child.parent = null;
          }
          this.children.splice(index, 1);
          if (!silent) {
            child.dispatchEvent("removed");
          }
          return true;
        };
        p._getObjectsUnderPoint = function(x, y, arr, mouse, activeListener, currentDepth) {
          currentDepth = currentDepth || 0;
          if (!currentDepth && !this._testMask(this, x, y)) {
            return null;
          }
          var mtx, ctx = createjs.DisplayObject._hitTestContext;
          activeListener = activeListener || mouse && this._hasMouseEventListener();
          var children = this.children, l = children.length;
          for (var i = l - 1; i >= 0; i--) {
            var child = children[i];
            var hitArea = child.hitArea;
            if (!child.visible || !hitArea && !child.isVisible() || mouse && !child.mouseEnabled) {
              continue;
            }
            if (!hitArea && !this._testMask(child, x, y)) {
              continue;
            }
            if (!hitArea && child instanceof Container) {
              var result = child._getObjectsUnderPoint(x, y, arr, mouse, activeListener, currentDepth + 1);
              if (!arr && result) {
                return mouse && !this.mouseChildren ? this : result;
              }
            } else {
              if (mouse && !activeListener && !child._hasMouseEventListener()) {
                continue;
              }
              var props = child.getConcatenatedDisplayProps(child._props);
              mtx = props.matrix;
              if (hitArea) {
                mtx.appendMatrix(hitArea.getMatrix(hitArea._props.matrix));
                props.alpha = hitArea.alpha;
              }
              ctx.globalAlpha = props.alpha;
              ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
              (hitArea || child).draw(ctx);
              if (!this._testHit(ctx)) {
                continue;
              }
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.clearRect(0, 0, 2, 2);
              if (arr) {
                arr.push(child);
              } else {
                return mouse && !this.mouseChildren ? this : child;
              }
            }
          }
          return null;
        };
        p._testMask = function(target, x, y) {
          var mask = target.mask;
          if (!mask || !mask.graphics || mask.graphics.isEmpty()) {
            return true;
          }
          var mtx = this._props.matrix, parent = target.parent;
          mtx = parent ? parent.getConcatenatedMatrix(mtx) : mtx.identity();
          mtx = mask.getMatrix(mask._props.matrix).prependMatrix(mtx);
          var ctx = createjs.DisplayObject._hitTestContext;
          ctx.setTransform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx - x, mtx.ty - y);
          mask.graphics.drawAsPath(ctx);
          ctx.fillStyle = "#000";
          ctx.fill();
          if (!this._testHit(ctx)) {
            return false;
          }
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, 2, 2);
          return true;
        };
        p._getBounds = function(matrix, ignoreTransform) {
          var bounds = this.DisplayObject_getBounds();
          if (bounds) {
            return this._transformBounds(bounds, matrix, ignoreTransform);
          }
          var mtx = this._props.matrix;
          mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
          if (matrix) {
            mtx.prependMatrix(matrix);
          }
          var l = this.children.length, rect = null;
          for (var i = 0; i < l; i++) {
            var child = this.children[i];
            if (!child.visible || !(bounds = child._getBounds(mtx))) {
              continue;
            }
            if (rect) {
              rect.extend(bounds.x, bounds.y, bounds.width, bounds.height);
            } else {
              rect = bounds.clone();
            }
          }
          return rect;
        };
        createjs.Container = createjs.promote(Container, "DisplayObject");
      })();
    }
  });

  // ../src/easeljs/display/DisplayObject.js
  var require_DisplayObject = __commonJS({
    "../src/easeljs/display/DisplayObject.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function DisplayObject() {
          this.EventDispatcher_constructor();
          this.alpha = 1;
          this.cacheCanvas = null;
          this.bitmapCache = null;
          this.id = createjs.UID.get();
          this.mouseEnabled = true;
          this.tickEnabled = true;
          this.name = null;
          this.parent = null;
          this.regX = 0;
          this.regY = 0;
          this.rotation = 0;
          this.scaleX = 1;
          this.scaleY = 1;
          this.skewX = 0;
          this.skewY = 0;
          this.shadow = null;
          this.visible = true;
          this.x = 0;
          this.y = 0;
          this.transformMatrix = null;
          this.compositeOperation = null;
          this.snapToPixel = true;
          this.filters = null;
          this.mask = null;
          this.hitArea = null;
          this.cursor = null;
          this._props = new createjs.DisplayProps();
          this._rectangle = new createjs.Rectangle();
          this._bounds = null;
          this._webGLRenderStyle = DisplayObject._StageGL_NONE;
          this._glMtx = new createjs.Matrix2D();
        }
        var p = createjs.extend(DisplayObject, createjs.EventDispatcher);
        DisplayObject._MOUSE_EVENTS = ["click", "dblclick", "mousedown", "mouseout", "mouseover", "pressmove", "pressup", "rollout", "rollover"];
        DisplayObject.suppressCrossDomainErrors = false;
        DisplayObject._snapToPixelEnabled = false;
        DisplayObject._StageGL_NONE = 0;
        DisplayObject._StageGL_SPRITE = 1;
        DisplayObject._StageGL_BITMAP = 2;
        var canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        if (canvas.getContext) {
          DisplayObject._hitTestCanvas = canvas;
          DisplayObject._hitTestContext = canvas.getContext("2d");
          canvas.width = canvas.height = 1;
        }
        p._getStage = function() {
          var o = this, _Stage = createjs["Stage"];
          while (o.parent) {
            o = o.parent;
          }
          if (o instanceof _Stage) {
            return o;
          }
          return null;
        };
        p.getStage = createjs.deprecate(p._getStage, "DisplayObject.getStage");
        try {
          Object.defineProperties(p, {
            stage: { get: p._getStage },
            cacheID: {
              get: function() {
                return this.bitmapCache && this.bitmapCache.cacheID;
              },
              set: function(a) {
                this.bitmapCache && (this.bitmapCache.cacheID = a);
              }
            },
            scale: {
              get: function() {
                return this.scaleX;
              },
              set: function(scale) {
                this.scaleX = this.scaleY = scale;
              }
            }
          });
        } catch (e) {
        }
        p.isVisible = function() {
          return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
        };
        p.draw = function(ctx, ignoreCache) {
          var cache = this.bitmapCache;
          if (cache && !ignoreCache) {
            return cache.draw(ctx);
          }
          return false;
        };
        p.updateContext = function(ctx) {
          var o = this, mask = o.mask, mtx = o._props.matrix;
          if (mask && mask.graphics && !mask.graphics.isEmpty()) {
            mask.getMatrix(mtx);
            ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
            mask.graphics.drawAsPath(ctx);
            ctx.clip();
            mtx.invert();
            ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          }
          this.getMatrix(mtx);
          var tx = mtx.tx, ty = mtx.ty;
          if (DisplayObject._snapToPixelEnabled && o.snapToPixel) {
            tx = tx + (tx < 0 ? -0.5 : 0.5) | 0;
            ty = ty + (ty < 0 ? -0.5 : 0.5) | 0;
          }
          ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, tx, ty);
          ctx.globalAlpha *= o.alpha;
          if (o.compositeOperation) {
            ctx.globalCompositeOperation = o.compositeOperation;
          }
          if (o.shadow) {
            this._applyShadow(ctx, o.shadow);
          }
        };
        p.cache = function(x, y, width, height, scale, options) {
          if (!this.bitmapCache) {
            this.bitmapCache = new createjs.BitmapCache();
          } else {
            this.bitmapCache._autoGenerated = false;
          }
          this.bitmapCache.define(this, x, y, width, height, scale, options);
        };
        p.updateCache = function(compositeOperation) {
          if (!this.bitmapCache) {
            throw "cache() must be called before updateCache()";
          }
          this.bitmapCache.update(compositeOperation);
        };
        p.uncache = function() {
          if (this.bitmapCache) {
            this.bitmapCache.release();
            this.bitmapCache = void 0;
          }
        };
        p.getCacheDataURL = function() {
          return this.bitmapCache ? this.bitmapCache.getCacheDataURL() : null;
        };
        p.localToGlobal = function(x, y, pt) {
          return this.getConcatenatedMatrix(this._props.matrix).transformPoint(x, y, pt || new createjs.Point());
        };
        p.globalToLocal = function(x, y, pt) {
          return this.getConcatenatedMatrix(this._props.matrix).invert().transformPoint(x, y, pt || new createjs.Point());
        };
        p.localToLocal = function(x, y, target, pt) {
          pt = this.localToGlobal(x, y, pt);
          return target.globalToLocal(pt.x, pt.y, pt);
        };
        p.setTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
          this.x = x || 0;
          this.y = y || 0;
          this.scaleX = scaleX == null ? 1 : scaleX;
          this.scaleY = scaleY == null ? 1 : scaleY;
          this.rotation = rotation || 0;
          this.skewX = skewX || 0;
          this.skewY = skewY || 0;
          this.regX = regX || 0;
          this.regY = regY || 0;
          return this;
        };
        p.getMatrix = function(matrix) {
          var o = this, mtx = matrix || new createjs.Matrix2D();
          return o.transformMatrix ? mtx.copy(o.transformMatrix) : mtx.identity() && mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation, o.skewX, o.skewY, o.regX, o.regY);
        };
        p.getConcatenatedMatrix = function(matrix) {
          var o = this, mtx = this.getMatrix(matrix);
          while (o = o.parent) {
            mtx.prependMatrix(o.getMatrix(o._props.matrix));
          }
          return mtx;
        };
        p.getConcatenatedDisplayProps = function(props) {
          props = props ? props.identity() : new createjs.DisplayProps();
          var o = this, mtx = o.getMatrix(props.matrix);
          do {
            props.prepend(o.visible, o.alpha, o.shadow, o.compositeOperation);
            if (o != this) {
              mtx.prependMatrix(o.getMatrix(o._props.matrix));
            }
          } while (o = o.parent);
          return props;
        };
        p.hitTest = function(x, y) {
          var ctx = DisplayObject._hitTestContext;
          ctx.setTransform(1, 0, 0, 1, -x, -y);
          this.draw(ctx, !(this.bitmapCache && !(this.bitmapCache._cacheCanvas instanceof WebGLTexture)));
          var hit = this._testHit(ctx);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, 2, 2);
          return hit;
        };
        p.set = function(props) {
          for (var n in props) {
            this[n] = props[n];
          }
          return this;
        };
        p.getBounds = function() {
          if (this._bounds) {
            return this._rectangle.copy(this._bounds);
          }
          var cache = this.bitmapCache;
          if (cache && this.cacheCanvas) {
            return cache.getBounds();
          }
          return null;
        };
        p.getTransformedBounds = function() {
          return this._getBounds();
        };
        p.setBounds = function(x, y, width, height) {
          if (x == null) {
            this._bounds = x;
            return;
          }
          this._bounds = (this._bounds || new createjs.Rectangle()).setValues(x, y, width, height);
        };
        p.clone = function() {
          return this._cloneProps(new DisplayObject());
        };
        p.toString = function() {
          return "[DisplayObject (name=" + this.name + ")]";
        };
        p._updateState = null;
        p._cloneProps = function(o) {
          o.alpha = this.alpha;
          o.mouseEnabled = this.mouseEnabled;
          o.tickEnabled = this.tickEnabled;
          o.name = this.name;
          o.regX = this.regX;
          o.regY = this.regY;
          o.rotation = this.rotation;
          o.scaleX = this.scaleX;
          o.scaleY = this.scaleY;
          o.shadow = this.shadow;
          o.skewX = this.skewX;
          o.skewY = this.skewY;
          o.visible = this.visible;
          o.x = this.x;
          o.y = this.y;
          o.compositeOperation = this.compositeOperation;
          o.snapToPixel = this.snapToPixel;
          o.filters = this.filters == null ? null : this.filters.slice(0);
          o.mask = this.mask;
          o.hitArea = this.hitArea;
          o.cursor = this.cursor;
          o._bounds = this._bounds;
          o._webGLRenderStyle = this._webGLRenderStyle;
          return o;
        };
        p._applyShadow = function(ctx, shadow) {
          shadow = shadow || Shadow.identity;
          ctx.shadowColor = shadow.color;
          ctx.shadowOffsetX = shadow.offsetX;
          ctx.shadowOffsetY = shadow.offsetY;
          ctx.shadowBlur = shadow.blur;
        };
        p._tick = function(evtObj) {
          var ls = this._listeners;
          if (ls && ls["tick"]) {
            evtObj.target = null;
            evtObj.propagationStopped = evtObj.immediatePropagationStopped = false;
            this.dispatchEvent(evtObj);
          }
        };
        p._testHit = function(ctx) {
          try {
            var hit = ctx.getImageData(0, 0, 1, 1).data[3] > 1;
          } catch (e) {
            if (!DisplayObject.suppressCrossDomainErrors) {
              throw "An error has occurred. This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.";
            }
          }
          return hit;
        };
        p._getBounds = function(matrix, ignoreTransform) {
          return this._transformBounds(this.getBounds(), matrix, ignoreTransform);
        };
        p._transformBounds = function(bounds, matrix, ignoreTransform) {
          if (!bounds) {
            return bounds;
          }
          var x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height, mtx = this._props.matrix;
          mtx = ignoreTransform ? mtx.identity() : this.getMatrix(mtx);
          if (x || y) {
            mtx.appendTransform(0, 0, 1, 1, 0, 0, 0, -x, -y);
          }
          if (matrix) {
            mtx.prependMatrix(matrix);
          }
          var x_a = width * mtx.a, x_b = width * mtx.b;
          var y_c = height * mtx.c, y_d = height * mtx.d;
          var tx = mtx.tx, ty = mtx.ty;
          var minX = tx, maxX = tx, minY = ty, maxY = ty;
          if ((x = x_a + tx) < minX) {
            minX = x;
          } else if (x > maxX) {
            maxX = x;
          }
          if ((x = x_a + y_c + tx) < minX) {
            minX = x;
          } else if (x > maxX) {
            maxX = x;
          }
          if ((x = y_c + tx) < minX) {
            minX = x;
          } else if (x > maxX) {
            maxX = x;
          }
          if ((y = x_b + ty) < minY) {
            minY = y;
          } else if (y > maxY) {
            maxY = y;
          }
          if ((y = x_b + y_d + ty) < minY) {
            minY = y;
          } else if (y > maxY) {
            maxY = y;
          }
          if ((y = y_d + ty) < minY) {
            minY = y;
          } else if (y > maxY) {
            maxY = y;
          }
          return bounds.setValues(minX, minY, maxX - minX, maxY - minY);
        };
        p._hasMouseEventListener = function() {
          var evts = DisplayObject._MOUSE_EVENTS;
          for (var i = 0, l = evts.length; i < l; i++) {
            if (this.hasEventListener(evts[i])) {
              return true;
            }
          }
          return !!this.cursor;
        };
        createjs.DisplayObject = createjs.promote(DisplayObject, "EventDispatcher");
      })();
    }
  });

  // ../src/easeljs/display/DOMElement.js
  var require_DOMElement = __commonJS({
    "../src/easeljs/display/DOMElement.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function DOMElement(htmlElement) {
          this.DisplayObject_constructor();
          if (typeof htmlElement == "string") {
            htmlElement = document.getElementById(htmlElement);
          }
          this.mouseEnabled = false;
          var style = htmlElement.style;
          style.position = "absolute";
          style.transformOrigin = style.WebkitTransformOrigin = style.msTransformOrigin = style.MozTransformOrigin = style.OTransformOrigin = "0% 0%";
          this.htmlElement = htmlElement;
          this._oldProps = null;
          this._oldStage = null;
          this._drawAction = null;
        }
        var p = createjs.extend(DOMElement, createjs.DisplayObject);
        p.isVisible = function() {
          return this.htmlElement != null;
        };
        p.draw = function(ctx, ignoreCache) {
          return true;
        };
        p.cache = function() {
        };
        p.uncache = function() {
        };
        p.updateCache = function() {
        };
        p.hitTest = function() {
        };
        p.localToGlobal = function() {
        };
        p.globalToLocal = function() {
        };
        p.localToLocal = function() {
        };
        p.clone = function() {
          throw "DOMElement cannot be cloned.";
        };
        p.toString = function() {
          return "[DOMElement (name=" + this.name + ")]";
        };
        p._tick = function(evtObj) {
          var stage2 = this.stage;
          if (stage2 && stage2 !== this._oldStage) {
            this._drawAction && stage2.off("drawend", this._drawAction);
            this._drawAction = stage2.on("drawend", this._handleDrawEnd, this);
            this._oldStage = stage2;
          }
          this.DisplayObject__tick(evtObj);
        };
        p._handleDrawEnd = function(evt) {
          var o = this.htmlElement;
          if (!o) {
            return;
          }
          var style = o.style;
          var props = this.getConcatenatedDisplayProps(this._props), mtx = props.matrix;
          var visibility = props.visible ? "visible" : "hidden";
          if (visibility != style.visibility) {
            style.visibility = visibility;
          }
          if (!props.visible) {
            return;
          }
          var oldProps = this._oldProps, oldMtx = oldProps && oldProps.matrix;
          var n = 1e4;
          if (!oldMtx || !oldMtx.equals(mtx)) {
            var str = "matrix(" + (mtx.a * n | 0) / n + "," + (mtx.b * n | 0) / n + "," + (mtx.c * n | 0) / n + "," + (mtx.d * n | 0) / n + "," + (mtx.tx + 0.5 | 0);
            style.transform = style.WebkitTransform = style.OTransform = style.msTransform = str + "," + (mtx.ty + 0.5 | 0) + ")";
            style.MozTransform = str + "px," + (mtx.ty + 0.5 | 0) + "px)";
            if (!oldProps) {
              oldProps = this._oldProps = new createjs.DisplayProps(true, null);
            }
            oldProps.matrix.copy(mtx);
          }
          if (oldProps.alpha != props.alpha) {
            style.opacity = "" + (props.alpha * n | 0) / n;
            oldProps.alpha = props.alpha;
          }
        };
        createjs.DOMElement = createjs.promote(DOMElement, "DisplayObject");
      })();
    }
  });

  // ../src/easeljs/display/Graphics.js
  var require_Graphics = __commonJS({
    "../src/easeljs/display/Graphics.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Graphics() {
          this.command = null;
          this._stroke = null;
          this._strokeStyle = null;
          this._oldStrokeStyle = null;
          this._strokeDash = null;
          this._oldStrokeDash = null;
          this._strokeIgnoreScale = false;
          this._fill = null;
          this._instructions = [];
          this._commitIndex = 0;
          this._activeInstructions = [];
          this._dirty = false;
          this._storeIndex = 0;
          this.clear();
        }
        var p = Graphics.prototype;
        var G = Graphics;
        Graphics.getRGB = function(r, g, b, alpha) {
          if (r != null && b == null) {
            alpha = g;
            b = r & 255;
            g = r >> 8 & 255;
            r = r >> 16 & 255;
          }
          if (alpha == null) {
            return "rgb(" + r + "," + g + "," + b + ")";
          } else {
            return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
          }
        };
        Graphics.getHSL = function(hue, saturation, lightness, alpha) {
          if (alpha == null) {
            return "hsl(" + hue % 360 + "," + saturation + "%," + lightness + "%)";
          } else {
            return "hsla(" + hue % 360 + "," + saturation + "%," + lightness + "%," + alpha + ")";
          }
        };
        Graphics.BASE_64 = { "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43, "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "+": 62, "/": 63 };
        Graphics.STROKE_CAPS_MAP = ["butt", "round", "square"];
        Graphics.STROKE_JOINTS_MAP = ["miter", "round", "bevel"];
        var canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        if (canvas.getContext) {
          Graphics._ctx = canvas.getContext("2d");
          canvas.width = canvas.height = 1;
        }
        p._getInstructions = function() {
          this._updateInstructions();
          return this._instructions;
        };
        p.getInstructions = createjs.deprecate(p._getInstructions, "Graphics.getInstructions");
        try {
          Object.defineProperties(p, {
            instructions: { get: p._getInstructions }
          });
        } catch (e) {
        }
        p.isEmpty = function() {
          return !(this._instructions.length || this._activeInstructions.length);
        };
        p.draw = function(ctx, data) {
          this._updateInstructions();
          var instr = this._instructions;
          for (var i = this._storeIndex, l = instr.length; i < l; i++) {
            instr[i].exec(ctx, data);
          }
        };
        p.drawAsPath = function(ctx) {
          this._updateInstructions();
          var instr, instrs = this._instructions;
          for (var i = this._storeIndex, l = instrs.length; i < l; i++) {
            if ((instr = instrs[i]).path !== false) {
              instr.exec(ctx);
            }
          }
        };
        p.moveTo = function(x, y) {
          return this.append(new G.MoveTo(x, y), true);
        };
        p.lineTo = function(x, y) {
          return this.append(new G.LineTo(x, y));
        };
        p.arcTo = function(x1, y1, x2, y2, radius) {
          return this.append(new G.ArcTo(x1, y1, x2, y2, radius));
        };
        p.arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
          return this.append(new G.Arc(x, y, radius, startAngle, endAngle, anticlockwise));
        };
        p.quadraticCurveTo = function(cpx, cpy, x, y) {
          return this.append(new G.QuadraticCurveTo(cpx, cpy, x, y));
        };
        p.bezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
          return this.append(new G.BezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y));
        };
        p.rect = function(x, y, w, h) {
          return this.append(new G.Rect(x, y, w, h));
        };
        p.closePath = function() {
          return this._activeInstructions.length ? this.append(new G.ClosePath()) : this;
        };
        p.clear = function() {
          this._instructions.length = this._activeInstructions.length = this._commitIndex = 0;
          this._strokeStyle = this._oldStrokeStyle = this._stroke = this._fill = this._strokeDash = this._oldStrokeDash = null;
          this._dirty = this._strokeIgnoreScale = false;
          return this;
        };
        p.beginFill = function(color) {
          return this._setFill(color ? new G.Fill(color) : null);
        };
        p.beginLinearGradientFill = function(colors, ratios, x0, y0, x1, y1) {
          return this._setFill(new G.Fill().linearGradient(colors, ratios, x0, y0, x1, y1));
        };
        p.beginRadialGradientFill = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
          return this._setFill(new G.Fill().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
        };
        p.beginBitmapFill = function(image, repetition, matrix) {
          return this._setFill(new G.Fill(null, matrix).bitmap(image, repetition));
        };
        p.endFill = function() {
          return this.beginFill();
        };
        p.setStrokeStyle = function(thickness, caps, joints, miterLimit, ignoreScale) {
          this._updateInstructions(true);
          this._strokeStyle = this.command = new G.StrokeStyle(thickness, caps, joints, miterLimit, ignoreScale);
          if (this._stroke) {
            this._stroke.ignoreScale = ignoreScale;
          }
          this._strokeIgnoreScale = ignoreScale;
          return this;
        };
        p.setStrokeDash = function(segments, offset) {
          this._updateInstructions(true);
          this._strokeDash = this.command = new G.StrokeDash(segments, offset);
          return this;
        };
        p.beginStroke = function(color) {
          return this._setStroke(color ? new G.Stroke(color) : null);
        };
        p.beginLinearGradientStroke = function(colors, ratios, x0, y0, x1, y1) {
          return this._setStroke(new G.Stroke().linearGradient(colors, ratios, x0, y0, x1, y1));
        };
        p.beginRadialGradientStroke = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
          return this._setStroke(new G.Stroke().radialGradient(colors, ratios, x0, y0, r0, x1, y1, r1));
        };
        p.beginBitmapStroke = function(image, repetition) {
          return this._setStroke(new G.Stroke().bitmap(image, repetition));
        };
        p.endStroke = function() {
          return this.beginStroke();
        };
        p.curveTo = p.quadraticCurveTo;
        p.drawRect = p.rect;
        p.drawRoundRect = function(x, y, w, h, radius) {
          return this.drawRoundRectComplex(x, y, w, h, radius, radius, radius, radius);
        };
        p.drawRoundRectComplex = function(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
          return this.append(new G.RoundRect(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL));
        };
        p.drawCircle = function(x, y, radius) {
          return this.append(new G.Circle(x, y, radius));
        };
        p.drawEllipse = function(x, y, w, h) {
          return this.append(new G.Ellipse(x, y, w, h));
        };
        p.drawPolyStar = function(x, y, radius, sides, pointSize, angle) {
          return this.append(new G.PolyStar(x, y, radius, sides, pointSize, angle));
        };
        p.append = function(command, clean) {
          this._activeInstructions.push(command);
          this.command = command;
          if (!clean) {
            this._dirty = true;
          }
          return this;
        };
        p.decodePath = function(str) {
          var instructions = [this.moveTo, this.lineTo, this.quadraticCurveTo, this.bezierCurveTo, this.closePath];
          var paramCount = [2, 2, 4, 6, 0];
          var i = 0, l = str.length;
          var params = [];
          var x = 0, y = 0;
          var base64 = Graphics.BASE_64;
          while (i < l) {
            var c = str.charAt(i);
            var n = base64[c];
            var fi = n >> 3;
            var f = instructions[fi];
            if (!f || n & 3) {
              throw "bad path data (@" + i + "): " + c;
            }
            var pl = paramCount[fi];
            if (!fi) {
              x = y = 0;
            }
            params.length = 0;
            i++;
            var charCount = (n >> 2 & 1) + 2;
            for (var p2 = 0; p2 < pl; p2++) {
              var num = base64[str.charAt(i)];
              var sign = num >> 5 ? -1 : 1;
              num = (num & 31) << 6 | base64[str.charAt(i + 1)];
              if (charCount == 3) {
                num = num << 6 | base64[str.charAt(i + 2)];
              }
              num = sign * num / 10;
              if (p2 % 2) {
                x = num += x;
              } else {
                y = num += y;
              }
              params[p2] = num;
              i += charCount;
            }
            f.apply(this, params);
          }
          return this;
        };
        p.store = function() {
          this._updateInstructions(true);
          this._storeIndex = this._instructions.length;
          return this;
        };
        p.unstore = function() {
          this._storeIndex = 0;
          return this;
        };
        p.clone = function() {
          var o = new Graphics();
          o.command = this.command;
          o._stroke = this._stroke;
          o._strokeStyle = this._strokeStyle;
          o._strokeDash = this._strokeDash;
          o._strokeIgnoreScale = this._strokeIgnoreScale;
          o._fill = this._fill;
          o._instructions = this._instructions.slice();
          o._commitIndex = this._commitIndex;
          o._activeInstructions = this._activeInstructions.slice();
          o._dirty = this._dirty;
          o._storeIndex = this._storeIndex;
          return o;
        };
        p.toString = function() {
          return "[Graphics]";
        };
        p.mt = p.moveTo;
        p.lt = p.lineTo;
        p.at = p.arcTo;
        p.bt = p.bezierCurveTo;
        p.qt = p.quadraticCurveTo;
        p.a = p.arc;
        p.r = p.rect;
        p.cp = p.closePath;
        p.c = p.clear;
        p.f = p.beginFill;
        p.lf = p.beginLinearGradientFill;
        p.rf = p.beginRadialGradientFill;
        p.bf = p.beginBitmapFill;
        p.ef = p.endFill;
        p.ss = p.setStrokeStyle;
        p.sd = p.setStrokeDash;
        p.s = p.beginStroke;
        p.ls = p.beginLinearGradientStroke;
        p.rs = p.beginRadialGradientStroke;
        p.bs = p.beginBitmapStroke;
        p.es = p.endStroke;
        p.dr = p.drawRect;
        p.rr = p.drawRoundRect;
        p.rc = p.drawRoundRectComplex;
        p.dc = p.drawCircle;
        p.de = p.drawEllipse;
        p.dp = p.drawPolyStar;
        p.p = p.decodePath;
        p._updateInstructions = function(commit) {
          var instr = this._instructions, active = this._activeInstructions, commitIndex = this._commitIndex;
          if (this._dirty && active.length) {
            instr.length = commitIndex;
            instr.push(Graphics.beginCmd);
            var l = active.length, ll = instr.length;
            instr.length = ll + l;
            for (var i = 0; i < l; i++) {
              instr[i + ll] = active[i];
            }
            if (this._fill) {
              instr.push(this._fill);
            }
            if (this._stroke) {
              if (this._strokeDash !== this._oldStrokeDash) {
                instr.push(this._strokeDash);
              }
              if (this._strokeStyle !== this._oldStrokeStyle) {
                instr.push(this._strokeStyle);
              }
              if (commit) {
                this._oldStrokeStyle = this._strokeStyle;
                this._oldStrokeDash = this._strokeDash;
              }
              instr.push(this._stroke);
            }
            this._dirty = false;
          }
          if (commit) {
            active.length = 0;
            this._commitIndex = instr.length;
          }
        };
        p._setFill = function(fill) {
          this._updateInstructions(true);
          this.command = this._fill = fill;
          return this;
        };
        p._setStroke = function(stroke) {
          this._updateInstructions(true);
          if (this.command = this._stroke = stroke) {
            stroke.ignoreScale = this._strokeIgnoreScale;
          }
          return this;
        };
        (G.LineTo = function(x, y) {
          this.x = x;
          this.y = y;
        }).prototype.exec = function(ctx) {
          ctx.lineTo(this.x, this.y);
        };
        (G.MoveTo = function(x, y) {
          this.x = x;
          this.y = y;
        }).prototype.exec = function(ctx) {
          ctx.moveTo(this.x, this.y);
        };
        (G.ArcTo = function(x1, y1, x2, y2, radius) {
          this.x1 = x1;
          this.y1 = y1;
          this.x2 = x2;
          this.y2 = y2;
          this.radius = radius;
        }).prototype.exec = function(ctx) {
          ctx.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
        };
        (G.Arc = function(x, y, radius, startAngle, endAngle, anticlockwise) {
          this.x = x;
          this.y = y;
          this.radius = radius;
          this.startAngle = startAngle;
          this.endAngle = endAngle;
          this.anticlockwise = !!anticlockwise;
        }).prototype.exec = function(ctx) {
          ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
        };
        (G.QuadraticCurveTo = function(cpx, cpy, x, y) {
          this.cpx = cpx;
          this.cpy = cpy;
          this.x = x;
          this.y = y;
        }).prototype.exec = function(ctx) {
          ctx.quadraticCurveTo(this.cpx, this.cpy, this.x, this.y);
        };
        (G.BezierCurveTo = function(cp1x, cp1y, cp2x, cp2y, x, y) {
          this.cp1x = cp1x;
          this.cp1y = cp1y;
          this.cp2x = cp2x;
          this.cp2y = cp2y;
          this.x = x;
          this.y = y;
        }).prototype.exec = function(ctx) {
          ctx.bezierCurveTo(this.cp1x, this.cp1y, this.cp2x, this.cp2y, this.x, this.y);
        };
        (G.Rect = function(x, y, w, h) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
        }).prototype.exec = function(ctx) {
          ctx.rect(this.x, this.y, this.w, this.h);
        };
        (G.ClosePath = function() {
        }).prototype.exec = function(ctx) {
          ctx.closePath();
        };
        (G.BeginPath = function() {
        }).prototype.exec = function(ctx) {
          ctx.beginPath();
        };
        p = (G.Fill = function(style, matrix) {
          this.style = style;
          this.matrix = matrix;
        }).prototype;
        p.exec = function(ctx) {
          if (!this.style) {
            return;
          }
          ctx.fillStyle = this.style;
          var mtx = this.matrix;
          if (mtx) {
            ctx.save();
            ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
          }
          ctx.fill();
          if (mtx) {
            ctx.restore();
          }
        };
        p.linearGradient = function(colors, ratios, x0, y0, x1, y1) {
          var o = this.style = Graphics._ctx.createLinearGradient(x0, y0, x1, y1);
          for (var i = 0, l = colors.length; i < l; i++) {
            o.addColorStop(ratios[i], colors[i]);
          }
          o.props = { colors, ratios, x0, y0, x1, y1, type: "linear" };
          return this;
        };
        p.radialGradient = function(colors, ratios, x0, y0, r0, x1, y1, r1) {
          var o = this.style = Graphics._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
          for (var i = 0, l = colors.length; i < l; i++) {
            o.addColorStop(ratios[i], colors[i]);
          }
          o.props = { colors, ratios, x0, y0, r0, x1, y1, r1, type: "radial" };
          return this;
        };
        p.bitmap = function(image, repetition) {
          if (image.naturalWidth || image.getContext || image.readyState >= 2) {
            var o = this.style = Graphics._ctx.createPattern(image, repetition || "");
            o.props = { image, repetition, type: "bitmap" };
          }
          return this;
        };
        p.path = false;
        p = (G.Stroke = function(style, ignoreScale) {
          this.style = style;
          this.ignoreScale = ignoreScale;
        }).prototype;
        p.exec = function(ctx) {
          if (!this.style) {
            return;
          }
          ctx.strokeStyle = this.style;
          if (this.ignoreScale) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
          }
          ctx.stroke();
          if (this.ignoreScale) {
            ctx.restore();
          }
        };
        p.linearGradient = G.Fill.prototype.linearGradient;
        p.radialGradient = G.Fill.prototype.radialGradient;
        p.bitmap = G.Fill.prototype.bitmap;
        p.path = false;
        p = (G.StrokeStyle = function(width, caps, joints, miterLimit, ignoreScale) {
          this.width = width;
          this.caps = caps;
          this.joints = joints;
          this.miterLimit = miterLimit;
          this.ignoreScale = ignoreScale;
        }).prototype;
        p.exec = function(ctx) {
          ctx.lineWidth = this.width == null ? "1" : this.width;
          ctx.lineCap = this.caps == null ? "butt" : isNaN(this.caps) ? this.caps : Graphics.STROKE_CAPS_MAP[this.caps];
          ctx.lineJoin = this.joints == null ? "miter" : isNaN(this.joints) ? this.joints : Graphics.STROKE_JOINTS_MAP[this.joints];
          ctx.miterLimit = this.miterLimit == null ? "10" : this.miterLimit;
          ctx.ignoreScale = this.ignoreScale == null ? false : this.ignoreScale;
        };
        p.path = false;
        (G.StrokeDash = function(segments, offset) {
          this.segments = segments;
          this.offset = offset || 0;
        }).prototype.exec = function(ctx) {
          if (ctx.setLineDash) {
            ctx.setLineDash(this.segments || G.StrokeDash.EMPTY_SEGMENTS);
            ctx.lineDashOffset = this.offset || 0;
          }
        };
        G.StrokeDash.EMPTY_SEGMENTS = [];
        (G.RoundRect = function(x, y, w, h, radiusTL, radiusTR, radiusBR, radiusBL) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.radiusTL = radiusTL;
          this.radiusTR = radiusTR;
          this.radiusBR = radiusBR;
          this.radiusBL = radiusBL;
        }).prototype.exec = function(ctx) {
          var max = (this.w < this.h ? this.w : this.h) / 2;
          var mTL = 0, mTR = 0, mBR = 0, mBL = 0;
          var x = this.x, y = this.y, w = this.w, h = this.h;
          var rTL = this.radiusTL, rTR = this.radiusTR, rBR = this.radiusBR, rBL = this.radiusBL;
          if (rTL < 0) {
            rTL *= mTL = -1;
          }
          if (rTL > max) {
            rTL = max;
          }
          if (rTR < 0) {
            rTR *= mTR = -1;
          }
          if (rTR > max) {
            rTR = max;
          }
          if (rBR < 0) {
            rBR *= mBR = -1;
          }
          if (rBR > max) {
            rBR = max;
          }
          if (rBL < 0) {
            rBL *= mBL = -1;
          }
          if (rBL > max) {
            rBL = max;
          }
          ctx.moveTo(x + w - rTR, y);
          ctx.arcTo(x + w + rTR * mTR, y - rTR * mTR, x + w, y + rTR, rTR);
          ctx.lineTo(x + w, y + h - rBR);
          ctx.arcTo(x + w + rBR * mBR, y + h + rBR * mBR, x + w - rBR, y + h, rBR);
          ctx.lineTo(x + rBL, y + h);
          ctx.arcTo(x - rBL * mBL, y + h + rBL * mBL, x, y + h - rBL, rBL);
          ctx.lineTo(x, y + rTL);
          ctx.arcTo(x - rTL * mTL, y - rTL * mTL, x + rTL, y, rTL);
          ctx.closePath();
        };
        (G.Circle = function(x, y, radius) {
          this.x = x;
          this.y = y;
          this.radius = radius;
        }).prototype.exec = function(ctx) {
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        };
        (G.Ellipse = function(x, y, w, h) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
        }).prototype.exec = function(ctx) {
          var x = this.x, y = this.y;
          var w = this.w, h = this.h;
          var k = 0.5522848;
          var ox = w / 2 * k;
          var oy = h / 2 * k;
          var xe = x + w;
          var ye = y + h;
          var xm = x + w / 2;
          var ym = y + h / 2;
          ctx.moveTo(x, ym);
          ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
          ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
          ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
          ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        };
        (G.PolyStar = function(x, y, radius, sides, pointSize, angle) {
          this.x = x;
          this.y = y;
          this.radius = radius;
          this.sides = sides;
          this.pointSize = pointSize;
          this.angle = angle;
        }).prototype.exec = function(ctx) {
          var x = this.x, y = this.y;
          var radius = this.radius;
          var angle = (this.angle || 0) / 180 * Math.PI;
          var sides = this.sides;
          var ps = 1 - (this.pointSize || 0);
          var a = Math.PI / sides;
          ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
          for (var i = 0; i < sides; i++) {
            angle += a;
            if (ps != 1) {
              ctx.lineTo(x + Math.cos(angle) * radius * ps, y + Math.sin(angle) * radius * ps);
            }
            angle += a;
            ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
          }
          ctx.closePath();
        };
        Graphics.beginCmd = new G.BeginPath();
        createjs.Graphics = Graphics;
      })();
    }
  });

  // ../src/easeljs/display/MovieClip.js
  var require_MovieClip = __commonJS({
    "../src/easeljs/display/MovieClip.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function MovieClip(props) {
          this.Container_constructor();
          !MovieClip.inited && MovieClip.init();
          var mode, startPosition, loop, labels;
          if (props instanceof String || arguments.length > 1) {
            mode = props;
            startPosition = arguments[1];
            loop = arguments[2];
            labels = arguments[3];
            if (loop == null) {
              loop = -1;
            }
            props = null;
          } else if (props) {
            mode = props.mode;
            startPosition = props.startPosition;
            loop = props.loop;
            labels = props.labels;
          }
          if (!props) {
            props = { labels };
          }
          this.mode = mode || MovieClip.INDEPENDENT;
          this.startPosition = startPosition || 0;
          this.loop = loop === true ? -1 : loop || 0;
          this.currentFrame = 0;
          this.paused = props.paused || false;
          this.actionsEnabled = true;
          this.autoReset = true;
          this.frameBounds = this.frameBounds || props.frameBounds;
          this.framerate = null;
          props.useTicks = props.paused = true;
          this.timeline = new createjs.Timeline(props);
          this._synchOffset = 0;
          this._rawPosition = -1;
          this._bound_resolveState = this._resolveState.bind(this);
          this._t = 0;
          this._managed = {};
        }
        var p = createjs.extend(MovieClip, createjs.Container);
        MovieClip.INDEPENDENT = "independent";
        MovieClip.SINGLE_FRAME = "single";
        MovieClip.SYNCHED = "synched";
        MovieClip.inited = false;
        MovieClip.init = function() {
          if (MovieClip.inited) {
            return;
          }
          MovieClipPlugin.install();
          MovieClip.inited = true;
        };
        p._getLabels = function() {
          return this.timeline.getLabels();
        };
        p.getLabels = createjs.deprecate(p._getLabels, "MovieClip.getLabels");
        p._getCurrentLabel = function() {
          return this.timeline.currentLabel;
        };
        p.getCurrentLabel = createjs.deprecate(p._getCurrentLabel, "MovieClip.getCurrentLabel");
        p._getDuration = function() {
          return this.timeline.duration;
        };
        p.getDuration = createjs.deprecate(p._getDuration, "MovieClip.getDuration");
        try {
          Object.defineProperties(p, {
            labels: { get: p._getLabels },
            currentLabel: { get: p._getCurrentLabel },
            totalFrames: { get: p._getDuration },
            duration: { get: p._getDuration }
            // TODO: can we just proxy .currentFrame to tl.position as well? Ditto for .loop (or just remove entirely).
          });
        } catch (e) {
        }
        p.initialize = MovieClip;
        p.isVisible = function() {
          return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0);
        };
        p.draw = function(ctx, ignoreCache) {
          if (this.DisplayObject_draw(ctx, ignoreCache)) {
            return true;
          }
          this._updateState();
          this.Container_draw(ctx, ignoreCache);
          return true;
        };
        p.play = function() {
          this.paused = false;
        };
        p.stop = function() {
          this.paused = true;
        };
        p.gotoAndPlay = function(positionOrLabel) {
          this.paused = false;
          this._goto(positionOrLabel);
        };
        p.gotoAndStop = function(positionOrLabel) {
          this.paused = true;
          this._goto(positionOrLabel);
        };
        p.advance = function(time) {
          var independent = MovieClip.INDEPENDENT;
          if (this.mode !== independent) {
            return;
          }
          var o = this, fps = o.framerate;
          while ((o = o.parent) && fps === null) {
            if (o.mode === independent) {
              fps = o._framerate;
            }
          }
          this._framerate = fps;
          var t = fps !== null && fps !== -1 && time !== null ? time / (1e3 / fps) + this._t : 1;
          var frames = t | 0;
          this._t = t - frames;
          while (!this.paused && frames--) {
            this._updateTimeline(this._rawPosition + 1, false);
          }
        };
        p.clone = function() {
          throw "MovieClip cannot be cloned.";
        };
        p.toString = function() {
          return "[MovieClip (name=" + this.name + ")]";
        };
        p._updateState = function() {
          if (this._rawPosition === -1 || this.mode !== MovieClip.INDEPENDENT) {
            this._updateTimeline(-1);
          }
        };
        p._tick = function(evtObj) {
          this.advance(evtObj && evtObj.delta);
          this.Container__tick(evtObj);
        };
        p._goto = function(positionOrLabel) {
          var pos = this.timeline.resolve(positionOrLabel);
          if (pos == null) {
            return;
          }
          this._t = 0;
          this._updateTimeline(pos, true);
        };
        p._reset = function() {
          this._rawPosition = -1;
          this._t = this.currentFrame = 0;
          this.paused = false;
        };
        p._updateTimeline = function(rawPosition, jump) {
          var synced = this.mode !== MovieClip.INDEPENDENT, tl = this.timeline;
          if (synced) {
            rawPosition = this.startPosition + (this.mode === MovieClip.SINGLE_FRAME ? 0 : this._synchOffset);
          }
          if (rawPosition < 0) {
            rawPosition = 0;
          }
          if (this._rawPosition === rawPosition && !synced) {
            return;
          }
          this._rawPosition = rawPosition;
          tl.loop = this.loop;
          tl.setPosition(rawPosition, synced || !this.actionsEnabled, jump, this._bound_resolveState);
        };
        p._renderFirstFrame = function() {
          var tl = this.timeline, pos = tl.rawPosition;
          tl.setPosition(0, true, true, this._bound_resolveState);
          tl.rawPosition = pos;
        };
        p._resolveState = function() {
          var tl = this.timeline;
          this.currentFrame = tl.position;
          for (var n in this._managed) {
            this._managed[n] = 1;
          }
          var tweens = tl.tweens;
          for (var i = 0, l = tweens.length; i < l; i++) {
            var tween = tweens[i], target = tween.target;
            if (target === this || tween.passive) {
              continue;
            }
            var offset = tween._stepPosition;
            if (target instanceof createjs.DisplayObject) {
              this._addManagedChild(target, offset);
            } else {
              this._setState(target.state, offset);
            }
          }
          var kids = this.children;
          for (i = kids.length - 1; i >= 0; i--) {
            var id = kids[i].id;
            if (this._managed[id] === 1) {
              this.removeChildAt(i);
              delete this._managed[id];
            }
          }
        };
        p._setState = function(state, offset) {
          if (!state) {
            return;
          }
          for (var i = state.length - 1; i >= 0; i--) {
            var o = state[i];
            var target = o.t;
            var props = o.p;
            for (var n in props) {
              target[n] = props[n];
            }
            this._addManagedChild(target, offset);
          }
        };
        p._addManagedChild = function(child, offset) {
          if (child._off) {
            return;
          }
          this.addChildAt(child, 0);
          if (child instanceof MovieClip) {
            child._synchOffset = offset;
            if (child.mode === MovieClip.INDEPENDENT && child.autoReset && !this._managed[child.id]) {
              child._reset();
            }
          }
          this._managed[child.id] = 2;
        };
        p._getBounds = function(matrix, ignoreTransform) {
          var bounds = this.DisplayObject_getBounds();
          if (!bounds) {
            if (this.frameBounds) {
              bounds = this._rectangle.copy(this.frameBounds[this.currentFrame]);
            }
          }
          if (bounds) {
            return this._transformBounds(bounds, matrix, ignoreTransform);
          }
          return this.Container__getBounds(matrix, ignoreTransform);
        };
        createjs.MovieClip = createjs.promote(MovieClip, "Container");
        function MovieClipPlugin() {
          throw "MovieClipPlugin cannot be instantiated.";
        }
        MovieClipPlugin.priority = 100;
        MovieClipPlugin.ID = "MovieClip";
        MovieClipPlugin.install = function() {
          createjs.Tween._installPlugin(MovieClipPlugin);
        };
        MovieClipPlugin.init = function(tween, prop, value) {
          if (prop === "startPosition" && tween.target instanceof MovieClip) {
            tween._addPlugin(MovieClipPlugin);
          }
        };
        MovieClipPlugin.step = function(tween, step, props) {
        };
        MovieClipPlugin.change = function(tween, step, prop, value, ratio, end) {
          if (prop === "startPosition") {
            return ratio === 1 ? step.props[prop] : step.prev.props[prop];
          }
        };
      })();
    }
  });

  // ../src/easeljs/display/Shadow.js
  var require_Shadow = __commonJS({
    "../src/easeljs/display/Shadow.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Shadow2(color, offsetX, offsetY, blur) {
          this.color = color || "black";
          this.offsetX = offsetX || 0;
          this.offsetY = offsetY || 0;
          this.blur = blur || 0;
        }
        var p = Shadow2.prototype;
        Shadow2.identity = new Shadow2("transparent", 0, 0, 0);
        p.toString = function() {
          return "[Shadow]";
        };
        p.clone = function() {
          return new Shadow2(this.color, this.offsetX, this.offsetY, this.blur);
        };
        createjs.Shadow = Shadow2;
      })();
    }
  });

  // ../src/easeljs/display/Shape.js
  var require_Shape = __commonJS({
    "../src/easeljs/display/Shape.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Shape(graphics) {
          this.DisplayObject_constructor();
          this.graphics = graphics ? graphics : new createjs.Graphics();
        }
        var p = createjs.extend(Shape, createjs.DisplayObject);
        p.isVisible = function() {
          var hasContent = this.cacheCanvas || this.graphics && !this.graphics.isEmpty();
          return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        p.draw = function(ctx, ignoreCache) {
          if (this.DisplayObject_draw(ctx, ignoreCache)) {
            return true;
          }
          this.graphics.draw(ctx, this);
          return true;
        };
        p.clone = function(recursive) {
          var g = recursive && this.graphics ? this.graphics.clone() : this.graphics;
          return this._cloneProps(new Shape(g));
        };
        p.toString = function() {
          return "[Shape (name=" + this.name + ")]";
        };
        createjs.Shape = createjs.promote(Shape, "DisplayObject");
      })();
    }
  });

  // ../src/easeljs/display/Sprite.js
  var require_Sprite = __commonJS({
    "../src/easeljs/display/Sprite.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Sprite(spriteSheet, frameOrAnimation) {
          this.DisplayObject_constructor();
          this.currentFrame = 0;
          this.currentAnimation = null;
          this.paused = true;
          this.spriteSheet = spriteSheet;
          this.currentAnimationFrame = 0;
          this.framerate = 0;
          this._animation = null;
          this._currentFrame = null;
          this._skipAdvance = false;
          this._webGLRenderStyle = createjs.DisplayObject._StageGL_SPRITE;
          if (frameOrAnimation != null) {
            this.gotoAndPlay(frameOrAnimation);
          }
        }
        var p = createjs.extend(Sprite, createjs.DisplayObject);
        p.initialize = Sprite;
        p.isVisible = function() {
          var hasContent = this.cacheCanvas || this.spriteSheet.complete;
          return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        p.draw = function(ctx, ignoreCache) {
          if (this.DisplayObject_draw(ctx, ignoreCache)) {
            return true;
          }
          this._normalizeFrame();
          var o = this.spriteSheet.getFrame(this._currentFrame | 0);
          if (!o) {
            return false;
          }
          var rect = o.rect;
          if (rect.width && rect.height) {
            ctx.drawImage(o.image, rect.x, rect.y, rect.width, rect.height, -o.regX, -o.regY, rect.width, rect.height);
          }
          return true;
        };
        p.play = function() {
          this.paused = false;
        };
        p.stop = function() {
          this.paused = true;
        };
        p.gotoAndPlay = function(frameOrAnimation) {
          this.paused = false;
          this._skipAdvance = true;
          this._goto(frameOrAnimation);
        };
        p.gotoAndStop = function(frameOrAnimation) {
          this.paused = true;
          this._goto(frameOrAnimation);
        };
        p.advance = function(time) {
          var fps = this.framerate || this.spriteSheet.framerate;
          var t = fps && time != null ? time / (1e3 / fps) : 1;
          this._normalizeFrame(t);
        };
        p.getBounds = function() {
          return this.DisplayObject_getBounds() || this.spriteSheet.getFrameBounds(this.currentFrame, this._rectangle);
        };
        p.clone = function() {
          return this._cloneProps(new Sprite(this.spriteSheet));
        };
        p.toString = function() {
          return "[Sprite (name=" + this.name + ")]";
        };
        p._cloneProps = function(o) {
          this.DisplayObject__cloneProps(o);
          o.currentFrame = this.currentFrame;
          o.currentAnimation = this.currentAnimation;
          o.paused = this.paused;
          o.currentAnimationFrame = this.currentAnimationFrame;
          o.framerate = this.framerate;
          o._animation = this._animation;
          o._currentFrame = this._currentFrame;
          o._skipAdvance = this._skipAdvance;
          return o;
        };
        p._tick = function(evtObj) {
          if (!this.paused) {
            if (!this._skipAdvance) {
              this.advance(evtObj && evtObj.delta);
            }
            this._skipAdvance = false;
          }
          this.DisplayObject__tick(evtObj);
        };
        p._normalizeFrame = function(frameDelta) {
          frameDelta = frameDelta || 0;
          var animation = this._animation;
          var paused = this.paused;
          var frame = this._currentFrame;
          var l;
          if (animation) {
            var speed = animation.speed || 1;
            var animFrame = this.currentAnimationFrame;
            l = animation.frames.length;
            if (animFrame + frameDelta * speed >= l) {
              var next = animation.next;
              if (this._dispatchAnimationEnd(animation, frame, paused, next, l - 1)) {
                return;
              } else if (next) {
                return this._goto(next, frameDelta - (l - animFrame) / speed);
              } else {
                this.paused = true;
                animFrame = animation.frames.length - 1;
              }
            } else {
              animFrame += frameDelta * speed;
            }
            this.currentAnimationFrame = animFrame;
            this._currentFrame = animation.frames[animFrame | 0];
          } else {
            frame = this._currentFrame += frameDelta;
            l = this.spriteSheet.getNumFrames();
            if (frame >= l && l > 0) {
              if (!this._dispatchAnimationEnd(animation, frame, paused, l - 1)) {
                if ((this._currentFrame -= l) >= l) {
                  return this._normalizeFrame();
                }
              }
            }
          }
          frame = this._currentFrame | 0;
          if (this.currentFrame != frame) {
            this.currentFrame = frame;
            this.dispatchEvent("change");
          }
        };
        p._dispatchAnimationEnd = function(animation, frame, paused, next, end) {
          var name = animation ? animation.name : null;
          if (this.hasEventListener("animationend")) {
            var evt = new createjs.Event("animationend");
            evt.name = name;
            evt.next = next;
            this.dispatchEvent(evt);
          }
          var changed = this._animation != animation || this._currentFrame != frame;
          if (!changed && !paused && this.paused) {
            this.currentAnimationFrame = end;
            changed = true;
          }
          return changed;
        };
        p._goto = function(frameOrAnimation, frame) {
          this.currentAnimationFrame = 0;
          if (isNaN(frameOrAnimation)) {
            var data = this.spriteSheet.getAnimation(frameOrAnimation);
            if (data) {
              this._animation = data;
              this.currentAnimation = frameOrAnimation;
              this._normalizeFrame(frame);
            }
          } else {
            this.currentAnimation = this._animation = null;
            this._currentFrame = frameOrAnimation;
            this._normalizeFrame();
          }
        };
        createjs.Sprite = createjs.promote(Sprite, "DisplayObject");
      })();
    }
  });

  // ../src/easeljs/display/SpriteSheet.js
  var require_SpriteSheet = __commonJS({
    "../src/easeljs/display/SpriteSheet.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function SpriteSheet(data) {
          this.EventDispatcher_constructor();
          this.complete = true;
          this.framerate = 0;
          this._animations = null;
          this._frames = null;
          this._images = null;
          this._data = null;
          this._loadCount = 0;
          this._frameHeight = 0;
          this._frameWidth = 0;
          this._numFrames = 0;
          this._regX = 0;
          this._regY = 0;
          this._spacing = 0;
          this._margin = 0;
          this._parseData(data);
        }
        var p = createjs.extend(SpriteSheet, createjs.EventDispatcher);
        p._getAnimations = function() {
          return this._animations.slice();
        };
        p.getAnimations = createjs.deprecate(p._getAnimations, "SpriteSheet.getAnimations");
        try {
          Object.defineProperties(p, {
            animations: { get: p._getAnimations }
          });
        } catch (e) {
        }
        p.getNumFrames = function(animation) {
          if (animation == null) {
            return this._frames ? this._frames.length : this._numFrames || 0;
          } else {
            var data = this._data[animation];
            if (data == null) {
              return 0;
            } else {
              return data.frames.length;
            }
          }
        };
        p.getAnimation = function(name) {
          return this._data[name];
        };
        p.getFrame = function(frameIndex) {
          var frame;
          if (this._frames && (frame = this._frames[frameIndex])) {
            return frame;
          }
          return null;
        };
        p.getFrameBounds = function(frameIndex, rectangle) {
          var frame = this.getFrame(frameIndex);
          return frame ? (rectangle || new createjs.Rectangle()).setValues(-frame.regX, -frame.regY, frame.rect.width, frame.rect.height) : null;
        };
        p.toString = function() {
          return "[SpriteSheet]";
        };
        p.clone = function() {
          throw "SpriteSheet cannot be cloned.";
        };
        p._parseData = function(data) {
          var i, l, o, a;
          if (data == null) {
            return;
          }
          this.framerate = data.framerate || 0;
          if (data.images && (l = data.images.length) > 0) {
            a = this._images = [];
            for (i = 0; i < l; i++) {
              var img = data.images[i];
              if (typeof img == "string") {
                var src = img;
                img = document.createElement("img");
                img.src = src;
              }
              a.push(img);
              if (!img.getContext && !img.naturalWidth) {
                this._loadCount++;
                this.complete = false;
                (function(o2, src2) {
                  img.onload = function() {
                    o2._handleImageLoad(src2);
                  };
                })(this, src);
                (function(o2, src2) {
                  img.onerror = function() {
                    o2._handleImageError(src2);
                  };
                })(this, src);
              }
            }
          }
          if (data.frames == null) {
          } else if (Array.isArray(data.frames)) {
            this._frames = [];
            a = data.frames;
            for (i = 0, l = a.length; i < l; i++) {
              var arr = a[i];
              this._frames.push({ image: this._images[arr[4] ? arr[4] : 0], rect: new createjs.Rectangle(arr[0], arr[1], arr[2], arr[3]), regX: arr[5] || 0, regY: arr[6] || 0 });
            }
          } else {
            o = data.frames;
            this._frameWidth = o.width;
            this._frameHeight = o.height;
            this._regX = o.regX || 0;
            this._regY = o.regY || 0;
            this._spacing = o.spacing || 0;
            this._margin = o.margin || 0;
            this._numFrames = o.count;
            if (this._loadCount == 0) {
              this._calculateFrames();
            }
          }
          this._animations = [];
          if ((o = data.animations) != null) {
            this._data = {};
            var name;
            for (name in o) {
              var anim = { name };
              var obj = o[name];
              if (typeof obj == "number") {
                a = anim.frames = [obj];
              } else if (Array.isArray(obj)) {
                if (obj.length == 1) {
                  anim.frames = [obj[0]];
                } else {
                  anim.speed = obj[3];
                  anim.next = obj[2];
                  a = anim.frames = [];
                  for (i = obj[0]; i <= obj[1]; i++) {
                    a.push(i);
                  }
                }
              } else {
                anim.speed = obj.speed;
                anim.next = obj.next;
                var frames = obj.frames;
                a = anim.frames = typeof frames == "number" ? [frames] : frames.slice(0);
              }
              if (anim.next === true || anim.next === void 0) {
                anim.next = name;
              }
              if (anim.next === false || a.length < 2 && anim.next == name) {
                anim.next = null;
              }
              if (!anim.speed) {
                anim.speed = 1;
              }
              this._animations.push(name);
              this._data[name] = anim;
            }
          }
        };
        p._handleImageLoad = function(src) {
          if (--this._loadCount == 0) {
            this._calculateFrames();
            this.complete = true;
            this.dispatchEvent("complete");
          }
        };
        p._handleImageError = function(src) {
          var errorEvent = new createjs.Event("error");
          errorEvent.src = src;
          this.dispatchEvent(errorEvent);
          if (--this._loadCount == 0) {
            this.dispatchEvent("complete");
          }
        };
        p._calculateFrames = function() {
          if (this._frames || this._frameWidth == 0) {
            return;
          }
          this._frames = [];
          var maxFrames = this._numFrames || 1e5;
          var frameCount = 0, frameWidth = this._frameWidth, frameHeight = this._frameHeight;
          var spacing = this._spacing, margin = this._margin;
          imgLoop:
            for (var i = 0, imgs = this._images; i < imgs.length; i++) {
              var img = imgs[i], imgW = img.width || img.naturalWidth, imgH = img.height || img.naturalHeight;
              var y = margin;
              while (y <= imgH - margin - frameHeight) {
                var x = margin;
                while (x <= imgW - margin - frameWidth) {
                  if (frameCount >= maxFrames) {
                    break imgLoop;
                  }
                  frameCount++;
                  this._frames.push({
                    image: img,
                    rect: new createjs.Rectangle(x, y, frameWidth, frameHeight),
                    regX: this._regX,
                    regY: this._regY
                  });
                  x += frameWidth + spacing;
                }
                y += frameHeight + spacing;
              }
            }
          this._numFrames = frameCount;
        };
        createjs.SpriteSheet = createjs.promote(SpriteSheet, "EventDispatcher");
      })();
    }
  });

  // ../src/easeljs/display/Stage.js
  var require_Stage = __commonJS({
    "../src/easeljs/display/Stage.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Stage(canvas) {
          this.Container_constructor();
          this.autoClear = true;
          this.canvas = typeof canvas == "string" ? document.getElementById(canvas) : canvas;
          this.mouseX = 0;
          this.mouseY = 0;
          this.drawRect = null;
          this.snapToPixelEnabled = false;
          this.mouseInBounds = false;
          this.tickOnUpdate = true;
          this.mouseMoveOutside = false;
          this.preventSelection = true;
          this._pointerData = {};
          this._pointerCount = 0;
          this._primaryPointerID = null;
          this._mouseOverIntervalID = null;
          this._nextStage = null;
          this._prevStage = null;
          this.enableDOMEvents(true);
        }
        var p = createjs.extend(Stage, createjs.Container);
        p._get_nextStage = function() {
          return this._nextStage;
        };
        p._set_nextStage = function(value) {
          if (this._nextStage) {
            this._nextStage._prevStage = null;
          }
          if (value) {
            value._prevStage = this;
          }
          this._nextStage = value;
        };
        try {
          Object.defineProperties(p, {
            nextStage: { get: p._get_nextStage, set: p._set_nextStage }
          });
        } catch (e) {
        }
        p.update = function(props) {
          if (!this.canvas) {
            return;
          }
          if (this.tickOnUpdate) {
            this.tick(props);
          }
          if (this.dispatchEvent("drawstart", false, true) === false) {
            return;
          }
          createjs.DisplayObject._snapToPixelEnabled = this.snapToPixelEnabled;
          var r = this.drawRect, ctx = this.canvas.getContext("2d");
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          if (this.autoClear) {
            if (r) {
              ctx.clearRect(r.x, r.y, r.width, r.height);
            } else {
              ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
            }
          }
          ctx.save();
          if (this.drawRect) {
            ctx.beginPath();
            ctx.rect(r.x, r.y, r.width, r.height);
            ctx.clip();
          }
          this.updateContext(ctx);
          this.draw(ctx, false);
          ctx.restore();
          this.dispatchEvent("drawend");
        };
        p.draw = function(ctx, ignoreCache) {
          var result = this.Container_draw(ctx, ignoreCache);
          this.canvas._invalid = true;
          return result;
        };
        p.tick = function(props) {
          if (!this.tickEnabled || this.dispatchEvent("tickstart", false, true) === false) {
            return;
          }
          var evtObj = new createjs.Event("tick");
          if (props) {
            for (var n in props) {
              if (props.hasOwnProperty(n)) {
                evtObj[n] = props[n];
              }
            }
          }
          this._tick(evtObj);
          this.dispatchEvent("tickend");
        };
        p.handleEvent = function(evt) {
          if (evt.type == "tick") {
            this.update(evt);
          }
        };
        p.clear = function() {
          if (!this.canvas) {
            return;
          }
          var ctx = this.canvas.getContext("2d");
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, this.canvas.width + 1, this.canvas.height + 1);
        };
        p.toDataURL = function(backgroundColor, mimeType) {
          var data, ctx = this.canvas.getContext("2d"), w = this.canvas.width, h = this.canvas.height;
          if (backgroundColor) {
            data = ctx.getImageData(0, 0, w, h);
            var compositeOperation = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, w, h);
          }
          var dataURL = this.canvas.toDataURL(mimeType || "image/png");
          if (backgroundColor) {
            ctx.putImageData(data, 0, 0);
            ctx.globalCompositeOperation = compositeOperation;
          }
          return dataURL;
        };
        p.enableMouseOver = function(frequency) {
          if (this._mouseOverIntervalID) {
            clearInterval(this._mouseOverIntervalID);
            this._mouseOverIntervalID = null;
            if (frequency == 0) {
              this._testMouseOver(true);
            }
          }
          if (frequency == null) {
            frequency = 20;
          } else if (frequency <= 0) {
            return;
          }
          var o = this;
          this._mouseOverIntervalID = setInterval(function() {
            o._testMouseOver();
          }, 1e3 / Math.min(50, frequency));
        };
        p.enableDOMEvents = function(enable) {
          if (enable == null) {
            enable = true;
          }
          var n, o, ls = this._eventListeners;
          if (!enable && ls) {
            for (n in ls) {
              o = ls[n];
              o.t.removeEventListener(n, o.f, false);
            }
            this._eventListeners = null;
          } else if (enable && !ls && this.canvas) {
            var t = window.addEventListener ? window : document;
            var _this = this;
            ls = this._eventListeners = {};
            ls["mouseup"] = { t, f: function(e) {
              _this._handleMouseUp(e);
            } };
            ls["mousemove"] = { t, f: function(e) {
              _this._handleMouseMove(e);
            } };
            ls["dblclick"] = { t: this.canvas, f: function(e) {
              _this._handleDoubleClick(e);
            } };
            ls["mousedown"] = { t: this.canvas, f: function(e) {
              _this._handleMouseDown(e);
            } };
            for (n in ls) {
              o = ls[n];
              o.t.addEventListener(n, o.f, false);
            }
          }
        };
        p.clone = function() {
          throw "Stage cannot be cloned.";
        };
        p.toString = function() {
          return "[Stage (name=" + this.name + ")]";
        };
        p._getElementRect = function(e) {
          var bounds;
          try {
            bounds = e.getBoundingClientRect();
          } catch (err) {
            bounds = { top: e.offsetTop, left: e.offsetLeft, width: e.offsetWidth, height: e.offsetHeight };
          }
          var offX = (window.pageXOffset || document.scrollLeft || 0) - (document.clientLeft || document.body.clientLeft || 0);
          var offY = (window.pageYOffset || document.scrollTop || 0) - (document.clientTop || document.body.clientTop || 0);
          var styles = window.getComputedStyle ? getComputedStyle(e, null) : e.currentStyle;
          var padL = parseInt(styles.paddingLeft) + parseInt(styles.borderLeftWidth);
          var padT = parseInt(styles.paddingTop) + parseInt(styles.borderTopWidth);
          var padR = parseInt(styles.paddingRight) + parseInt(styles.borderRightWidth);
          var padB = parseInt(styles.paddingBottom) + parseInt(styles.borderBottomWidth);
          return {
            left: bounds.left + offX + padL,
            right: bounds.right + offX - padR,
            top: bounds.top + offY + padT,
            bottom: bounds.bottom + offY - padB
          };
        };
        p._getPointerData = function(id) {
          var data = this._pointerData[id];
          if (!data) {
            data = this._pointerData[id] = { x: 0, y: 0 };
          }
          return data;
        };
        p._handleMouseMove = function(e) {
          if (!e) {
            e = window.event;
          }
          this._handlePointerMove(-1, e, e.pageX, e.pageY);
        };
        p._handlePointerMove = function(id, e, pageX, pageY, owner) {
          if (this._prevStage && owner === void 0) {
            return;
          }
          if (!this.canvas) {
            return;
          }
          var nextStage = this._nextStage, o = this._getPointerData(id);
          var inBounds = o.inBounds;
          this._updatePointerPosition(id, e, pageX, pageY);
          if (inBounds || o.inBounds || this.mouseMoveOutside) {
            if (id === -1 && o.inBounds == !inBounds) {
              this._dispatchMouseEvent(this, inBounds ? "mouseleave" : "mouseenter", false, id, o, e);
            }
            this._dispatchMouseEvent(this, "stagemousemove", false, id, o, e);
            this._dispatchMouseEvent(o.target, "pressmove", true, id, o, e);
          }
          nextStage && nextStage._handlePointerMove(id, e, pageX, pageY, null);
        };
        p._updatePointerPosition = function(id, e, pageX, pageY) {
          var rect = this._getElementRect(this.canvas);
          pageX -= rect.left;
          pageY -= rect.top;
          var w = this.canvas.width;
          var h = this.canvas.height;
          pageX /= (rect.right - rect.left) / w;
          pageY /= (rect.bottom - rect.top) / h;
          var o = this._getPointerData(id);
          if (o.inBounds = pageX >= 0 && pageY >= 0 && pageX <= w - 1 && pageY <= h - 1) {
            o.x = pageX;
            o.y = pageY;
          } else if (this.mouseMoveOutside) {
            o.x = pageX < 0 ? 0 : pageX > w - 1 ? w - 1 : pageX;
            o.y = pageY < 0 ? 0 : pageY > h - 1 ? h - 1 : pageY;
          }
          o.posEvtObj = e;
          o.rawX = pageX;
          o.rawY = pageY;
          if (id === this._primaryPointerID || id === -1) {
            this.mouseX = o.x;
            this.mouseY = o.y;
            this.mouseInBounds = o.inBounds;
          }
        };
        p._handleMouseUp = function(e) {
          this._handlePointerUp(-1, e, false);
        };
        p._handlePointerUp = function(id, e, clear, owner) {
          var nextStage = this._nextStage, o = this._getPointerData(id);
          if (this._prevStage && owner === void 0) {
            return;
          }
          var target = null, oTarget = o.target;
          if (!owner && (oTarget || nextStage)) {
            target = this._getObjectsUnderPoint(o.x, o.y, null, true);
          }
          if (o.down) {
            this._dispatchMouseEvent(this, "stagemouseup", false, id, o, e, target);
            o.down = false;
          }
          if (target == oTarget) {
            this._dispatchMouseEvent(oTarget, "click", true, id, o, e);
          }
          this._dispatchMouseEvent(oTarget, "pressup", true, id, o, e);
          if (clear) {
            if (id == this._primaryPointerID) {
              this._primaryPointerID = null;
            }
            delete this._pointerData[id];
          } else {
            o.target = null;
          }
          nextStage && nextStage._handlePointerUp(id, e, clear, owner || target && this);
        };
        p._handleMouseDown = function(e) {
          this._handlePointerDown(-1, e, e.pageX, e.pageY);
        };
        p._handlePointerDown = function(id, e, pageX, pageY, owner) {
          if (this.preventSelection) {
            e.preventDefault();
          }
          if (this._primaryPointerID == null || id === -1) {
            this._primaryPointerID = id;
          }
          if (pageY != null) {
            this._updatePointerPosition(id, e, pageX, pageY);
          }
          var target = null, nextStage = this._nextStage, o = this._getPointerData(id);
          if (!owner) {
            target = o.target = this._getObjectsUnderPoint(o.x, o.y, null, true);
          }
          if (o.inBounds) {
            this._dispatchMouseEvent(this, "stagemousedown", false, id, o, e, target);
            o.down = true;
          }
          this._dispatchMouseEvent(target, "mousedown", true, id, o, e);
          nextStage && nextStage._handlePointerDown(id, e, pageX, pageY, owner || target && this);
        };
        p._testMouseOver = function(clear, owner, eventTarget) {
          if (this._prevStage && owner === void 0) {
            return;
          }
          var nextStage = this._nextStage;
          if (!this._mouseOverIntervalID) {
            nextStage && nextStage._testMouseOver(clear, owner, eventTarget);
            return;
          }
          var o = this._getPointerData(-1);
          if (!o || !clear && this.mouseX == this._mouseOverX && this.mouseY == this._mouseOverY && this.mouseInBounds) {
            return;
          }
          var e = o.posEvtObj;
          var isEventTarget = eventTarget || e && e.target == this.canvas;
          var target = null, common = -1, cursor = "", t, i, l;
          if (!owner && (clear || this.mouseInBounds && isEventTarget)) {
            target = this._getObjectsUnderPoint(this.mouseX, this.mouseY, null, true);
            this._mouseOverX = this.mouseX;
            this._mouseOverY = this.mouseY;
          }
          var oldList = this._mouseOverTarget || [];
          var oldTarget = oldList[oldList.length - 1];
          var list = this._mouseOverTarget = [];
          t = target;
          while (t) {
            list.unshift(t);
            if (!cursor) {
              cursor = t.cursor;
            }
            t = t.parent;
          }
          this.canvas.style.cursor = cursor;
          if (!owner && eventTarget) {
            eventTarget.canvas.style.cursor = cursor;
          }
          for (i = 0, l = list.length; i < l; i++) {
            if (list[i] != oldList[i]) {
              break;
            }
            common = i;
          }
          if (oldTarget != target) {
            this._dispatchMouseEvent(oldTarget, "mouseout", true, -1, o, e, target);
          }
          for (i = oldList.length - 1; i > common; i--) {
            this._dispatchMouseEvent(oldList[i], "rollout", false, -1, o, e, target);
          }
          for (i = list.length - 1; i > common; i--) {
            this._dispatchMouseEvent(list[i], "rollover", false, -1, o, e, oldTarget);
          }
          if (oldTarget != target) {
            this._dispatchMouseEvent(target, "mouseover", true, -1, o, e, oldTarget);
          }
          nextStage && nextStage._testMouseOver(clear, owner || target && this, eventTarget || isEventTarget && this);
        };
        p._handleDoubleClick = function(e, owner) {
          var target = null, nextStage = this._nextStage, o = this._getPointerData(-1);
          if (!owner) {
            target = this._getObjectsUnderPoint(o.x, o.y, null, true);
            this._dispatchMouseEvent(target, "dblclick", true, -1, o, e);
          }
          nextStage && nextStage._handleDoubleClick(e, owner || target && this);
        };
        p._dispatchMouseEvent = function(target, type, bubbles, pointerId, o, nativeEvent, relatedTarget) {
          if (!target || !bubbles && !target.hasEventListener(type)) {
            return;
          }
          var evt = new createjs.MouseEvent(type, bubbles, false, o.x, o.y, nativeEvent, pointerId, pointerId === this._primaryPointerID || pointerId === -1, o.rawX, o.rawY, relatedTarget);
          target.dispatchEvent(evt);
        };
        createjs.Stage = createjs.promote(Stage, "Container");
      })();
    }
  });

  // ../src/easeljs/display/StageGL.js
  var require_StageGL = __commonJS({
    "../src/easeljs/display/StageGL.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function StageGL(canvas, options) {
          this.Stage_constructor(canvas);
          var transparent, antialias, preserveBuffer, autoPurge, directDraw, batchSize;
          if (options !== void 0) {
            if (typeof options !== "object") {
              throw "Invalid options object";
            }
            transparent = options.transparent;
            antialias = options.antialias;
            preserveBuffer = options.preserveBuffer;
            autoPurge = options.autoPurge;
            directDraw = options.directDraw;
            batchSize = options.batchSize;
          }
          this.vocalDebug = false;
          this.isCacheControlled = false;
          this._preserveBuffer = preserveBuffer || false;
          this._antialias = antialias || false;
          this._transparent = transparent || false;
          this._autoPurge = void 0;
          this.autoPurge = autoPurge;
          this._directDraw = directDraw === void 0 ? true : !!directDraw;
          this._viewportWidth = 0;
          this._viewportHeight = 0;
          this._projectionMatrix = null;
          this._webGLContext = null;
          this._frameBuffer = null;
          this._clearColor = { r: 0.5, g: 0.5, b: 0.5, a: 0 };
          this._maxBatchVertexCount = Math.max(
            Math.min(
              Number(batchSize) || StageGL.DEFAULT_MAX_BATCH_SIZE,
              StageGL.DEFAULT_MAX_BATCH_SIZE
            ),
            StageGL.DEFAULT_MIN_BATCH_SIZE
          ) * StageGL.INDICIES_PER_CARD;
          this._activeShader = null;
          this._mainShader = null;
          this._attributeConfig = {};
          this._activeConfig = null;
          this._bufferTextureOutput = null;
          this._bufferTextureConcat = null;
          this._bufferTextureTemp = null;
          this._batchTextureOutput = this;
          this._batchTextureConcat = null;
          this._batchTextureTemp = null;
          this._builtShaders = {};
          this._textureDictionary = [];
          this._textureIDs = {};
          this._batchTextures = [];
          this._baseTextures = [];
          this._gpuTextureCount = 8;
          this._gpuTextureMax = 8;
          this._batchTextureCount = 0;
          this._lastTextureInsert = -1;
          this._renderMode = "";
          this._immediateRender = false;
          this._batchVertexCount = 0;
          this._batchID = 0;
          this._drawID = 0;
          this._renderPerDraw = 0;
          this._slotBlacklist = [];
          this._lastTrackedCanvas = -1;
          this._cacheContainer = new createjs.Container();
          this._initializeWebGL();
          if (options !== void 0) {
            options.clearColor !== void 0 && this.setClearColor(options.clearColor);
            options.premultiply !== void 0 && createjs.deprecate(null, "options.premultiply")();
          }
        }
        var p = createjs.extend(StageGL, createjs.Stage);
        StageGL.buildUVRects = function(spritesheet, target, onlyTarget) {
          if (!spritesheet || !spritesheet._frames) {
            return null;
          }
          if (target === void 0) {
            target = -1;
          }
          if (onlyTarget === void 0) {
            onlyTarget = false;
          }
          var start = target !== -1 && onlyTarget ? target : 0;
          var end = target !== -1 && onlyTarget ? target + 1 : spritesheet._frames.length;
          for (var i = start; i < end; i++) {
            var f = spritesheet._frames[i];
            if (f.uvRect || f.image.width <= 0 || f.image.height <= 0) {
              continue;
            }
            var r = f.rect;
            f.uvRect = {
              t: 1 - r.y / f.image.height,
              l: r.x / f.image.width,
              b: 1 - (r.y + r.height) / f.image.height,
              r: (r.x + r.width) / f.image.width
            };
          }
          return spritesheet._frames[target !== -1 ? target : 0].uvRect || { t: 0, l: 0, b: 1, r: 1 };
        };
        StageGL.isWebGLActive = function(ctx) {
          return ctx && ctx instanceof WebGLRenderingContext && typeof WebGLRenderingContext !== "undefined";
        };
        StageGL.colorToObj = function(color) {
          var r, g, b, a;
          if (typeof color === "string") {
            if (color.indexOf("#") === 0) {
              if (color.length === 4) {
                color = "#" + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2) + color.charAt(3) + color.charAt(3);
              }
              r = Number("0x" + color.slice(1, 3)) / 255;
              g = Number("0x" + color.slice(3, 5)) / 255;
              b = Number("0x" + color.slice(5, 7)) / 255;
              a = color.length > 7 ? Number("0x" + color.slice(7, 9)) / 255 : 1;
            } else if (color.indexOf("rgba(") === 0) {
              var output = color.slice(5, -1).split(",");
              r = Number(output[0]) / 255;
              g = Number(output[1]) / 255;
              b = Number(output[2]) / 255;
              a = Number(output[3]);
            }
          } else {
            r = ((color & 4278190080) >>> 24) / 255;
            g = ((color & 16711680) >>> 16) / 255;
            b = ((color & 65280) >>> 8) / 255;
            a = (color & 255) / 255;
          }
          return {
            r: Math.min(Math.max(0, r), 1),
            g: Math.min(Math.max(0, g), 1),
            b: Math.min(Math.max(0, b), 1),
            a: Math.min(Math.max(0, a), 1)
          };
        };
        StageGL.VERTEX_PROPERTY_COUNT = 6;
        StageGL.INDICIES_PER_CARD = 6;
        StageGL.DEFAULT_MAX_BATCH_SIZE = 10920;
        StageGL.DEFAULT_MIN_BATCH_SIZE = 170;
        StageGL.WEBGL_MAX_INDEX_NUM = Math.pow(2, 16);
        StageGL.UV_RECT = { t: 1, l: 0, b: 0, r: 1 };
        try {
          StageGL.COVER_VERT = new Float32Array([
            -1,
            1,
            //TL
            1,
            1,
            //TR
            -1,
            -1,
            //BL
            1,
            1,
            //TR
            1,
            -1,
            //BR
            -1,
            -1
            //BL
          ]);
          StageGL.COVER_UV = new Float32Array([
            0,
            1,
            //TL
            1,
            1,
            //TR
            0,
            0,
            //BL
            1,
            1,
            //TR
            1,
            0,
            //BR
            0,
            0
            //BL
          ]);
        } catch (e) {
        }
        StageGL.REGULAR_VARYING_HEADER = "precision highp float;varying vec2 vTextureCoord;varying lowp float indexPicker;varying lowp float alphaValue;";
        StageGL.REGULAR_VERTEX_HEADER = StageGL.REGULAR_VARYING_HEADER + "attribute vec2 vertexPosition;attribute vec2 uvPosition;attribute lowp float textureIndex;attribute lowp float objectAlpha;uniform mat4 pMatrix;";
        StageGL.REGULAR_FRAGMENT_HEADER = StageGL.REGULAR_VARYING_HEADER + "uniform sampler2D uSampler[{{count}}];";
        StageGL.REGULAR_VERTEX_BODY = "void main(void) {gl_Position = pMatrix * vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);alphaValue = objectAlpha;indexPicker = textureIndex;vTextureCoord = uvPosition;}";
        StageGL.REGULAR_FRAGMENT_BODY = "void main(void) {vec4 color = vec4(1.0, 0.0, 0.0, 1.0);if (indexPicker <= 0.5) {color = texture2D(uSampler[0], vTextureCoord);{{alternates}}}gl_FragColor = vec4(color.rgb * alphaValue, color.a * alphaValue);}";
        StageGL.COVER_VARYING_HEADER = "precision highp float;varying vec2 vTextureCoord;";
        StageGL.COVER_VERTEX_HEADER = StageGL.COVER_VARYING_HEADER + "attribute vec2 vertexPosition;attribute vec2 uvPosition;";
        StageGL.COVER_FRAGMENT_HEADER = StageGL.COVER_VARYING_HEADER + "uniform sampler2D uSampler;";
        StageGL.COVER_VERTEX_BODY = "void main(void) {gl_Position = vec4(vertexPosition.x, vertexPosition.y, 0.0, 1.0);vTextureCoord = uvPosition;}";
        StageGL.COVER_FRAGMENT_BODY = "void main(void) {gl_FragColor = texture2D(uSampler, vTextureCoord);}";
        StageGL.BLEND_FRAGMENT_SIMPLE = "uniform sampler2D uMixSampler;void main(void) {vec4 src = texture2D(uMixSampler, vTextureCoord);vec4 dst = texture2D(uSampler, vTextureCoord);";
        StageGL.BLEND_FRAGMENT_COMPLEX = StageGL.BLEND_FRAGMENT_SIMPLE + "vec3 srcClr = min(src.rgb/src.a, 1.0);vec3 dstClr = min(dst.rgb/dst.a, 1.0);float totalAlpha = min(1.0 - (1.0-dst.a) * (1.0-src.a), 1.0);float srcFactor = min(max(src.a - dst.a, 0.0) / totalAlpha, 1.0);float dstFactor = min(max(dst.a - src.a, 0.0) / totalAlpha, 1.0);float mixFactor = max(max(1.0 - srcFactor, 0.0) - dstFactor, 0.0);gl_FragColor = vec4((srcFactor * srcClr +dstFactor * dstClr +mixFactor * vec3(";
        StageGL.BLEND_FRAGMENT_COMPLEX_CAP = ")) * totalAlpha, totalAlpha);}";
        StageGL.BLEND_FRAGMENT_OVERLAY_UTIL = "float overlay(float a, float b) {if(a < 0.5) { return 2.0 * a * b; }return 1.0 - 2.0 * (1.0-a) * (1.0-b);}";
        StageGL.BLEND_FRAGMENT_HSL_UTIL = "float getLum(vec3 c) { return 0.299*c.r + 0.589*c.g + 0.109*c.b; }float getSat(vec3 c) { return max(max(c.r, c.g), c.b) - min(min(c.r, c.g), c.b); }vec3 clipHSL(vec3 c) {float lum = getLum(c);float n = min(min(c.r, c.g), c.b);float x = max(max(c.r, c.g), c.b);if(n < 0.0){ c = lum + (((c - lum) * lum) / (lum - n)); }if(x > 1.0){ c = lum + (((c - lum) * (1.0 - lum)) / (x - lum)); }return clamp(c, 0.0, 1.0);}vec3 setLum(vec3 c, float lum) {return clipHSL(c + (lum - getLum(c)));}vec3 setSat(vec3 c, float val) {vec3 result = vec3(0.0);float minVal = min(min(c.r, c.g), c.b);float maxVal = max(max(c.r, c.g), c.b);vec3 minMask = vec3(c.r == minVal, c.g == minVal, c.b == minVal);vec3 maxMask = vec3(c.r == maxVal, c.g == maxVal, c.b == maxVal);vec3 midMask = 1.0 - min(minMask+maxMask, 1.0);float midVal = (c*midMask).r + (c*midMask).g + (c*midMask).b;if(maxVal > minVal) {result = midMask * min( ((midVal - minVal) * val) / (maxVal - minVal), 1.0);result += maxMask * val;}return result;}";
        StageGL.BLEND_SOURCES = {
          "source-over": {
            // empty object verifies it as a blend mode, but default values handle actual settings
            //eqRGB: "FUNC_ADD",						eqA: "FUNC_ADD"
            //srcRGB: "ONE",							srcA: "ONE"
            //dstRGB: "ONE_MINUS_SRC_ALPHA",			dstA: "ONE_MINUS_SRC_ALPHA"
          },
          "source-in": {
            shader: StageGL.BLEND_FRAGMENT_SIMPLE + "gl_FragColor = vec4(src.rgb * dst.a, src.a * dst.a);}"
          },
          "source-in_cheap": {
            srcRGB: "DST_ALPHA",
            srcA: "ZERO",
            dstRGB: "ZERO",
            dstA: "SRC_ALPHA"
          },
          "source-out": {
            shader: StageGL.BLEND_FRAGMENT_SIMPLE + "gl_FragColor = vec4(src.rgb * (1.0 - dst.a), src.a - dst.a);}"
          },
          "source-out_cheap": {
            eqA: "FUNC_SUBTRACT",
            srcRGB: "ONE_MINUS_DST_ALPHA",
            srcA: "ONE",
            dstRGB: "ZERO",
            dstA: "SRC_ALPHA"
          },
          "source-atop": {
            srcRGB: "DST_ALPHA",
            srcA: "ZERO",
            dstRGB: "ONE_MINUS_SRC_ALPHA",
            dstA: "ONE"
          },
          "destination-over": {
            srcRGB: "ONE_MINUS_DST_ALPHA",
            srcA: "ONE_MINUS_DST_ALPHA",
            dstRGB: "ONE",
            dstA: "ONE"
          },
          "destination-in": {
            shader: StageGL.BLEND_FRAGMENT_SIMPLE + "gl_FragColor = vec4(dst.rgb * src.a, src.a * dst.a);}"
          },
          "destination-in_cheap": {
            srcRGB: "ZERO",
            srcA: "DST_ALPHA",
            dstRGB: "SRC_ALPHA",
            dstA: "ZERO"
          },
          "destination-out": {
            eqA: "FUNC_REVERSE_SUBTRACT",
            srcRGB: "ZERO",
            srcA: "DST_ALPHA",
            dstRGB: "ONE_MINUS_SRC_ALPHA",
            dstA: "ONE"
          },
          "destination-atop": {
            shader: StageGL.BLEND_FRAGMENT_SIMPLE + "gl_FragColor = vec4(dst.rgb * src.a + src.rgb * (1.0 - dst.a), src.a);}"
          },
          "destination-atop_cheap": {
            srcRGB: "ONE_MINUS_DST_ALPHA",
            srcA: "ONE",
            dstRGB: "SRC_ALPHA",
            dstA: "ZERO"
          },
          "copy": {
            shader: StageGL.BLEND_FRAGMENT_SIMPLE + "gl_FragColor = vec4(src.rgb, src.a);}"
          },
          "copy_cheap": {
            dstRGB: "ZERO",
            dstA: "ZERO"
          },
          "xor": {
            shader: StageGL.BLEND_FRAGMENT_SIMPLE + "float omSRC = (1.0 - src.a);float omDST = (1.0 - dst.a);gl_FragColor = vec4(src.rgb * omDST + dst.rgb * omSRC, src.a * omDST + dst.a * omSRC);}"
          },
          "multiply": {
            // this has to be complex to handle retention of both dst and src in non mixed scenarios
            shader: StageGL.BLEND_FRAGMENT_COMPLEX + "srcClr * dstClr" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "multiply_cheap": {
            // NEW, handles retention of src data incorrectly when no dst data present
            srcRGB: "ONE_MINUS_DST_ALPHA",
            srcA: "ONE",
            dstRGB: "SRC_COLOR",
            dstA: "ONE"
          },
          "screen": {
            srcRGB: "ONE",
            srcA: "ONE",
            dstRGB: "ONE_MINUS_SRC_COLOR",
            dstA: "ONE_MINUS_SRC_ALPHA"
          },
          "lighter": {
            dstRGB: "ONE",
            dstA: "ONE"
          },
          "lighten": {
            //WebGL 2.0 can optimize this
            shader: StageGL.BLEND_FRAGMENT_COMPLEX + "max(srcClr, dstClr)" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "darken": {
            //WebGL 2.0 can optimize this
            shader: StageGL.BLEND_FRAGMENT_COMPLEX + "min(srcClr, dstClr)" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "overlay": {
            shader: StageGL.BLEND_FRAGMENT_OVERLAY_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX + "overlay(dstClr.r,srcClr.r), overlay(dstClr.g,srcClr.g), overlay(dstClr.b,srcClr.b)" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "hard-light": {
            shader: StageGL.BLEND_FRAGMENT_OVERLAY_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX + "overlay(srcClr.r,dstClr.r), overlay(srcClr.g,dstClr.g), overlay(srcClr.b,dstClr.b)" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "soft-light": {
            shader: "float softcurve(float a) {if(a > 0.25) { return sqrt(a); }return ((16.0 * a - 12.0) * a + 4.0) * a;}float softmix(float a, float b) {if(b <= 0.5) { return a - (1.0 - 2.0*b) * a * (1.0 - a); }return a + (2.0 * b - 1.0) * (softcurve(a) - a);}" + StageGL.BLEND_FRAGMENT_COMPLEX + "softmix(dstClr.r,srcClr.r), softmix(dstClr.g,srcClr.g), softmix(dstClr.b,srcClr.b)" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "color-dodge": {
            shader: StageGL.BLEND_FRAGMENT_COMPLEX + "clamp(dstClr / (1.0 - srcClr), 0.0, 1.0)" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "color-burn": {
            shader: StageGL.BLEND_FRAGMENT_COMPLEX + "1.0 - clamp((1.0 - smoothstep(0.0035, 0.9955, dstClr)) / smoothstep(0.0035, 0.9955, srcClr), 0.0, 1.0)" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "difference": {
            // do this to match visible results in browsers
            shader: StageGL.BLEND_FRAGMENT_COMPLEX + "abs(src.rgb - dstClr)" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "exclusion": {
            // do this to match visible results in browsers
            shader: StageGL.BLEND_FRAGMENT_COMPLEX + "dstClr + src.rgb - 2.0 * src.rgb * dstClr" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "hue": {
            shader: StageGL.BLEND_FRAGMENT_HSL_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX + "setLum(setSat(srcClr, getSat(dstClr)), getLum(dstClr))" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "saturation": {
            shader: StageGL.BLEND_FRAGMENT_HSL_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX + "setLum(setSat(dstClr, getSat(srcClr)), getLum(dstClr))" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "color": {
            shader: StageGL.BLEND_FRAGMENT_HSL_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX + "setLum(srcClr, getLum(dstClr))" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          },
          "luminosity": {
            shader: StageGL.BLEND_FRAGMENT_HSL_UTIL + StageGL.BLEND_FRAGMENT_COMPLEX + "setLum(dstClr, getLum(srcClr))" + StageGL.BLEND_FRAGMENT_COMPLEX_CAP
          }
        };
        p._get_isWebGL = function() {
          return !!this._webGLContext;
        };
        p._set_autoPurge = function(value) {
          value = isNaN(value) ? 1200 : value;
          if (value !== -1) {
            value = value < 10 ? 10 : value;
          }
          this._autoPurge = value;
        };
        p._get_autoPurge = function() {
          return Number(this._autoPurge);
        };
        try {
          Object.defineProperties(p, {
            /**
             * Indicates whether WebGL is being used for rendering. For example, this would be `false` if WebGL is not
             * supported in the browser.
             * @property isWebGL
             * @type {Boolean}
             * @readonly
             */
            isWebGL: { get: p._get_isWebGL },
            /**
             * Specifies whether or not StageGL is automatically purging unused textures. Higher numbers purge less
             * often. Values below 10 are upgraded to 10, and -1 disables this feature. If you are not dynamically adding
             * and removing new images this can be se9000t to -1, and should be for performance reasons. If you only add images,
             * or add and remove the same images for the entire application, it is safe to turn off this feature. Alternately,
             * manually manage removing textures yourself with {{#crossLink "StageGL/releaseTexture"}}{{/crossLink}}
             * @property autoPurge
             * @type {int}
             * @default 1000
             */
            autoPurge: { get: p._get_autoPurge, set: p._set_autoPurge }
          });
        } catch (e) {
        }
        p._initializeWebGL = function() {
          if (this.canvas) {
            if (!this._webGLContext || this._webGLContext.canvas !== this.canvas) {
              var options = {
                depth: false,
                // nothing has depth
                stencil: false,
                // while there's uses for this, we're not using any yet
                premultipliedAlpha: this._transparent,
                // this is complicated, trust it
                alpha: this._transparent,
                antialias: this._antialias,
                preserveDrawingBuffer: this._preserveBuffer
              };
              var gl = this._webGLContext = this._fetchWebGLContext(this.canvas, options);
              if (!gl) {
                return null;
              }
              gl.disable(gl.DEPTH_TEST);
              gl.depthMask(false);
              gl.enable(gl.BLEND);
              gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
              gl.clearColor(0, 0, 0, 0);
              gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
              gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              this._createBuffers();
              this._initMaterials();
              this._updateRenderMode("source-over");
              this.updateViewport(this.canvas.width, this.canvas.height);
              if (!this._directDraw) {
                this._bufferTextureOutput = this.getRenderBufferTexture(this._viewportWidth, this._viewportHeight);
              }
              this.canvas._invalid = true;
            }
          } else {
            this._webGLContext = null;
          }
          return this._webGLContext;
        };
        p.update = function(props) {
          if (!this.canvas) {
            return;
          }
          if (this.tickOnUpdate) {
            this.tick(props);
          }
          this.dispatchEvent("drawstart");
          if (this._webGLContext) {
            this.draw(this._webGLContext, false);
          } else {
            if (this.autoClear) {
              this.clear();
            }
            var ctx = this.canvas.getContext("2d");
            ctx.save();
            this.updateContext(ctx);
            this.draw(ctx, false);
            ctx.restore();
          }
          this.dispatchEvent("drawend");
        };
        p.clear = function() {
          if (!this.canvas) {
            return;
          }
          var gl = this._webGLContext;
          if (!StageGL.isWebGLActive(gl)) {
            this.Stage_clear();
            return;
          }
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          this._clearFrameBuffer(this._transparent ? this._clearColor.a : 1);
        };
        p.draw = function(context, ignoreCache) {
          var gl = this._webGLContext;
          if (!(context === this._webGLContext && StageGL.isWebGLActive(gl))) {
            return this.Stage_draw(context, ignoreCache);
          }
          var storeBatchOutput = this._batchTextureOutput;
          var storeBatchConcat = this._batchTextureConcat;
          var storeBatchTemp = this._batchTextureTemp;
          this._renderPerDraw = 0;
          this._batchVertexCount = 0;
          this._drawID++;
          if (this._directDraw) {
            this._batchTextureOutput = this;
            if (this.autoClear) {
              this.clear();
            }
          } else {
            this._batchTextureOutput = this._bufferTextureOutput;
            this._batchTextureConcat = this._bufferTextureConcat;
            this._batchTextureTemp = this._bufferTextureTemp;
          }
          this._updateRenderMode("source-over");
          this._drawContent(this, ignoreCache);
          if (!this._directDraw) {
            if (this.autoClear) {
              this.clear();
            }
            this.batchReason = "finalOutput";
            if (this._renderPerDraw) {
              this._drawCover(null, this._batchTextureOutput);
            }
          }
          this._bufferTextureOutput = this._batchTextureOutput;
          this._bufferTextureConcat = this._batchTextureConcat;
          this._bufferTextureTemp = this._batchTextureTemp;
          this._batchTextureOutput = storeBatchOutput;
          this._batchTextureConcat = storeBatchConcat;
          this._batchTextureTemp = storeBatchTemp;
          if (this._autoPurge !== -1 && !(this._drawID % (this._autoPurge / 2 | 0))) {
            this.purgeTextures(this._autoPurge);
          }
          return true;
        };
        p.cacheDraw = function(target, manager) {
          if (!StageGL.isWebGLActive(this._webGLContext)) {
            return false;
          }
          for (var i = 0; i < this._gpuTextureCount; i++) {
            if (this._batchTextures[i]._frameBuffer) {
              this._batchTextures[i] = this._baseTextures[i];
            }
          }
          var storeBatchOutput = this._batchTextureOutput;
          var storeBatchConcat = this._batchTextureConcat;
          var storeBatchTemp = this._batchTextureTemp;
          var filterCount = manager._filterCount, filtersLeft = filterCount;
          var backupWidth = this._viewportWidth, backupHeight = this._viewportHeight;
          this._updateDrawingSurface(manager._drawWidth, manager._drawHeight);
          this._batchTextureOutput = manager._filterCount % 2 ? manager._bufferTextureConcat : manager._bufferTextureOutput;
          this._batchTextureConcat = manager._filterCount % 2 ? manager._bufferTextureOutput : manager._bufferTextureConcat;
          this._batchTextureTemp = manager._bufferTextureTemp;
          var container = this._cacheContainer;
          container.children = [target];
          container.transformMatrix = this._alignTargetToCache(target, manager);
          this._updateRenderMode("source-over");
          this._drawContent(container, true);
          if (this.isCacheControlled) {
            filterCount++;
            filtersLeft++;
          } else if (manager._cacheCanvas !== (manager._filterCount % 2 ? this._batchTextureConcat : this._batchTextureOutput)) {
            filtersLeft++;
          }
          while (filtersLeft) {
            var filter = manager._getGLFilter(filterCount - filtersLeft--);
            var swap = this._batchTextureConcat;
            this._batchTextureConcat = this._batchTextureOutput;
            this._batchTextureOutput = this.isCacheControlled && filtersLeft === 0 ? this : swap;
            this.batchReason = "filterPass";
            this._drawCover(this._batchTextureOutput._frameBuffer, this._batchTextureConcat, filter);
          }
          manager._bufferTextureOutput = this._batchTextureOutput;
          manager._bufferTextureConcat = this._batchTextureConcat;
          manager._bufferTextureTemp = this._batchTextureTemp;
          this._batchTextureOutput = storeBatchOutput;
          this._batchTextureConcat = storeBatchConcat;
          this._batchTextureTemp = storeBatchTemp;
          this._updateDrawingSurface(backupWidth, backupHeight);
          return true;
        };
        p.releaseTexture = function(item, safe) {
          var i, l;
          if (!item) {
            return;
          }
          if (item.children) {
            for (i = 0, l = item.children.length; i < l; i++) {
              this.releaseTexture(item.children[i], safe);
            }
          }
          if (item.cacheCanvas) {
            item.uncache();
          }
          var foundImage = void 0;
          if (item._storeID !== void 0) {
            if (item === this._textureDictionary[item._storeID]) {
              this._killTextureObject(item);
              item._storeID = void 0;
              return;
            }
            foundImage = item;
          } else if (item._webGLRenderStyle === 2) {
            foundImage = item.image;
          } else if (item._webGLRenderStyle === 1) {
            for (i = 0, l = item.spriteSheet._images.length; i < l; i++) {
              this.releaseTexture(item.spriteSheet._images[i], safe);
            }
            return;
          }
          if (foundImage === void 0) {
            if (this.vocalDebug) {
              console.log("No associated texture found on release");
            }
            return;
          }
          var texture = this._textureDictionary[foundImage._storeID];
          if (safe) {
            var data = texture._imageData;
            var index = data.indexOf(foundImage);
            if (index >= 0) {
              data.splice(index, 1);
            }
            foundImage._storeID = void 0;
            if (data.length === 0) {
              this._killTextureObject(texture);
            }
          } else {
            this._killTextureObject(texture);
          }
        };
        p.purgeTextures = function(count) {
          if (!(count >= 0)) {
            count = 100;
          }
          var dict = this._textureDictionary;
          var l = dict.length;
          for (var i = 0; i < l; i++) {
            var data, texture = dict[i];
            if (!texture || !(data = texture._imageData)) {
              continue;
            }
            for (var j = 0; j < data.length; j++) {
              var item = data[j];
              if (item._drawID + count <= this._drawID) {
                item._storeID = void 0;
                data.splice(j, 1);
                j--;
              }
            }
            if (!data.length) {
              this._killTextureObject(texture);
            }
          }
        };
        p.updateViewport = function(width, height) {
          width = Math.abs(width | 0) || 1;
          height = Math.abs(height | 0) || 1;
          this._updateDrawingSurface(width, height);
          if (this._bufferTextureOutput !== this && this._bufferTextureOutput !== null) {
            this.resizeTexture(this._bufferTextureOutput, this._viewportWidth, this._viewportHeight);
          }
          if (this._bufferTextureConcat !== null) {
            this.resizeTexture(this._bufferTextureConcat, this._viewportWidth, this._viewportHeight);
          }
          if (this._bufferTextureTemp !== null) {
            this.resizeTexture(this._bufferTextureTemp, this._viewportWidth, this._viewportHeight);
          }
        };
        p.getFilterShader = function(filter) {
          if (!filter) {
            filter = this;
          }
          var gl = this._webGLContext;
          var targetShader = this._activeShader;
          if (filter._builtShader) {
            targetShader = filter._builtShader;
            if (filter.shaderParamSetup) {
              gl.useProgram(targetShader);
              filter.shaderParamSetup(gl, this, targetShader);
            }
          } else {
            try {
              targetShader = this._fetchShaderProgram(
                true,
                filter.VTX_SHADER_BODY,
                filter.FRAG_SHADER_BODY,
                filter.shaderParamSetup && filter.shaderParamSetup.bind(filter)
              );
              filter._builtShader = targetShader;
              targetShader._name = filter.toString();
            } catch (e) {
              console && console.log("SHADER SWITCH FAILURE", e);
            }
          }
          return targetShader;
        };
        p.getBaseTexture = function(w, h) {
          var width = Math.ceil(w > 0 ? w : 1) || 1;
          var height = Math.ceil(h > 0 ? h : 1) || 1;
          var gl = this._webGLContext;
          var texture = gl.createTexture();
          this.resizeTexture(texture, width, height);
          this.setTextureParams(gl, false);
          return texture;
        };
        p.resizeTexture = function(texture, width, height) {
          if (texture.width === width && texture.height === height) {
            return;
          }
          var gl = this._webGLContext;
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(
            gl.TEXTURE_2D,
            // target
            0,
            // level of detail
            gl.RGBA,
            // internal format
            width,
            height,
            0,
            // width, height, border (only for array/null sourced textures)
            gl.RGBA,
            // format (match internal format)
            gl.UNSIGNED_BYTE,
            // type of texture(pixel color depth)
            null
            // image data, we can do null because we're doing array data
          );
          texture.width = width;
          texture.height = height;
        };
        p.getRenderBufferTexture = function(w, h) {
          var gl = this._webGLContext;
          var renderTexture = this.getBaseTexture(w, h);
          if (!renderTexture) {
            return null;
          }
          var frameBuffer = gl.createFramebuffer();
          if (!frameBuffer) {
            return null;
          }
          renderTexture.width = w;
          renderTexture.height = h;
          gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, renderTexture, 0);
          frameBuffer._renderTexture = renderTexture;
          renderTexture._frameBuffer = frameBuffer;
          renderTexture._storeID = this._textureDictionary.length;
          this._textureDictionary[renderTexture._storeID] = renderTexture;
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          return renderTexture;
        };
        p.setTextureParams = function(gl, isPOT) {
          if (isPOT && this._antialias) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          }
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        };
        p.setClearColor = function(color) {
          this._clearColor = StageGL.colorToObj(color);
        };
        p.toDataURL = function(backgroundColor, mimeType) {
          var dataURL, gl = this._webGLContext;
          this.batchReason = "dataURL";
          var clearBackup = this._clearColor;
          if (!this.canvas) {
            return;
          }
          if (!StageGL.isWebGLActive(gl)) {
            return this.Stage_toDataURL(backgroundColor, mimeType);
          }
          if (!this._preserveBuffer || backgroundColor !== void 0) {
            if (backgroundColor !== void 0) {
              this._clearColor = StageGL.colorToObj(backgroundColor);
            }
            this.clear();
            if (!this._directDraw) {
              this._drawCover(null, this._bufferTextureOutput);
            } else {
              console.log("No stored/useable gl render info, result may be incorrect if content was changed since render");
              this.draw(gl);
            }
          }
          dataURL = this.canvas.toDataURL(mimeType || "image/png");
          if (!this._preserveBuffer || backgroundColor !== void 0) {
            if (backgroundColor !== void 0) {
              this._clearColor = clearBackup;
            }
            this.clear();
            if (!this._directDraw) {
              this._drawCover(null, this._bufferTextureOutput);
            } else {
              this.draw(gl);
            }
          }
          return dataURL;
        };
        p.toString = function() {
          return "[StageGL (name=" + this.name + ")]";
        };
        p._updateDrawingSurface = function(w, h) {
          this._viewportWidth = w;
          this._viewportHeight = h;
          this._webGLContext.viewport(0, 0, this._viewportWidth, this._viewportHeight);
          this._projectionMatrix = new Float32Array([
            2 / w,
            0,
            0,
            0,
            0,
            -2 / h,
            0,
            0,
            0,
            0,
            1,
            0,
            -1,
            1,
            0,
            1
          ]);
        };
        p._getSafeTexture = function(w, h) {
          var texture = this.getBaseTexture(w, h);
          if (!texture) {
            var msg = "Problem creating texture, possible cause: using too much VRAM, please try releasing texture memory";
            console.error && console.error(msg) || console.log(msg);
            texture = this._baseTextures[0];
          }
          return texture;
        };
        p._clearFrameBuffer = function(alpha) {
          var gl = this._webGLContext;
          var cc = this._clearColor;
          if (alpha > 0) {
            alpha = 1;
          }
          if (alpha < 0) {
            alpha = 0;
          }
          gl.clearColor(cc.r * alpha, cc.g * alpha, cc.b * alpha, alpha);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.clearColor(0, 0, 0, 0);
        };
        p._fetchWebGLContext = function(canvas, options) {
          var gl;
          try {
            gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
          } catch (e) {
          }
          if (!gl) {
            var msg = "Could not initialize WebGL";
            console.error ? console.error(msg) : console.log(msg);
          } else {
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
          }
          return gl;
        };
        p._fetchShaderProgram = function(coverShader, customVTX, customFRAG, shaderParamSetup) {
          var gl = this._webGLContext;
          gl.useProgram(null);
          var targetFrag, targetVtx;
          if (coverShader) {
            targetVtx = StageGL.COVER_VERTEX_HEADER + (customVTX || StageGL.COVER_VERTEX_BODY);
            targetFrag = StageGL.COVER_FRAGMENT_HEADER + (customFRAG || StageGL.COVER_FRAGMENT_BODY);
          } else {
            targetVtx = StageGL.REGULAR_VERTEX_HEADER + (customVTX || StageGL.REGULAR_VERTEX_BODY);
            targetFrag = StageGL.REGULAR_FRAGMENT_HEADER + (customFRAG || StageGL.REGULAR_FRAGMENT_BODY);
          }
          var vertexShader = this._createShader(gl, gl.VERTEX_SHADER, targetVtx);
          var fragmentShader = this._createShader(gl, gl.FRAGMENT_SHADER, targetFrag);
          var shaderProgram = gl.createProgram();
          gl.attachShader(shaderProgram, vertexShader);
          gl.attachShader(shaderProgram, fragmentShader);
          gl.linkProgram(shaderProgram);
          if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            gl.useProgram(this._activeShader);
            throw gl.getProgramInfoLog(shaderProgram);
          }
          gl.useProgram(shaderProgram);
          shaderProgram.positionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
          gl.enableVertexAttribArray(shaderProgram.positionAttribute);
          shaderProgram.uvPositionAttribute = gl.getAttribLocation(shaderProgram, "uvPosition");
          gl.enableVertexAttribArray(shaderProgram.uvPositionAttribute);
          if (coverShader) {
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
            gl.uniform1i(shaderProgram.samplerUniform, 0);
            if (shaderParamSetup) {
              shaderParamSetup(gl, this, shaderProgram);
            }
          } else {
            shaderProgram.textureIndexAttribute = gl.getAttribLocation(shaderProgram, "textureIndex");
            gl.enableVertexAttribArray(shaderProgram.textureIndexAttribute);
            shaderProgram.alphaAttribute = gl.getAttribLocation(shaderProgram, "objectAlpha");
            gl.enableVertexAttribArray(shaderProgram.alphaAttribute);
            var samplers = [];
            for (var i = 0; i < this._gpuTextureCount; i++) {
              samplers[i] = i;
            }
            shaderProgram.samplerData = samplers;
            shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
            gl.uniform1iv(shaderProgram.samplerUniform, shaderProgram.samplerData);
            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "pMatrix");
          }
          shaderProgram._type = coverShader ? "cover" : "batch";
          gl.useProgram(this._activeShader);
          return shaderProgram;
        };
        p._createShader = function(gl, type, str) {
          var textureCount = this._batchTextureCount;
          str = str.replace(/\{\{count}}/g, textureCount);
          if (type === gl.FRAGMENT_SHADER) {
            var insert = "";
            for (var i = 1; i < textureCount; i++) {
              insert += "} else if (indexPicker <= " + i + ".5) { color = texture2D(uSampler[" + i + "], vTextureCoord);";
            }
            str = str.replace(/\{\{alternates}}/g, insert);
          }
          var shader = gl.createShader(type);
          gl.shaderSource(shader, str);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw gl.getShaderInfoLog(shader);
          }
          return shader;
        };
        p._createBuffers = function() {
          var gl = this._webGLContext;
          var groupCount = this._maxBatchVertexCount;
          var groupSize, i, l, config, atrBuffer;
          config = this._attributeConfig["default"] = {};
          groupSize = 2;
          var vertices = new Float32Array(groupCount * groupSize);
          for (i = 0, l = vertices.length; i < l; i += groupSize) {
            vertices[i] = vertices[i + 1] = 0;
          }
          atrBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
          config["position"] = {
            array: vertices,
            buffer: atrBuffer,
            type: gl.FLOAT,
            spacing: groupSize,
            stride: 0,
            offset: 0,
            offB: 0,
            size: groupSize
          };
          groupSize = 2;
          var uvs = new Float32Array(groupCount * groupSize);
          for (i = 0, l = uvs.length; i < l; i += groupSize) {
            uvs[i] = uvs[i + 1] = 0;
          }
          atrBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.DYNAMIC_DRAW);
          config["uv"] = {
            array: uvs,
            buffer: atrBuffer,
            type: gl.FLOAT,
            spacing: groupSize,
            stride: 0,
            offset: 0,
            offB: 0,
            size: groupSize
          };
          groupSize = 1;
          var indices = new Float32Array(groupCount * groupSize);
          for (i = 0, l = indices.length; i < l; i++) {
            indices[i] = 0;
          }
          atrBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);
          config["texture"] = {
            array: indices,
            buffer: atrBuffer,
            type: gl.FLOAT,
            spacing: groupSize,
            stride: 0,
            offset: 0,
            offB: 0,
            size: groupSize
          };
          groupSize = 1;
          var alphas = new Float32Array(groupCount * groupSize);
          for (i = 0, l = alphas.length; i < l; i++) {
            alphas[i] = 1;
          }
          atrBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW);
          config["alpha"] = {
            array: alphas,
            buffer: atrBuffer,
            type: gl.FLOAT,
            spacing: groupSize,
            stride: 0,
            offset: 0,
            offB: 0,
            size: groupSize
          };
          config = this._attributeConfig["micro"] = {};
          groupCount = 5;
          groupSize = 2 + 2 + 1 + 1;
          var stride = groupSize * 4;
          var microArray = new Float32Array(groupCount * groupSize);
          for (i = 0, l = microArray.length; i < l; i += groupSize) {
            microArray[i] = microArray[i + 1] = 0;
            microArray[i + 1] = microArray[i + 2] = 0;
            microArray[i + 3] = 0;
            microArray[i + 4] = 1;
          }
          atrBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, atrBuffer);
          gl.bufferData(gl.ARRAY_BUFFER, microArray, gl.DYNAMIC_DRAW);
          config["position"] = {
            array: microArray,
            buffer: atrBuffer,
            type: gl.FLOAT,
            spacing: groupSize,
            stride,
            offset: 0,
            offB: 0,
            size: 2
          };
          config["uv"] = {
            array: microArray,
            buffer: atrBuffer,
            type: gl.FLOAT,
            spacing: groupSize,
            stride,
            offset: 2,
            offB: 2 * 4,
            size: 2
          };
          config["texture"] = {
            array: microArray,
            buffer: atrBuffer,
            type: gl.FLOAT,
            spacing: groupSize,
            stride,
            offset: 4,
            offB: 4 * 4,
            size: 1
          };
          config["alpha"] = {
            array: microArray,
            buffer: atrBuffer,
            type: gl.FLOAT,
            spacing: groupSize,
            stride,
            offset: 5,
            offB: 5 * 4,
            size: 1
          };
          this._activeConfig = this._attributeConfig["default"];
        };
        p._initMaterials = function() {
          var gl = this._webGLContext;
          this._lastTextureInsert = -1;
          this._textureDictionary = [];
          this._textureIDs = {};
          this._baseTextures = [];
          this._batchTextures = [];
          this._gpuTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
          this._gpuTextureMax = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
          this._batchTextureCount = this._gpuTextureCount;
          var success = false;
          while (!success) {
            try {
              this._activeShader = this._fetchShaderProgram(false);
              success = true;
            } catch (e) {
              if (this._batchTextureCount <= 1) {
                throw "Cannot compile shader " + e;
              }
              this._batchTextureCount = this._batchTextureCount / 2 | 0;
              if (this.vocalDebug) {
                console.log("Reducing possible texture count due to errors: " + this._batchTextureCount);
              }
            }
          }
          this._mainShader = this._activeShader;
          this._mainShader._name = "main";
          var texture = this.getBaseTexture();
          if (!texture) {
            throw "Problems creating basic textures, known causes include using too much VRAM by not releasing WebGL texture instances";
          } else {
            texture._storeID = -1;
          }
          for (var i = 0; i < this._batchTextureCount; i++) {
            this._baseTextures[i] = this._batchTextures[i] = texture;
          }
        };
        p._loadTextureImage = function(gl, image) {
          var srcPath, texture, msg;
          if ((image instanceof Image || image instanceof HTMLImageElement) && image.src) {
            srcPath = image.src;
          } else if (image instanceof HTMLCanvasElement) {
            image._isCanvas = true;
            srcPath = "canvas_" + ++this._lastTrackedCanvas;
          } else {
            msg = "Invalid image provided as source. Please ensure source is a correct DOM element.";
            console.error && console.error(msg, image) || console.log(msg, image);
            return;
          }
          var storeID = this._textureIDs[srcPath];
          if (storeID === void 0) {
            this._textureIDs[srcPath] = storeID = this._textureDictionary.length;
            image._storeID = storeID;
            image._invalid = true;
            texture = this._getSafeTexture();
            this._textureDictionary[storeID] = texture;
          } else {
            image._storeID = storeID;
            texture = this._textureDictionary[storeID];
          }
          if (texture._storeID !== -1) {
            texture._storeID = storeID;
            if (texture._imageData) {
              texture._imageData.push(image);
            } else {
              texture._imageData = [image];
            }
          }
          this._insertTextureInBatch(gl, texture);
          return texture;
        };
        p._updateTextureImageData = function(gl, image) {
          if (!(image.complete || image._isCanvas || image.naturalWidth)) {
            return;
          }
          var isNPOT = image.width & image.width - 1 || image.height & image.height - 1;
          var texture = this._textureDictionary[image._storeID];
          gl.activeTexture(gl.TEXTURE0 + texture._activeIndex);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          texture.isPOT = !isNPOT;
          this.setTextureParams(gl, texture.isPOT);
          try {
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          } catch (e) {
            var errString = "\nAn error has occurred. This is most likely due to security restrictions on WebGL images with local or cross-domain origins";
            if (console.error) {
              console.error(errString);
              console.error(e);
            } else if (console) {
              console.log(errString);
              console.log(e);
            }
          }
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          if (image._invalid !== void 0) {
            image._invalid = false;
          }
          texture.width = image.width;
          texture.height = image.height;
          if (this.vocalDebug) {
            if (isNPOT && this._antialias) {
              console.warn("NPOT(Non Power of Two) Texture with context.antialias true: " + image.src);
            }
            if (image.width > gl.MAX_TEXTURE_SIZE || image.height > gl.MAX_TEXTURE_SIZE) {
              console && console.error("Oversized Texture: " + image.width + "x" + image.height + " vs " + gl.MAX_TEXTURE_SIZE + "max");
            }
          }
        };
        p._insertTextureInBatch = function(gl, texture) {
          var image;
          if (this._batchTextures[texture._activeIndex] !== texture) {
            var found = -1;
            var start = (this._lastTextureInsert + 1) % this._batchTextureCount;
            var look = start;
            do {
              if (this._batchTextures[look]._batchID !== this._batchID && !this._slotBlacklist[look]) {
                found = look;
                break;
              }
              look = (look + 1) % this._batchTextureCount;
            } while (look !== start);
            if (found === -1) {
              this.batchReason = "textureOverflow";
              this._renderBatch();
              found = start;
            }
            this._batchTextures[found] = texture;
            texture._activeIndex = found;
            image = texture._imageData && texture._imageData[0];
            if (image && (image._invalid === void 0 && image._isCanvas || image._invalid)) {
              this._updateTextureImageData(gl, image);
            } else {
            }
            this._lastTextureInsert = found;
          } else if (texture._drawID !== this._drawID) {
            image = texture._imageData && texture._imageData[0];
            if (image && (image._invalid === void 0 && image._isCanvas || image._invalid)) {
              this._updateTextureImageData(gl, image);
            }
          }
          texture._drawID = this._drawID;
          texture._batchID = this._batchID;
        };
        p._killTextureObject = function(texture) {
          if (!texture) {
            return;
          }
          var gl = this._webGLContext;
          if (texture._storeID !== void 0 && texture._storeID >= 0) {
            this._textureDictionary[texture._storeID] = void 0;
            for (var n in this._textureIDs) {
              if (this._textureIDs[n] === texture._storeID) {
                delete this._textureIDs[n];
              }
            }
            var data = texture._imageData;
            if (data) {
              for (var i = data.length - 1; i >= 0; i--) {
                data[i]._storeID = void 0;
              }
            }
            texture._imageData = texture._storeID = void 0;
          }
          if (texture._activeIndex !== void 0 && this._batchTextures[texture._activeIndex] === texture) {
            this._batchTextures[texture._activeIndex] = this._baseTextures[texture._activeIndex];
          }
          try {
            if (texture._frameBuffer) {
              gl.deleteFramebuffer(texture._frameBuffer);
            }
            texture._frameBuffer = void 0;
          } catch (e) {
            if (this.vocalDebug) {
              console.log(e);
            }
          }
          try {
            gl.deleteTexture(texture);
          } catch (e) {
            if (this.vocalDebug) {
              console.log(e);
            }
          }
        };
        p._setCoverMixShaderParams = function(gl, stage2, shaderProgram) {
          gl.uniform1i(
            gl.getUniformLocation(shaderProgram, "uMixSampler"),
            1
          );
        };
        p._updateRenderMode = function(newMode) {
          if (newMode === null || newMode === void 0) {
            newMode = "source-over";
          }
          var blendSrc = StageGL.BLEND_SOURCES[newMode];
          if (blendSrc === void 0) {
            if (this.vocalDebug) {
              console.log("Unknown compositeOperation [" + newMode + "], reverting to default");
            }
            blendSrc = StageGL.BLEND_SOURCES[newMode = "source-over"];
          }
          if (this._renderMode === newMode) {
            return;
          }
          var gl = this._webGLContext;
          var shaderData = this._builtShaders[newMode];
          if (shaderData === void 0) {
            try {
              shaderData = this._builtShaders[newMode] = {
                eqRGB: gl[blendSrc.eqRGB || "FUNC_ADD"],
                srcRGB: gl[blendSrc.srcRGB || "ONE"],
                dstRGB: gl[blendSrc.dstRGB || "ONE_MINUS_SRC_ALPHA"],
                eqA: gl[blendSrc.eqA || "FUNC_ADD"],
                srcA: gl[blendSrc.srcA || "ONE"],
                dstA: gl[blendSrc.dstA || "ONE_MINUS_SRC_ALPHA"],
                immediate: blendSrc.shader !== void 0,
                shader: blendSrc.shader || this._builtShaders["source-over"] === void 0 ? this._fetchShaderProgram(
                  true,
                  void 0,
                  blendSrc.shader,
                  this._setCoverMixShaderParams
                ) : this._builtShaders["source-over"].shader
                // re-use source-over when we don't need a new shader
              };
              if (blendSrc.shader) {
                shaderData.shader._name = newMode;
              }
            } catch (e) {
              this._builtShaders[newMode] = void 0;
              console && console.log("SHADER SWITCH FAILURE", e);
              return;
            }
          }
          if (shaderData.immediate) {
            if (this._directDraw) {
              if (this.vocalDebug) {
                console.log("Illegal compositeOperation [" + newMode + "] due to StageGL.directDraw = true, reverting to default");
              }
              return;
            }
            this._activeConfig = this._attributeConfig["micro"];
          }
          gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);
          this.batchReason = "shaderSwap";
          this._renderBatch();
          this._renderMode = newMode;
          this._immediateRender = shaderData.immediate;
          gl.blendEquationSeparate(shaderData.eqRGB, shaderData.eqA);
          gl.blendFuncSeparate(shaderData.srcRGB, shaderData.dstRGB, shaderData.srcA, shaderData.dstA);
        };
        p._drawContent = function(content, ignoreCache) {
          var gl = this._webGLContext;
          this._activeShader = this._mainShader;
          gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);
          if (this._batchTextureOutput._frameBuffer !== null) {
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          this._appendToBatch(content, new createjs.Matrix2D(), this.alpha, ignoreCache);
          this.batchReason = "contentEnd";
          this._renderBatch();
        };
        p._drawCover = function(out, dst, srcFilter) {
          var gl = this._webGLContext;
          gl.bindFramebuffer(gl.FRAMEBUFFER, out);
          if (out !== null) {
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, dst);
          this.setTextureParams(gl);
          if (srcFilter instanceof createjs.Filter) {
            this._activeShader = this.getFilterShader(srcFilter);
          } else {
            if (srcFilter instanceof WebGLTexture) {
              gl.activeTexture(gl.TEXTURE1);
              gl.bindTexture(gl.TEXTURE_2D, srcFilter);
              this.setTextureParams(gl);
            } else if (srcFilter !== void 0 && this.vocalDebug) {
              console.log("Unknown data handed to function: ", srcFilter);
            }
            this._activeShader = this._builtShaders[this._renderMode].shader;
          }
          this._renderCover();
        };
        p._alignTargetToCache = function(target, manager) {
          if (manager._counterMatrix === null) {
            manager._counterMatrix = target.getMatrix();
          } else {
            target.getMatrix(manager._counterMatrix);
          }
          var mtx = manager._counterMatrix;
          mtx.scale(1 / manager.scale, 1 / manager.scale);
          mtx = mtx.invert();
          mtx.translate(-manager.offX / manager.scale * target.scaleX, -manager.offY / manager.scale * target.scaleY);
          return mtx;
        };
        p._appendToBatch = function(container, concatMtx, concatAlpha, ignoreCache) {
          var gl = this._webGLContext;
          var cMtx = container._glMtx;
          cMtx.copy(concatMtx);
          if (container.transformMatrix !== null) {
            cMtx.appendMatrix(container.transformMatrix);
          } else {
            cMtx.appendTransform(
              container.x,
              container.y,
              container.scaleX,
              container.scaleY,
              container.rotation,
              container.skewX,
              container.skewY,
              container.regX,
              container.regY
            );
          }
          var previousRenderMode = this._renderMode;
          if (container.compositeOperation) {
            this._updateRenderMode(container.compositeOperation);
          }
          var subL, subT, subR, subB;
          var l = container.children.length;
          for (var i = 0; i < l; i++) {
            var item = container.children[i];
            var useCache = !ignoreCache && item.cacheCanvas || false;
            if (!(item.visible && concatAlpha > 35e-4)) {
              continue;
            }
            var itemAlpha = item.alpha;
            if (useCache === false) {
              if (item._updateState) {
                item._updateState();
              }
              if (!this._directDraw && (!ignoreCache && item.cacheCanvas === null && item.filters !== null && item.filters.length)) {
                var bounds;
                if (item.bitmapCache === null) {
                  bounds = item.getBounds();
                  item.bitmapCache = new createjs.BitmapCache();
                  item.bitmapCache._autoGenerated = true;
                }
                if (item.bitmapCache._autoGenerated) {
                  this.batchReason = "cachelessFilterInterupt";
                  this._renderBatch();
                  item.alpha = 1;
                  var shaderBackup = this._activeShader;
                  bounds = bounds || item.getBounds();
                  item.bitmapCache.define(item, bounds.x, bounds.y, bounds.width, bounds.height, 1, { useGL: this });
                  useCache = item.bitmapCache._cacheCanvas;
                  item.alpha = itemAlpha;
                  this._activeShader = shaderBackup;
                  gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);
                }
              }
            }
            if (useCache === false && item.children) {
              this._appendToBatch(item, cMtx, itemAlpha * concatAlpha);
              continue;
            }
            var containerRenderMode = this._renderMode;
            if (item.compositeOperation) {
              this._updateRenderMode(item.compositeOperation);
            }
            if (this._batchVertexCount + StageGL.INDICIES_PER_CARD > this._maxBatchVertexCount) {
              this.batchReason = "vertexOverflow";
              this._renderBatch();
            }
            var iMtx = item._glMtx;
            iMtx.copy(cMtx);
            if (item.transformMatrix) {
              iMtx.appendMatrix(item.transformMatrix);
            } else {
              iMtx.appendTransform(
                item.x,
                item.y,
                item.scaleX,
                item.scaleY,
                item.rotation,
                item.skewX,
                item.skewY,
                item.regX,
                item.regY
              );
            }
            var uvRect, texIndex, image, frame, texture, src;
            if (item._webGLRenderStyle === 2 || useCache !== false) {
              image = useCache === false ? item.image : useCache;
            } else if (item._webGLRenderStyle === 1) {
              frame = item.spriteSheet.getFrame(item.currentFrame);
              if (frame === null) {
                continue;
              }
              image = frame.image;
            } else {
              continue;
            }
            if (!image) {
              continue;
            }
            if (image._storeID === void 0) {
              texture = this._loadTextureImage(gl, image);
            } else {
              texture = this._textureDictionary[image._storeID];
              if (!texture) {
                if (this.vocalDebug) {
                  console.log("Image source should not be lookup a non existent texture, please report a bug.");
                }
                continue;
              }
              if (texture._batchID !== this._batchID) {
                this._insertTextureInBatch(gl, texture);
              }
            }
            texIndex = texture._activeIndex;
            image._drawID = this._drawID;
            if (item._webGLRenderStyle === 2 || useCache !== false) {
              if (useCache === false && item.sourceRect) {
                if (!item._uvRect) {
                  item._uvRect = {};
                }
                src = item.sourceRect;
                uvRect = item._uvRect;
                uvRect.t = 1 - src.y / image.height;
                uvRect.l = src.x / image.width;
                uvRect.b = 1 - (src.y + src.height) / image.height;
                uvRect.r = (src.x + src.width) / image.width;
                subL = 0;
                subT = 0;
                subR = src.width + subL;
                subB = src.height + subT;
              } else {
                uvRect = StageGL.UV_RECT;
                if (useCache === false) {
                  subL = 0;
                  subT = 0;
                  subR = image.width + subL;
                  subB = image.height + subT;
                } else {
                  src = item.bitmapCache;
                  subL = src.x + src._filterOffX / src.scale;
                  subT = src.y + src._filterOffY / src.scale;
                  subR = src._drawWidth / src.scale + subL;
                  subB = src._drawHeight / src.scale + subT;
                }
              }
            } else if (item._webGLRenderStyle === 1) {
              var rect = frame.rect;
              uvRect = frame.uvRect;
              if (!uvRect) {
                uvRect = StageGL.buildUVRects(item.spriteSheet, item.currentFrame, false);
              }
              subL = -frame.regX;
              subT = -frame.regY;
              subR = rect.width - frame.regX;
              subB = rect.height - frame.regY;
            }
            var spacing = 0;
            var cfg = this._activeConfig;
            var vpos = cfg.position.array;
            var uvs = cfg.uv.array;
            var texI = cfg.texture.array;
            var alphas = cfg.alpha.array;
            spacing = cfg.position.spacing;
            var vtxOff = this._batchVertexCount * spacing + cfg.position.offset;
            vpos[vtxOff] = subL * iMtx.a + subT * iMtx.c + iMtx.tx;
            vpos[vtxOff + 1] = subL * iMtx.b + subT * iMtx.d + iMtx.ty;
            vtxOff += spacing;
            vpos[vtxOff] = subL * iMtx.a + subB * iMtx.c + iMtx.tx;
            vpos[vtxOff + 1] = subL * iMtx.b + subB * iMtx.d + iMtx.ty;
            vtxOff += spacing;
            vpos[vtxOff] = subR * iMtx.a + subT * iMtx.c + iMtx.tx;
            vpos[vtxOff + 1] = subR * iMtx.b + subT * iMtx.d + iMtx.ty;
            vtxOff += spacing;
            vpos[vtxOff] = subL * iMtx.a + subB * iMtx.c + iMtx.tx;
            vpos[vtxOff + 1] = subL * iMtx.b + subB * iMtx.d + iMtx.ty;
            vtxOff += spacing;
            vpos[vtxOff] = subR * iMtx.a + subT * iMtx.c + iMtx.tx;
            vpos[vtxOff + 1] = subR * iMtx.b + subT * iMtx.d + iMtx.ty;
            vtxOff += spacing;
            vpos[vtxOff] = subR * iMtx.a + subB * iMtx.c + iMtx.tx;
            vpos[vtxOff + 1] = subR * iMtx.b + subB * iMtx.d + iMtx.ty;
            spacing = cfg.uv.spacing;
            var uvOff = this._batchVertexCount * spacing + cfg.uv.offset;
            uvs[uvOff] = uvRect.l;
            uvs[uvOff + 1] = uvRect.t;
            uvOff += spacing;
            uvs[uvOff] = uvRect.l;
            uvs[uvOff + 1] = uvRect.b;
            uvOff += spacing;
            uvs[uvOff] = uvRect.r;
            uvs[uvOff + 1] = uvRect.t;
            uvOff += spacing;
            uvs[uvOff] = uvRect.l;
            uvs[uvOff + 1] = uvRect.b;
            uvOff += spacing;
            uvs[uvOff] = uvRect.r;
            uvs[uvOff + 1] = uvRect.t;
            uvOff += spacing;
            uvs[uvOff] = uvRect.r;
            uvs[uvOff + 1] = uvRect.b;
            spacing = cfg.texture.spacing;
            var texOff = this._batchVertexCount * spacing + cfg.texture.offset;
            texI[texOff] = texIndex;
            texOff += spacing;
            texI[texOff] = texIndex;
            texOff += spacing;
            texI[texOff] = texIndex;
            texOff += spacing;
            texI[texOff] = texIndex;
            texOff += spacing;
            texI[texOff] = texIndex;
            texOff += spacing;
            texI[texOff] = texIndex;
            spacing = cfg.alpha.spacing;
            var aOff = this._batchVertexCount * spacing + cfg.alpha.offset;
            alphas[aOff] = itemAlpha * concatAlpha;
            aOff += spacing;
            alphas[aOff] = itemAlpha * concatAlpha;
            aOff += spacing;
            alphas[aOff] = itemAlpha * concatAlpha;
            aOff += spacing;
            alphas[aOff] = itemAlpha * concatAlpha;
            aOff += spacing;
            alphas[aOff] = itemAlpha * concatAlpha;
            aOff += spacing;
            alphas[aOff] = itemAlpha * concatAlpha;
            this._batchVertexCount += StageGL.INDICIES_PER_CARD;
            if (this._immediateRender) {
              this._activeConfig = this._attributeConfig["default"];
              this._immediateBatchRender();
            }
            if (this._renderMode !== containerRenderMode) {
              this._updateRenderMode(containerRenderMode);
            }
          }
          if (this._renderMode !== previousRenderMode) {
            this._updateRenderMode(previousRenderMode);
          }
        };
        p._immediateBatchRender = function() {
          var gl = this._webGLContext;
          if (this._batchTextureConcat === null) {
            this._batchTextureConcat = this.getRenderBufferTexture(this._viewportWidth, this._viewportHeight);
          } else {
            this.resizeTexture(this._batchTextureConcat, this._viewportWidth, this._viewportHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureConcat._frameBuffer);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          if (this._batchTextureTemp === null) {
            this._batchTextureTemp = this.getRenderBufferTexture(this._viewportWidth, this._viewportHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureTemp._frameBuffer);
          } else {
            this.resizeTexture(this._batchTextureTemp, this._viewportWidth, this._viewportHeight);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureTemp._frameBuffer);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          var swap = this._batchTextureOutput;
          this._batchTextureOutput = this._batchTextureConcat;
          this._batchTextureConcat = swap;
          this._activeShader = this._mainShader;
          this.batchReason = "immediatePrep";
          this._renderBatch();
          this.batchReason = "immediateResults";
          this._drawCover(this._batchTextureOutput._frameBuffer, this._batchTextureConcat, this._batchTextureTemp);
          gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);
        };
        p._renderBatch = function() {
          if (this._batchVertexCount <= 0) {
            return;
          }
          var gl = this._webGLContext;
          this._renderPerDraw++;
          if (this.vocalDebug) {
            console.log("Batch[" + this._drawID + ":" + this._batchID + "] : " + this.batchReason);
          }
          var shaderProgram = this._activeShader;
          var pc, config = this._activeConfig;
          gl.useProgram(shaderProgram);
          pc = config.position;
          gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
          gl.vertexAttribPointer(shaderProgram.positionAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, pc.array);
          pc = config.texture;
          gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
          gl.vertexAttribPointer(shaderProgram.textureIndexAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, pc.array);
          pc = config.uv;
          gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
          gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, pc.array);
          pc = config.alpha;
          gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
          gl.vertexAttribPointer(shaderProgram.alphaAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, pc.array);
          gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, gl.FALSE, this._projectionMatrix);
          for (var i = 0; i < this._batchTextureCount; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D, this._batchTextures[i]);
          }
          gl.drawArrays(gl.TRIANGLES, 0, this._batchVertexCount);
          this._batchVertexCount = 0;
          this._batchID++;
        };
        p._renderCover = function() {
          var gl = this._webGLContext;
          this._renderPerDraw++;
          if (this.vocalDebug) {
            console.log("Cover[" + this._drawID + ":" + this._batchID + "] : " + this.batchReason);
          }
          var shaderProgram = this._activeShader;
          var pc, config = this._attributeConfig.default;
          gl.useProgram(shaderProgram);
          pc = config.position;
          gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
          gl.vertexAttribPointer(shaderProgram.positionAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, StageGL.COVER_VERT);
          pc = config.uv;
          gl.bindBuffer(gl.ARRAY_BUFFER, pc.buffer);
          gl.vertexAttribPointer(shaderProgram.uvPositionAttribute, pc.size, pc.type, false, pc.stride, pc.offB);
          gl.bufferSubData(gl.ARRAY_BUFFER, 0, StageGL.COVER_UV);
          gl.uniform1i(shaderProgram.samplerUniform, 0);
          gl.drawArrays(gl.TRIANGLES, 0, StageGL.INDICIES_PER_CARD);
          this._batchID++;
        };
        createjs.StageGL = createjs.promote(StageGL, "Stage");
      })();
    }
  });

  // ../src/easeljs/display/Text.js
  var require_Text = __commonJS({
    "../src/easeljs/display/Text.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Text(text, font, color) {
          this.DisplayObject_constructor();
          this.text = text;
          this.font = font;
          this.color = color;
          this.textAlign = "left";
          this.textBaseline = "top";
          this.maxWidth = null;
          this.outline = 0;
          this.lineHeight = 0;
          this.lineWidth = null;
        }
        var p = createjs.extend(Text, createjs.DisplayObject);
        var canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        if (canvas.getContext) {
          Text._workingContext = canvas.getContext("2d");
          canvas.width = canvas.height = 1;
        }
        Text.H_OFFSETS = { start: 0, left: 0, center: -0.5, end: -1, right: -1 };
        Text.V_OFFSETS = { top: 0, hanging: -0.01, middle: -0.4, alphabetic: -0.8, ideographic: -0.85, bottom: -1 };
        p.isVisible = function() {
          var hasContent = this.cacheCanvas || this.text != null && this.text !== "";
          return !!(this.visible && this.alpha > 0 && this.scaleX != 0 && this.scaleY != 0 && hasContent);
        };
        p.draw = function(ctx, ignoreCache) {
          if (this.DisplayObject_draw(ctx, ignoreCache)) {
            return true;
          }
          var col = this.color || "#000";
          if (this.outline) {
            ctx.strokeStyle = col;
            ctx.lineWidth = this.outline * 1;
          } else {
            ctx.fillStyle = col;
          }
          this._drawText(this._prepContext(ctx));
          return true;
        };
        p.getMeasuredWidth = function() {
          return this._getMeasuredWidth(this.text);
        };
        p.getMeasuredLineHeight = function() {
          return this._getMeasuredWidth("M") * 1.2;
        };
        p.getMeasuredHeight = function() {
          return this._drawText(null, {}).height;
        };
        p.getBounds = function() {
          var rect = this.DisplayObject_getBounds();
          if (rect) {
            return rect;
          }
          if (this.text == null || this.text === "") {
            return null;
          }
          var o = this._drawText(null, {});
          var w = this.maxWidth && this.maxWidth < o.width ? this.maxWidth : o.width;
          var x = w * Text.H_OFFSETS[this.textAlign || "left"];
          var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
          var y = lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
          return this._rectangle.setValues(x, y, w, o.height);
        };
        p.getMetrics = function() {
          var o = { lines: [] };
          o.lineHeight = this.lineHeight || this.getMeasuredLineHeight();
          o.vOffset = o.lineHeight * Text.V_OFFSETS[this.textBaseline || "top"];
          return this._drawText(null, o, o.lines);
        };
        p.clone = function() {
          return this._cloneProps(new Text(this.text, this.font, this.color));
        };
        p.toString = function() {
          return "[Text (text=" + (this.text.length > 20 ? this.text.substr(0, 17) + "..." : this.text) + ")]";
        };
        p._cloneProps = function(o) {
          this.DisplayObject__cloneProps(o);
          o.textAlign = this.textAlign;
          o.textBaseline = this.textBaseline;
          o.maxWidth = this.maxWidth;
          o.outline = this.outline;
          o.lineHeight = this.lineHeight;
          o.lineWidth = this.lineWidth;
          return o;
        };
        p._prepContext = function(ctx) {
          ctx.font = this.font || "10px sans-serif";
          ctx.textAlign = this.textAlign || "left";
          ctx.textBaseline = this.textBaseline || "top";
          ctx.lineJoin = "miter";
          ctx.miterLimit = 2.5;
          return ctx;
        };
        p._drawText = function(ctx, o, lines) {
          var paint = !!ctx;
          if (!paint) {
            ctx = Text._workingContext;
            ctx.save();
            this._prepContext(ctx);
          }
          var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
          var maxW = 0, count = 0;
          var hardLines = String(this.text).split(/(?:\r\n|\r|\n)/);
          for (var i = 0, l = hardLines.length; i < l; i++) {
            var str = hardLines[i];
            var w = null;
            if (this.lineWidth != null && (w = ctx.measureText(str).width) > this.lineWidth) {
              var words = str.split(/(\s)/);
              str = words[0];
              w = ctx.measureText(str).width;
              for (var j = 1, jl = words.length; j < jl; j += 2) {
                var wordW = ctx.measureText(words[j] + words[j + 1]).width;
                if (w + wordW > this.lineWidth) {
                  if (paint) {
                    this._drawTextLine(ctx, str, count * lineHeight);
                  }
                  if (lines) {
                    lines.push(str);
                  }
                  if (w > maxW) {
                    maxW = w;
                  }
                  str = words[j + 1];
                  w = ctx.measureText(str).width;
                  count++;
                } else {
                  str += words[j] + words[j + 1];
                  w += wordW;
                }
              }
            }
            if (paint) {
              this._drawTextLine(ctx, str, count * lineHeight);
            }
            if (lines) {
              lines.push(str);
            }
            if (o && w == null) {
              w = ctx.measureText(str).width;
            }
            if (w > maxW) {
              maxW = w;
            }
            count++;
          }
          if (o) {
            o.width = maxW;
            o.height = count * lineHeight;
          }
          if (!paint) {
            ctx.restore();
          }
          return o;
        };
        p._drawTextLine = function(ctx, text, y) {
          if (this.outline) {
            ctx.strokeText(text, 0, y, this.maxWidth || 65535);
          } else {
            ctx.fillText(text, 0, y, this.maxWidth || 65535);
          }
        };
        p._getMeasuredWidth = function(text) {
          var ctx = Text._workingContext;
          ctx.save();
          var w = this._prepContext(ctx).measureText(text).width;
          ctx.restore();
          return w;
        };
        createjs.Text = createjs.promote(Text, "DisplayObject");
      })();
    }
  });

  // ../src/easeljs/events/MouseEvent.js
  var require_MouseEvent = __commonJS({
    "../src/easeljs/events/MouseEvent.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function MouseEvent(type, bubbles, cancelable, stageX, stageY, nativeEvent, pointerID, primary, rawX, rawY, relatedTarget) {
          this.Event_constructor(type, bubbles, cancelable);
          this.stageX = stageX;
          this.stageY = stageY;
          this.rawX = rawX == null ? stageX : rawX;
          this.rawY = rawY == null ? stageY : rawY;
          this.nativeEvent = nativeEvent;
          this.pointerID = pointerID;
          this.primary = !!primary;
          this.relatedTarget = relatedTarget;
        }
        var p = createjs.extend(MouseEvent, createjs.Event);
        p._get_localX = function() {
          return this.currentTarget.globalToLocal(this.rawX, this.rawY).x;
        };
        p._get_localY = function() {
          return this.currentTarget.globalToLocal(this.rawX, this.rawY).y;
        };
        p._get_isTouch = function() {
          return this.pointerID !== -1;
        };
        try {
          Object.defineProperties(p, {
            localX: { get: p._get_localX },
            localY: { get: p._get_localY },
            isTouch: { get: p._get_isTouch }
          });
        } catch (e) {
        }
        p.clone = function() {
          return new MouseEvent(this.type, this.bubbles, this.cancelable, this.stageX, this.stageY, this.nativeEvent, this.pointerID, this.primary, this.rawX, this.rawY);
        };
        p.toString = function() {
          return "[MouseEvent (type=" + this.type + " stageX=" + this.stageX + " stageY=" + this.stageY + ")]";
        };
        createjs.MouseEvent = createjs.promote(MouseEvent, "Event");
      })();
    }
  });

  // ../src/easeljs/filters/AlphaMapFilter.js
  var require_AlphaMapFilter = __commonJS({
    "../src/easeljs/filters/AlphaMapFilter.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function AlphaMapFilter(alphaMap) {
          this.Filter_constructor();
          if (!createjs.Filter.isValidImageSource(alphaMap)) {
            throw "Must provide valid image source for alpha map, see Filter.isValidImageSource";
          }
          this.alphaMap = alphaMap;
          this._map = null;
          this._mapCtx = null;
          this._mapTexture = null;
          this.FRAG_SHADER_BODY = "uniform sampler2D uAlphaSampler;void main(void) {vec4 color = texture2D(uSampler, vTextureCoord);vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);float newAlpha = alphaMap.r * ceil(alphaMap.a);gl_FragColor = vec4(clamp(color.rgb/color.a, 0.0, 1.0) * newAlpha, newAlpha);}";
          if (alphaMap instanceof WebGLTexture) {
            this._mapTexture = alphaMap;
          }
        }
        var p = createjs.extend(AlphaMapFilter, createjs.Filter);
        p.shaderParamSetup = function(gl, stage2, shaderProgram) {
          if (this._mapTexture === null) {
            this._mapTexture = gl.createTexture();
          }
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
          stage2.setTextureParams(gl);
          if (this.alphaMap !== this._mapTexture) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.alphaMap);
          }
          gl.uniform1i(
            gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
            1
          );
        };
        p.clone = function() {
          var o = new AlphaMapFilter(this.alphaMap);
          return o;
        };
        p.toString = function() {
          return "[AlphaMapFilter]";
        };
        p._applyFilter = function(imageData) {
          if (!this._prepAlphaMap()) {
            return false;
          }
          var outArray = imageData.data;
          var width = imageData.width;
          var height = imageData.height;
          var rowOffset, pixelStart;
          var sampleData = this._mapCtx.getImageData(0, 0, this._map.width, this._map.height);
          var sampleArray = sampleData.data;
          var sampleWidth = sampleData.width;
          var sampleHeight = sampleData.height;
          var sampleRowOffset, samplePixelStart;
          var widthRatio = sampleWidth / width;
          var heightRatio = sampleHeight / height;
          for (var i = 0; i < height; i++) {
            rowOffset = i * width;
            sampleRowOffset = (i * heightRatio | 0) * sampleWidth;
            for (var j = 0; j < width; j++) {
              pixelStart = (rowOffset + j) * 4;
              samplePixelStart = (sampleRowOffset + (j * widthRatio | 0)) * 4;
              outArray[pixelStart] = outArray[pixelStart];
              outArray[pixelStart + 1] = outArray[pixelStart + 1];
              outArray[pixelStart + 2] = outArray[pixelStart + 2];
              outArray[pixelStart + 3] = sampleArray[samplePixelStart];
            }
          }
          return true;
        };
        p._prepAlphaMap = function() {
          if (!this.alphaMap) {
            return false;
          }
          if (this.alphaMap === this._map && this._mapCtx) {
            return true;
          }
          var map = this._map = this.alphaMap;
          var canvas = map;
          var ctx;
          if (map instanceof HTMLCanvasElement) {
            ctx = canvas.getContext("2d");
          } else {
            canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
            canvas.width = map.width;
            canvas.height = map.height;
            ctx = canvas.getContext("2d");
            ctx.drawImage(map, 0, 0);
          }
          this._mapCtx = ctx;
          return true;
        };
        createjs.AlphaMapFilter = createjs.promote(AlphaMapFilter, "Filter");
      })();
    }
  });

  // ../src/easeljs/filters/AlphaMaskFilter.js
  var require_AlphaMaskFilter = __commonJS({
    "../src/easeljs/filters/AlphaMaskFilter.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function AlphaMaskFilter(mask) {
          this.Filter_constructor();
          if (!createjs.Filter.isValidImageSource(mask)) {
            throw "Must provide valid image source for alpha mask, see Filter.isValidImageSource";
          }
          this.mask = mask;
          this.usesContext = true;
          this.FRAG_SHADER_BODY = "uniform sampler2D uAlphaSampler;void main(void) {vec4 color = texture2D(uSampler, vTextureCoord);vec4 alphaMap = texture2D(uAlphaSampler, vTextureCoord);gl_FragColor = vec4(color.rgb * alphaMap.a, color.a * alphaMap.a);}";
        }
        var p = createjs.extend(AlphaMaskFilter, createjs.Filter);
        p.shaderParamSetup = function(gl, stage2, shaderProgram) {
          if (!this._mapTexture) {
            this._mapTexture = gl.createTexture();
          }
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
          stage2.setTextureParams(gl);
          if (this.mask !== this._mapTexture) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask);
          }
          gl.uniform1i(
            gl.getUniformLocation(shaderProgram, "uAlphaSampler"),
            1
          );
        };
        p.applyFilter = function(ctx, x, y, width, height, targetCtx) {
          if (!this.mask) {
            return true;
          }
          if (targetCtx === void 0) {
            targetCtx = ctx;
          }
          if (targetCtx !== ctx) {
            targetCtx.drawImage(
              ctx.canvas,
              0,
              0,
              ctx.canvas.width,
              ctx.canvas.height,
              0,
              0,
              targetCtx.canvas.width,
              targetCtx.canvas.height
            );
          }
          targetCtx.save();
          targetCtx.globalCompositeOperation = "destination-in";
          targetCtx.drawImage(this.mask, 0, 0, this.mask.width, this.mask.height, x, y, width, height);
          targetCtx.restore();
          return true;
        };
        p.clone = function() {
          return new AlphaMaskFilter(this.mask);
        };
        p.toString = function() {
          return "[AlphaMaskFilter]";
        };
        createjs.AlphaMaskFilter = createjs.promote(AlphaMaskFilter, "Filter");
      })();
    }
  });

  // ../src/easeljs/filters/BitmapCache.js
  var require_BitmapCache = __commonJS({
    "../src/easeljs/filters/BitmapCache.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function BitmapCache() {
          this.width = void 0;
          this.height = void 0;
          this.x = void 0;
          this.y = void 0;
          this.scale = 1;
          this.offX = 0;
          this.offY = 0;
          this.cacheID = 0;
          this._filterCount = 0;
          this._filterOffX = 0;
          this._filterOffY = 0;
          this._disabled = false;
          this._autoGenerated = false;
          this._cacheCanvas = null;
          this._stageGL = null;
          this._cacheDataURLID = 0;
          this._cacheDataURL = null;
          this._drawWidth = 0;
          this._drawHeight = 0;
          this._boundRect = new createjs.Rectangle();
          this._counterMatrix = null;
          this._bufferTextureOutput = null;
          this._bufferTextureConcat = null;
          this._bufferTextureTemp = null;
        }
        var p = BitmapCache.prototype;
        p._get_disabled = function() {
          return this._disabled;
        };
        p._set_disabled = function(value) {
          this._disabled = !!value;
          if (this.target) {
            this.target.cacheCanvas = this._disabled || this._autoGenerated ? null : this._cacheCanvas;
          }
        };
        try {
          Object.defineProperties(p, {
            /**
             * Disable or enable the BitmapCache from displaying. Does not cause or block cache or cache updates when toggled.
             * Best used if the cached state is always identical, but the object will need temporary uncaching.
             * @property autoPurge
             * @type {Boolean}
             * @default false
             */
            disabled: { get: p._get_disabled, set: p._set_disabled }
          });
        } catch (e) {
        }
        BitmapCache.getFilterBounds = function(target, output) {
          if (!output) {
            output = new createjs.Rectangle();
          }
          var filters = target.filters;
          var filterCount = filters && filters.length;
          if (!!filterCount <= 0) {
            return output;
          }
          for (var i = 0; i < filterCount; i++) {
            var f = filters[i];
            if (!f || !f.getBounds) {
              continue;
            }
            var test = f.getBounds();
            if (!test) {
              continue;
            }
            if (i === 0) {
              output.setValues(test.x, test.y, test.width, test.height);
            } else {
              output.extend(test.x, test.y, test.width, test.height);
            }
          }
          return output;
        };
        BitmapCache.filterCounter = function(acc, o) {
          var out = 1;
          while (o._multiPass) {
            o = o._multiPass;
            out++;
          }
          return acc + out;
        };
        p.toString = function() {
          return "[BitmapCache]";
        };
        p.define = function(target, x, y, width, height, scale, options) {
          if (!target) {
            throw "No symbol to cache";
          }
          this._options = options;
          this.target = target;
          this.width = width >= 1 ? width : 1;
          this.height = height >= 1 ? height : 1;
          this.x = x || 0;
          this.y = y || 0;
          this.scale = scale || 1;
          this.update();
        };
        p.update = function(compositeOperation) {
          if (!this.target) {
            throw "define() must be called before update()";
          }
          var filterBounds = BitmapCache.getFilterBounds(this.target);
          var surface = this._cacheCanvas;
          this._drawWidth = Math.ceil(this.width * this.scale) + filterBounds.width;
          this._drawHeight = Math.ceil(this.height * this.scale) + filterBounds.height;
          this._filterCount = this.target.filters && this.target.filters.reduce(BitmapCache.filterCounter, 0);
          if (!surface || this._drawWidth !== surface.width || this._drawHeight !== surface.height) {
            this._updateSurface();
          }
          if (this._stageGL) {
            if (this._bufferTextureOutput === null) {
              this._bufferTextureOutput = this._stageGL.getRenderBufferTexture(this._drawWidth, this._drawHeight);
            } else {
              this._stageGL.resizeTexture(this._bufferTextureOutput, this._drawWidth, this._drawHeight);
            }
            if (this._cacheCanvas === null) {
              this._cacheCanvas = this._bufferTextureOutput;
              this.disabled = this._disabled;
            }
            if (this._filterCount >= 1) {
              if (this._bufferTextureConcat === null) {
                this._bufferTextureConcat = this._stageGL.getRenderBufferTexture(this._drawWidth, this._drawHeight);
              } else {
                this._stageGL.resizeTexture(this._bufferTextureConcat, this._drawWidth, this._drawHeight);
              }
            }
          }
          this._filterOffX = filterBounds.x;
          this._filterOffY = filterBounds.y;
          this.offX = this.x * this.scale + this._filterOffX;
          this.offY = this.y * this.scale + this._filterOffY;
          this._drawToCache(compositeOperation);
          this.cacheID = this.cacheID ? this.cacheID + 1 : 1;
        };
        p.release = function() {
          if (this._stageGL) {
            if (this._bufferTextureOutput !== null) {
              this._stageGL._killTextureObject(this._bufferTextureOutput);
            }
            if (this._bufferTextureConcat !== null) {
              this._stageGL._killTextureObject(this._bufferTextureConcat);
            }
            if (this._bufferTextureTemp !== null) {
              this._stageGL._killTextureObject(this._bufferTextureTemp);
            }
            this._stageGL = false;
          } else {
            var stage2 = this.target.stage;
            if (stage2 instanceof createjs.StageGL) {
              stage2.releaseTexture(this._cacheCanvas);
            }
          }
          this.disabled = true;
          this.target = this._cacheCanvas = null;
          this.cacheID = this._cacheDataURLID = this._cacheDataURL = void 0;
          this.width = this.height = this.x = this.y = this.offX = this.offY = 0;
          this.scale = 1;
        };
        p.getCacheDataURL = function() {
          var cacheCanvas = this.target && this._cacheCanvas;
          if (!cacheCanvas) {
            return null;
          }
          if (this.cacheID !== this._cacheDataURLID) {
            this._cacheDataURLID = this.cacheID;
            this._cacheDataURL = cacheCanvas.toDataURL ? cacheCanvas.toDataURL() : null;
          }
          return this._cacheDataURL;
        };
        p.draw = function(ctx) {
          if (!this.target) {
            return false;
          }
          ctx.drawImage(
            this._cacheCanvas,
            this.x + this._filterOffX / this.scale,
            this.y + this._filterOffY / this.scale,
            this._drawWidth / this.scale,
            this._drawHeight / this.scale
          );
          return true;
        };
        p.getBounds = function() {
          var scale = this.scale;
          return this._boundRect.setValues(
            this.x,
            this.y,
            this.width / scale,
            this.height / scale
          );
        };
        p._getGLFilter = function(lookup) {
          if (this.target.filters === null || lookup < 0) {
            return void 0;
          }
          var i = 0;
          var result = this.target.filters[i];
          while (result && --lookup >= 0) {
            result = result._multiPass ? result._multiPass : this.target.filters[++i];
          }
          return result;
        };
        p._updateSurface = function() {
          var surface;
          if (!this._options || !this._options.useGL) {
            surface = this._cacheCanvas;
            if (!surface) {
              surface = this._cacheCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
              this.disabled = this._disabled;
            }
            surface.width = this._drawWidth;
            surface.height = this._drawHeight;
            return;
          }
          if (!this._stageGL) {
            if (this._options.useGL === "stage") {
              var targetStage = this.target.stage;
              if (!(targetStage && targetStage.isWebGL)) {
                var error = "Cannot use 'stage' for cache because the object's parent stage is ";
                error += targetStage ? "non WebGL." : "not set, please addChild to the correct stage.";
                throw error;
              }
              this._stageGL = targetStage;
            } else if (this._options.useGL === "new") {
              this._cacheCanvas = document.createElement("canvas");
              this._stageGL = new createjs.StageGL(this._cacheCanvas, { antialias: true, transparent: true, autoPurge: 10 });
              if (!this._stageGL._webGLContext) {
                throw "GL Cache asked for but unavailable";
              }
              this._stageGL.isCacheControlled = true;
            } else if (this._options.useGL instanceof createjs.StageGL) {
              this._stageGL = this._options.useGL;
            } else {
              throw "Invalid option provided to useGL, expected ['stage', 'new', StageGL, undefined], got " + this._options.useGL;
            }
          }
          this.disabled = this._disabled;
          var stageGL = this._stageGL;
          if (stageGL.isCacheControlled) {
            surface = this._cacheCanvas;
            surface.width = this._drawWidth;
            surface.height = this._drawHeight;
            stageGL.updateViewport(this._drawWidth, this._drawHeight);
          }
        };
        p._drawToCache = function(compositeOperation) {
          var surface = this._cacheCanvas;
          var target = this.target;
          var webGL = this._stageGL;
          if (webGL) {
            webGL.cacheDraw(target, this);
          } else {
            var ctx = surface.getContext("2d");
            if (!compositeOperation) {
              ctx.clearRect(0, 0, this._drawWidth + 1, this._drawHeight + 1);
            }
            ctx.save();
            ctx.globalCompositeOperation = compositeOperation;
            ctx.setTransform(this.scale, 0, 0, this.scale, -this._filterOffX, -this._filterOffY);
            ctx.translate(-this.x, -this.y);
            target.draw(ctx, true);
            ctx.restore();
            if (target.filters && target.filters.length) {
              this._applyFilters(ctx);
            }
          }
          surface._invalid = true;
        };
        p._applyFilters = function(ctx) {
          var filters = this.target.filters;
          var w = this._drawWidth;
          var h = this._drawHeight;
          var data;
          var i = 0, filter = filters[i];
          do {
            if (filter.usesContext) {
              if (data) {
                ctx.putImageData(data, 0, 0);
                data = null;
              }
              filter.applyFilter(ctx, 0, 0, w, h);
            } else {
              if (!data) {
                data = ctx.getImageData(0, 0, w, h);
              }
              filter._applyFilter(data);
            }
            filter = filter._multiPass !== null ? filter._multiPass : filters[++i];
          } while (filter);
          if (data) {
            ctx.putImageData(data, 0, 0);
          }
        };
        createjs.BitmapCache = BitmapCache;
      })();
    }
  });

  // ../src/easeljs/filters/BlurFilter.js
  var require_BlurFilter = __commonJS({
    "../src/easeljs/filters/BlurFilter.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function BlurFilter(blurX, blurY, quality) {
          this.Filter_constructor();
          this._blurX = blurX;
          this._blurXTable = [];
          this._lastBlurX = null;
          this._blurY = blurY;
          this._blurYTable = [];
          this._lastBlurY = null;
          this._quality;
          this._lastQuality = null;
          this.FRAG_SHADER_TEMPLATE = "uniform float xWeight[{{blurX}}];uniform float yWeight[{{blurY}}];uniform vec2 textureOffset;void main(void) {vec4 color = vec4(0.0);float xAdj = ({{blurX}}.0-1.0)/2.0;float yAdj = ({{blurY}}.0-1.0)/2.0;vec2 sampleOffset;for(int i=0; i<{{blurX}}; i++) {for(int j=0; j<{{blurY}}; j++) {sampleOffset = vTextureCoord + (textureOffset * vec2(float(i)-xAdj, float(j)-yAdj));color += texture2D(uSampler, sampleOffset) * (xWeight[i] * yWeight[j]);}}gl_FragColor = color.rgba;}";
          if (isNaN(quality) || quality < 1) {
            quality = 1;
          }
          this.setQuality(quality | 0);
        }
        var p = createjs.extend(BlurFilter, createjs.Filter);
        p.getBlurX = function() {
          return this._blurX;
        };
        p.getBlurY = function() {
          return this._blurY;
        };
        p.setBlurX = function(value) {
          if (isNaN(value) || value < 0) {
            value = 0;
          }
          this._blurX = value;
        };
        p.setBlurY = function(value) {
          if (isNaN(value) || value < 0) {
            value = 0;
          }
          this._blurY = value;
        };
        p.getQuality = function() {
          return this._quality;
        };
        p.setQuality = function(value) {
          if (isNaN(value) || value < 0) {
            value = 0;
          }
          this._quality = value | 0;
        };
        p._getShader = function() {
          var xChange = this._lastBlurX !== this._blurX;
          var yChange = this._lastBlurY !== this._blurY;
          var qChange = this._lastQuality !== this._quality;
          if (xChange || yChange || qChange) {
            if (xChange || qChange) {
              this._blurXTable = this._getTable(this._blurX * this._quality);
            }
            if (yChange || qChange) {
              this._blurYTable = this._getTable(this._blurY * this._quality);
            }
            this._updateShader();
            this._lastBlurX = this._blurX;
            this._lastBlurY = this._blurY;
            this._lastQuality = this._quality;
            return void 0;
          }
          return this._compiledShader;
        };
        p._setShader = function(value) {
          this._compiledShader = value;
        };
        try {
          Object.defineProperties(p, {
            blurX: { get: p.getBlurX, set: p.setBlurX },
            blurY: { get: p.getBlurY, set: p.setBlurY },
            quality: { get: p.getQuality, set: p.setQuality },
            _builtShader: { get: p._getShader, set: p._setShader }
          });
        } catch (e) {
          console.log(e);
        }
        p._getTable = function(spread) {
          var EDGE = 4.2;
          if (spread <= 1) {
            return [1];
          }
          var result = [];
          var count = Math.ceil(spread * 2);
          count += count % 2 ? 0 : 1;
          var adjust = count / 2 | 0;
          for (var i = -adjust; i <= adjust; i++) {
            var x = i / adjust * EDGE;
            result.push(1 / Math.sqrt(2 * Math.PI) * Math.pow(Math.E, -(Math.pow(x, 2) / 4)));
          }
          var factor = result.reduce(function(a, b) {
            return a + b;
          });
          return result.map(function(currentValue, index, array) {
            return currentValue / factor;
          });
        };
        p._updateShader = function() {
          if (this._blurX === void 0 || this._blurY === void 0) {
            return;
          }
          var result = this.FRAG_SHADER_TEMPLATE;
          result = result.replace(/\{\{blurX\}\}/g, this._blurXTable.length.toFixed(0));
          result = result.replace(/\{\{blurY\}\}/g, this._blurYTable.length.toFixed(0));
          this.FRAG_SHADER_BODY = result;
        };
        p.shaderParamSetup = function(gl, stage2, shaderProgram) {
          gl.uniform1fv(
            gl.getUniformLocation(shaderProgram, "xWeight"),
            this._blurXTable
          );
          gl.uniform1fv(
            gl.getUniformLocation(shaderProgram, "yWeight"),
            this._blurYTable
          );
          gl.uniform2f(
            gl.getUniformLocation(shaderProgram, "textureOffset"),
            2 / (stage2._viewportWidth * this._quality),
            2 / (stage2._viewportHeight * this._quality)
          );
        };
        BlurFilter.MUL_TABLE = [1, 171, 205, 293, 57, 373, 79, 137, 241, 27, 391, 357, 41, 19, 283, 265, 497, 469, 443, 421, 25, 191, 365, 349, 335, 161, 155, 149, 9, 278, 269, 261, 505, 245, 475, 231, 449, 437, 213, 415, 405, 395, 193, 377, 369, 361, 353, 345, 169, 331, 325, 319, 313, 307, 301, 37, 145, 285, 281, 69, 271, 267, 263, 259, 509, 501, 493, 243, 479, 118, 465, 459, 113, 446, 55, 435, 429, 423, 209, 413, 51, 403, 199, 393, 97, 3, 379, 375, 371, 367, 363, 359, 355, 351, 347, 43, 85, 337, 333, 165, 327, 323, 5, 317, 157, 311, 77, 305, 303, 75, 297, 294, 73, 289, 287, 71, 141, 279, 277, 275, 68, 135, 67, 133, 33, 262, 260, 129, 511, 507, 503, 499, 495, 491, 61, 121, 481, 477, 237, 235, 467, 232, 115, 457, 227, 451, 7, 445, 221, 439, 218, 433, 215, 427, 425, 211, 419, 417, 207, 411, 409, 203, 202, 401, 399, 396, 197, 49, 389, 387, 385, 383, 95, 189, 47, 187, 93, 185, 23, 183, 91, 181, 45, 179, 89, 177, 11, 175, 87, 173, 345, 343, 341, 339, 337, 21, 167, 83, 331, 329, 327, 163, 81, 323, 321, 319, 159, 79, 315, 313, 39, 155, 309, 307, 153, 305, 303, 151, 75, 299, 149, 37, 295, 147, 73, 291, 145, 289, 287, 143, 285, 71, 141, 281, 35, 279, 139, 69, 275, 137, 273, 17, 271, 135, 269, 267, 133, 265, 33, 263, 131, 261, 130, 259, 129, 257, 1];
        BlurFilter.SHG_TABLE = [0, 9, 10, 11, 9, 12, 10, 11, 12, 9, 13, 13, 10, 9, 13, 13, 14, 14, 14, 14, 10, 13, 14, 14, 14, 13, 13, 13, 9, 14, 14, 14, 15, 14, 15, 14, 15, 15, 14, 15, 15, 15, 14, 15, 15, 15, 15, 15, 14, 15, 15, 15, 15, 15, 15, 12, 14, 15, 15, 13, 15, 15, 15, 15, 16, 16, 16, 15, 16, 14, 16, 16, 14, 16, 13, 16, 16, 16, 15, 16, 13, 16, 15, 16, 14, 9, 16, 16, 16, 16, 16, 16, 16, 16, 16, 13, 14, 16, 16, 15, 16, 16, 10, 16, 15, 16, 14, 16, 16, 14, 16, 16, 14, 16, 16, 14, 15, 16, 16, 16, 14, 15, 14, 15, 13, 16, 16, 15, 17, 17, 17, 17, 17, 17, 14, 15, 17, 17, 16, 16, 17, 16, 15, 17, 16, 17, 11, 17, 16, 17, 16, 17, 16, 17, 17, 16, 17, 17, 16, 17, 17, 16, 16, 17, 17, 17, 16, 14, 17, 17, 17, 17, 15, 16, 14, 16, 15, 16, 13, 16, 15, 16, 14, 16, 15, 16, 12, 16, 15, 16, 17, 17, 17, 17, 17, 13, 16, 15, 17, 17, 17, 16, 15, 17, 17, 17, 16, 15, 17, 17, 14, 16, 17, 17, 16, 17, 17, 16, 15, 17, 16, 14, 17, 16, 15, 17, 16, 17, 17, 16, 17, 15, 16, 17, 14, 17, 16, 15, 17, 16, 17, 13, 17, 16, 17, 17, 16, 17, 14, 17, 16, 17, 16, 17, 16, 17, 9];
        p.getBounds = function(rect) {
          var x = this.blurX | 0, y = this.blurY | 0;
          if (x <= 0 && y <= 0) {
            return rect;
          }
          var q = Math.pow(this.quality, 0.2);
          return (rect || new createjs.Rectangle()).pad(y * q + 1, x * q + 1, y * q + 1, x * q + 1);
        };
        p.clone = function() {
          return new BlurFilter(this.blurX, this.blurY, this.quality);
        };
        p.toString = function() {
          return "[BlurFilter]";
        };
        p._applyFilter = function(imageData) {
          var radiusX = this._blurX >> 1;
          if (isNaN(radiusX) || radiusX < 0) return false;
          var radiusY = this._blurY >> 1;
          if (isNaN(radiusY) || radiusY < 0) return false;
          if (radiusX == 0 && radiusY == 0) return false;
          var iterations = this.quality;
          if (isNaN(iterations) || iterations < 1) iterations = 1;
          iterations |= 0;
          if (iterations > 3) iterations = 3;
          if (iterations < 1) iterations = 1;
          var px = imageData.data;
          var x = 0, y = 0, i = 0, p2 = 0, yp = 0, yi = 0, yw = 0, r = 0, g = 0, b = 0, a = 0, pr = 0, pg = 0, pb = 0, pa = 0;
          var divx = radiusX + radiusX + 1 | 0;
          var divy = radiusY + radiusY + 1 | 0;
          var w = imageData.width | 0;
          var h = imageData.height | 0;
          var w1 = w - 1 | 0;
          var h1 = h - 1 | 0;
          var rxp1 = radiusX + 1 | 0;
          var ryp1 = radiusY + 1 | 0;
          var ssx = { r: 0, b: 0, g: 0, a: 0 };
          var sx = ssx;
          for (i = 1; i < divx; i++) {
            sx = sx.n = { r: 0, b: 0, g: 0, a: 0 };
          }
          sx.n = ssx;
          var ssy = { r: 0, b: 0, g: 0, a: 0 };
          var sy = ssy;
          for (i = 1; i < divy; i++) {
            sy = sy.n = { r: 0, b: 0, g: 0, a: 0 };
          }
          sy.n = ssy;
          var si = null;
          var mtx = BlurFilter.MUL_TABLE[radiusX] | 0;
          var stx = BlurFilter.SHG_TABLE[radiusX] | 0;
          var mty = BlurFilter.MUL_TABLE[radiusY] | 0;
          var sty = BlurFilter.SHG_TABLE[radiusY] | 0;
          while (iterations-- > 0) {
            yw = yi = 0;
            var ms = mtx;
            var ss = stx;
            for (y = h; --y > -1; ) {
              r = rxp1 * (pr = px[yi | 0]);
              g = rxp1 * (pg = px[yi + 1 | 0]);
              b = rxp1 * (pb = px[yi + 2 | 0]);
              a = rxp1 * (pa = px[yi + 3 | 0]);
              sx = ssx;
              for (i = rxp1; --i > -1; ) {
                sx.r = pr;
                sx.g = pg;
                sx.b = pb;
                sx.a = pa;
                sx = sx.n;
              }
              for (i = 1; i < rxp1; i++) {
                p2 = yi + ((w1 < i ? w1 : i) << 2) | 0;
                r += sx.r = px[p2];
                g += sx.g = px[p2 + 1];
                b += sx.b = px[p2 + 2];
                a += sx.a = px[p2 + 3];
                sx = sx.n;
              }
              si = ssx;
              for (x = 0; x < w; x++) {
                px[yi++] = r * ms >>> ss;
                px[yi++] = g * ms >>> ss;
                px[yi++] = b * ms >>> ss;
                px[yi++] = a * ms >>> ss;
                p2 = yw + ((p2 = x + radiusX + 1) < w1 ? p2 : w1) << 2;
                r -= si.r - (si.r = px[p2]);
                g -= si.g - (si.g = px[p2 + 1]);
                b -= si.b - (si.b = px[p2 + 2]);
                a -= si.a - (si.a = px[p2 + 3]);
                si = si.n;
              }
              yw += w;
            }
            ms = mty;
            ss = sty;
            for (x = 0; x < w; x++) {
              yi = x << 2 | 0;
              r = ryp1 * (pr = px[yi]) | 0;
              g = ryp1 * (pg = px[yi + 1 | 0]) | 0;
              b = ryp1 * (pb = px[yi + 2 | 0]) | 0;
              a = ryp1 * (pa = px[yi + 3 | 0]) | 0;
              sy = ssy;
              for (i = 0; i < ryp1; i++) {
                sy.r = pr;
                sy.g = pg;
                sy.b = pb;
                sy.a = pa;
                sy = sy.n;
              }
              yp = w;
              for (i = 1; i <= radiusY; i++) {
                yi = yp + x << 2;
                r += sy.r = px[yi];
                g += sy.g = px[yi + 1];
                b += sy.b = px[yi + 2];
                a += sy.a = px[yi + 3];
                sy = sy.n;
                if (i < h1) {
                  yp += w;
                }
              }
              yi = x;
              si = ssy;
              if (iterations > 0) {
                for (y = 0; y < h; y++) {
                  p2 = yi << 2;
                  px[p2 + 3] = pa = a * ms >>> ss;
                  if (pa > 0) {
                    px[p2] = r * ms >>> ss;
                    px[p2 + 1] = g * ms >>> ss;
                    px[p2 + 2] = b * ms >>> ss;
                  } else {
                    px[p2] = px[p2 + 1] = px[p2 + 2] = 0;
                  }
                  p2 = x + ((p2 = y + ryp1) < h1 ? p2 : h1) * w << 2;
                  r -= si.r - (si.r = px[p2]);
                  g -= si.g - (si.g = px[p2 + 1]);
                  b -= si.b - (si.b = px[p2 + 2]);
                  a -= si.a - (si.a = px[p2 + 3]);
                  si = si.n;
                  yi += w;
                }
              } else {
                for (y = 0; y < h; y++) {
                  p2 = yi << 2;
                  px[p2 + 3] = pa = a * ms >>> ss;
                  if (pa > 0) {
                    pa = 255 / pa;
                    px[p2] = (r * ms >>> ss) * pa;
                    px[p2 + 1] = (g * ms >>> ss) * pa;
                    px[p2 + 2] = (b * ms >>> ss) * pa;
                  } else {
                    px[p2] = px[p2 + 1] = px[p2 + 2] = 0;
                  }
                  p2 = x + ((p2 = y + ryp1) < h1 ? p2 : h1) * w << 2;
                  r -= si.r - (si.r = px[p2]);
                  g -= si.g - (si.g = px[p2 + 1]);
                  b -= si.b - (si.b = px[p2 + 2]);
                  a -= si.a - (si.a = px[p2 + 3]);
                  si = si.n;
                  yi += w;
                }
              }
            }
          }
          return true;
        };
        createjs.BlurFilter = createjs.promote(BlurFilter, "Filter");
      })();
    }
  });

  // ../src/easeljs/filters/ColorFilter.js
  var require_ColorFilter = __commonJS({
    "../src/easeljs/filters/ColorFilter.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function ColorFilter(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
          this.Filter_constructor();
          this.redMultiplier = redMultiplier != null ? redMultiplier : 1;
          this.greenMultiplier = greenMultiplier != null ? greenMultiplier : 1;
          this.blueMultiplier = blueMultiplier != null ? blueMultiplier : 1;
          this.alphaMultiplier = alphaMultiplier != null ? alphaMultiplier : 1;
          this.redOffset = redOffset || 0;
          this.greenOffset = greenOffset || 0;
          this.blueOffset = blueOffset || 0;
          this.alphaOffset = alphaOffset || 0;
          this.FRAG_SHADER_BODY = "uniform vec4 uColorMultiplier;uniform vec4 uColorOffset;void main(void) {vec4 color = texture2D(uSampler, vTextureCoord);color = clamp(vec4(0.0), vec4(1.0), vec4(vec3(color.rgb / color.a), color.a));color = clamp(vec4(0.0), vec4(1.0), color * uColorMultiplier + uColorOffset);gl_FragColor = vec4(color.rgb * color.a, color.a);}";
        }
        var p = createjs.extend(ColorFilter, createjs.Filter);
        p.shaderParamSetup = function(gl, stage2, shaderProgram) {
          gl.uniform4f(
            gl.getUniformLocation(shaderProgram, "uColorMultiplier"),
            this.redMultiplier,
            this.greenMultiplier,
            this.blueMultiplier,
            this.alphaMultiplier
          );
          gl.uniform4f(
            gl.getUniformLocation(shaderProgram, "uColorOffset"),
            this.redOffset / 255,
            this.greenOffset / 255,
            this.blueOffset / 255,
            this.alphaOffset / 255
          );
        };
        p.toString = function() {
          return "[ColorFilter]";
        };
        p.clone = function() {
          return new ColorFilter(
            this.redMultiplier,
            this.greenMultiplier,
            this.blueMultiplier,
            this.alphaMultiplier,
            this.redOffset,
            this.greenOffset,
            this.blueOffset,
            this.alphaOffset
          );
        };
        p._applyFilter = function(imageData) {
          var data = imageData.data;
          var l = data.length;
          for (var i = 0; i < l; i += 4) {
            data[i] = data[i] * this.redMultiplier + this.redOffset;
            data[i + 1] = data[i + 1] * this.greenMultiplier + this.greenOffset;
            data[i + 2] = data[i + 2] * this.blueMultiplier + this.blueOffset;
            data[i + 3] = data[i + 3] * this.alphaMultiplier + this.alphaOffset;
          }
          return true;
        };
        createjs.ColorFilter = createjs.promote(ColorFilter, "Filter");
      })();
    }
  });

  // ../src/easeljs/filters/ColorMatrix.js
  var require_ColorMatrix = __commonJS({
    "../src/easeljs/filters/ColorMatrix.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function ColorMatrix(brightness, contrast, saturation, hue) {
          this.setColor(brightness, contrast, saturation, hue);
        }
        var p = ColorMatrix.prototype;
        ColorMatrix.DELTA_INDEX = [
          0,
          0.01,
          0.02,
          0.04,
          0.05,
          0.06,
          0.07,
          0.08,
          0.1,
          0.11,
          0.12,
          0.14,
          0.15,
          0.16,
          0.17,
          0.18,
          0.2,
          0.21,
          0.22,
          0.24,
          0.25,
          0.27,
          0.28,
          0.3,
          0.32,
          0.34,
          0.36,
          0.38,
          0.4,
          0.42,
          0.44,
          0.46,
          0.48,
          0.5,
          0.53,
          0.56,
          0.59,
          0.62,
          0.65,
          0.68,
          0.71,
          0.74,
          0.77,
          0.8,
          0.83,
          0.86,
          0.89,
          0.92,
          0.95,
          0.98,
          1,
          1.06,
          1.12,
          1.18,
          1.24,
          1.3,
          1.36,
          1.42,
          1.48,
          1.54,
          1.6,
          1.66,
          1.72,
          1.78,
          1.84,
          1.9,
          1.96,
          2,
          2.12,
          2.25,
          2.37,
          2.5,
          2.62,
          2.75,
          2.87,
          3,
          3.2,
          3.4,
          3.6,
          3.8,
          4,
          4.3,
          4.7,
          4.9,
          5,
          5.5,
          6,
          6.5,
          6.8,
          7,
          7.3,
          7.5,
          7.8,
          8,
          8.4,
          8.7,
          9,
          9.4,
          9.6,
          9.8,
          10
        ];
        ColorMatrix.IDENTITY_MATRIX = [
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          0,
          1
        ];
        ColorMatrix.LENGTH = ColorMatrix.IDENTITY_MATRIX.length;
        ColorMatrix.createSepiaPreset = function() {
          return new ColorMatrix().copy([
            0.4977,
            0.9828,
            0.1322,
            0,
            14,
            0.4977,
            0.9828,
            0.1322,
            0,
            -14,
            0.4977,
            0.9828,
            0.1322,
            0,
            -47,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ]);
        };
        ColorMatrix.createInvertPreset = function() {
          return new ColorMatrix().copy([
            -1,
            0,
            0,
            0,
            255,
            0,
            -1,
            0,
            0,
            255,
            0,
            0,
            -1,
            0,
            255,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ]);
        };
        ColorMatrix.createGreyscalePreset = function() {
          return new ColorMatrix().copy([
            0.3333,
            0.3334,
            0.3333,
            0,
            0,
            0.3333,
            0.3334,
            0.3333,
            0,
            0,
            0.3333,
            0.3334,
            0.3333,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ]);
        };
        p.setColor = function(brightness, contrast, saturation, hue) {
          return this.reset().adjustColor(brightness, contrast, saturation, hue);
        };
        p.reset = function() {
          return this.copy(ColorMatrix.IDENTITY_MATRIX);
        };
        p.adjustColor = function(brightness, contrast, saturation, hue) {
          this.adjustHue(hue);
          this.adjustContrast(contrast);
          this.adjustBrightness(brightness);
          return this.adjustSaturation(saturation);
        };
        p.adjustBrightness = function(value) {
          if (value == 0 || isNaN(value)) {
            return this;
          }
          value = this._cleanValue(value, 255);
          this._multiplyMatrix([
            1,
            0,
            0,
            0,
            value,
            0,
            1,
            0,
            0,
            value,
            0,
            0,
            1,
            0,
            value,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ]);
          return this;
        };
        p.adjustOffset = function(r, g, b) {
          if (isNaN(r) || isNaN(g) || isNaN(b)) {
            return this;
          }
          this[4] = this._cleanValue(this[4] + r, 255);
          this[9] = this._cleanValue(this[9] + g, 255);
          this[14] = this._cleanValue(this[14] + b, 255);
          return this;
        };
        p.adjustContrast = function(value) {
          if (value == 0 || isNaN(value)) {
            return this;
          }
          value = this._cleanValue(value, 100);
          var x;
          if (value < 0) {
            x = 127 + value / 100 * 127;
          } else {
            x = value % 1;
            if (x == 0) {
              x = ColorMatrix.DELTA_INDEX[value];
            } else {
              x = ColorMatrix.DELTA_INDEX[value << 0] * (1 - x) + ColorMatrix.DELTA_INDEX[(value << 0) + 1] * x;
            }
            x = x * 127 + 127;
          }
          this._multiplyMatrix([
            x / 127,
            0,
            0,
            0,
            0.5 * (127 - x),
            0,
            x / 127,
            0,
            0,
            0.5 * (127 - x),
            0,
            0,
            x / 127,
            0,
            0.5 * (127 - x),
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ]);
          return this;
        };
        p.adjustSaturation = function(value) {
          if (value == 0 || isNaN(value)) {
            return this;
          }
          value = this._cleanValue(value, 100);
          var x = 1 + (value > 0 ? 3 * value / 100 : value / 100);
          var lumR = 0.3086;
          var lumG = 0.6094;
          var lumB = 0.082;
          this._multiplyMatrix([
            lumR * (1 - x) + x,
            lumG * (1 - x),
            lumB * (1 - x),
            0,
            0,
            lumR * (1 - x),
            lumG * (1 - x) + x,
            lumB * (1 - x),
            0,
            0,
            lumR * (1 - x),
            lumG * (1 - x),
            lumB * (1 - x) + x,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ]);
          return this;
        };
        p.adjustHue = function(value) {
          if (value == 0 || isNaN(value)) {
            return this;
          }
          value = this._cleanValue(value, 180) / 180 * Math.PI;
          var cosVal = Math.cos(value);
          var sinVal = Math.sin(value);
          var lumR = 0.213;
          var lumG = 0.715;
          var lumB = 0.072;
          this._multiplyMatrix([
            lumR + cosVal * (1 - lumR) + sinVal * -lumR,
            lumG + cosVal * -lumG + sinVal * -lumG,
            lumB + cosVal * -lumB + sinVal * (1 - lumB),
            0,
            0,
            lumR + cosVal * -lumR + sinVal * 0.143,
            lumG + cosVal * (1 - lumG) + sinVal * 0.14,
            lumB + cosVal * -lumB + sinVal * -0.283,
            0,
            0,
            lumR + cosVal * -lumR + sinVal * -(1 - lumR),
            lumG + cosVal * -lumG + sinVal * lumG,
            lumB + cosVal * (1 - lumB) + sinVal * lumB,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            0,
            1
          ]);
          return this;
        };
        p.concat = function(matrix) {
          matrix = this._fixMatrix(matrix);
          if (matrix.length != ColorMatrix.LENGTH) {
            return this;
          }
          this._multiplyMatrix(matrix);
          return this;
        };
        p.clone = function() {
          return new ColorMatrix().copy(this);
        };
        p.toArray = function() {
          var arr = [];
          for (var i = 0, l = ColorMatrix.LENGTH; i < l; i++) {
            arr[i] = this[i];
          }
          return arr;
        };
        p.copy = function(matrix) {
          var l = ColorMatrix.LENGTH;
          for (var i = 0; i < l; i++) {
            this[i] = matrix[i];
          }
          return this;
        };
        p.toString = function() {
          var sz = "";
          sz += "    " + this[0].toFixed(4) + ", " + this[1].toFixed(4) + ", " + this[2].toFixed(4) + ", " + this[3].toFixed(4) + ", " + (this[4] | 0) + ",\n";
          sz += "    " + this[5].toFixed(4) + ", " + this[6].toFixed(4) + ", " + this[7].toFixed(4) + ", " + this[8].toFixed(4) + ", " + (this[9] | 0) + ",\n";
          sz += "    " + this[10].toFixed(4) + ", " + this[11].toFixed(4) + ", " + this[12].toFixed(4) + ", " + this[13].toFixed(4) + ", " + (this[14] | 0) + ",\n";
          sz += "    " + this[15].toFixed(4) + ", " + this[16].toFixed(4) + ", " + this[17].toFixed(4) + ", " + this[18].toFixed(4) + ", " + (this[19] | 0) + ",\n";
          sz += "    " + (this[20] | 0) + ", " + (this[21] | 0) + ", " + (this[22] | 0) + ", " + (this[23] | 0) + ", " + (this[24] | 0) + "\n";
          return "[ColorMatrix] {\n" + sz + "}";
        };
        p._multiplyMatrix = function(matrix) {
          var i, j, k, col = [];
          for (i = 0; i < 5; i++) {
            for (j = 0; j < 5; j++) {
              col[j] = this[j + i * 5];
            }
            for (j = 0; j < 5; j++) {
              var val = 0;
              for (k = 0; k < 5; k++) {
                val += matrix[j + k * 5] * col[k];
              }
              this[j + i * 5] = val;
            }
          }
        };
        p._cleanValue = function(value, limit) {
          return Math.min(limit, Math.max(-limit, value));
        };
        p._fixMatrix = function(matrix) {
          if (matrix instanceof ColorMatrix) {
            matrix = matrix.toArray();
          }
          if (matrix.length < ColorMatrix.LENGTH) {
            matrix = matrix.slice(0, matrix.length).concat(ColorMatrix.IDENTITY_MATRIX.slice(matrix.length, ColorMatrix.LENGTH));
          } else if (matrix.length > ColorMatrix.LENGTH) {
            matrix = matrix.slice(0, ColorMatrix.LENGTH);
          }
          return matrix;
        };
        createjs.ColorMatrix = ColorMatrix;
      })();
    }
  });

  // ../src/easeljs/filters/ColorMatrixFilter.js
  var require_ColorMatrixFilter = __commonJS({
    "../src/easeljs/filters/ColorMatrixFilter.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function ColorMatrixFilter(matrix) {
          this.Filter_constructor();
          this.matrix = matrix;
          this.FRAG_SHADER_BODY = "uniform mat4 uColorMatrix;uniform vec4 uColorMatrixOffset;void main(void) {vec4 color = texture2D(uSampler, vTextureCoord);mat4 m = uColorMatrix;vec4 newColor = vec4(color.r*m[0][0] + color.g*m[0][1] + color.b*m[0][2] + color.a*m[0][3],color.r*m[1][0] + color.g*m[1][1] + color.b*m[1][2] + color.a*m[1][3],color.r*m[2][0] + color.g*m[2][1] + color.b*m[2][2] + color.a*m[2][3],color.r*m[3][0] + color.g*m[3][1] + color.b*m[3][2] + color.a*m[3][3]);gl_FragColor = newColor + uColorMatrixOffset;}";
        }
        var p = createjs.extend(ColorMatrixFilter, createjs.Filter);
        p.shaderParamSetup = function(gl, stage2, shaderProgram) {
          var mat = this.matrix;
          var colorMatrix = new Float32Array([
            mat[0],
            mat[1],
            mat[2],
            mat[3],
            mat[5],
            mat[6],
            mat[7],
            mat[8],
            mat[10],
            mat[11],
            mat[12],
            mat[13],
            mat[15],
            mat[16],
            mat[17],
            mat[18]
          ]);
          gl.uniformMatrix4fv(
            gl.getUniformLocation(shaderProgram, "uColorMatrix"),
            false,
            colorMatrix
          );
          gl.uniform4f(
            gl.getUniformLocation(shaderProgram, "uColorMatrixOffset"),
            mat[4] / 255,
            mat[9] / 255,
            mat[14] / 255,
            mat[19] / 255
          );
        };
        p.toString = function() {
          return "[ColorMatrixFilter]";
        };
        p.clone = function() {
          return new ColorMatrixFilter(this.matrix);
        };
        p._applyFilter = function(imageData) {
          var data = imageData.data;
          var l = data.length;
          var r, g, b, a;
          var mtx = this.matrix;
          var m0 = mtx[0], m1 = mtx[1], m2 = mtx[2], m3 = mtx[3], m4 = mtx[4];
          var m5 = mtx[5], m6 = mtx[6], m7 = mtx[7], m8 = mtx[8], m9 = mtx[9];
          var m10 = mtx[10], m11 = mtx[11], m12 = mtx[12], m13 = mtx[13], m14 = mtx[14];
          var m15 = mtx[15], m16 = mtx[16], m17 = mtx[17], m18 = mtx[18], m19 = mtx[19];
          for (var i = 0; i < l; i += 4) {
            r = data[i];
            g = data[i + 1];
            b = data[i + 2];
            a = data[i + 3];
            data[i] = r * m0 + g * m1 + b * m2 + a * m3 + m4;
            data[i + 1] = r * m5 + g * m6 + b * m7 + a * m8 + m9;
            data[i + 2] = r * m10 + g * m11 + b * m12 + a * m13 + m14;
            data[i + 3] = r * m15 + g * m16 + b * m17 + a * m18 + m19;
          }
          return true;
        };
        createjs.ColorMatrixFilter = createjs.promote(ColorMatrixFilter, "Filter");
      })();
    }
  });

  // ../src/easeljs/filters/DisplacementFilter.js
  var require_DisplacementFilter = __commonJS({
    "../src/easeljs/filters/DisplacementFilter.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function DisplacementFilter(dudvMap, distance) {
          this.Filter_constructor();
          if (!createjs.Filter.isValidImageSource(dudvMap)) {
            throw "Must provide valid image source for displacement map, see Filter.isValidImageSource";
          }
          this.dudvMap = dudvMap;
          this.distance = Number(distance);
          if (isNaN(this.distance)) {
            this.distance = 128;
          }
          this.FRAG_SHADER_BODY = "uniform sampler2D uDudvSampler;uniform float fPower;uniform vec2 pixelAdjustment;void main(void) {vec4 dudvValue = texture2D(uDudvSampler, vTextureCoord);vec2 sampleOffset = mix(vec2(0.0), dudvValue.rg-0.5, dudvValue.a) * (fPower*pixelAdjustment);gl_FragColor = texture2D(uSampler, vTextureCoord + sampleOffset);}";
          if (dudvMap instanceof WebGLTexture) {
            this._mapTexture = dudvMap;
          } else if (dudvMap instanceof HTMLCanvasElement) {
            this._dudvCanvas = dudvMap;
            this._dudvCtx = dudvMap.getContext("2d");
          } else {
            var canvas = this._dudvCanvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
            canvas.width = dudvMap.width;
            canvas.height = dudvMap.height;
            (this._dudvCtx = canvas.getContext("2d")).drawImage(dudvMap, 0, 0);
          }
        }
        var p = createjs.extend(DisplacementFilter, createjs.Filter);
        p.shaderParamSetup = function(gl, stage2, shaderProgram) {
          if (!this._mapTexture) {
            this._mapTexture = gl.createTexture();
          }
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this._mapTexture);
          stage2.setTextureParams(gl);
          if (this.dudvMap !== this._mapTexture) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.dudvMap);
          }
          gl.uniform1i(
            gl.getUniformLocation(shaderProgram, "uDudvSampler"),
            1
          );
          gl.uniform1f(
            gl.getUniformLocation(shaderProgram, "fPower"),
            this.distance
          );
          gl.uniform2f(
            //this is correct as the color maps to -0.5,0.5. This compounds the pixel delta, thus 2/size
            gl.getUniformLocation(shaderProgram, "pixelAdjustment"),
            2 / stage2._viewportWidth,
            -2 / stage2._viewportHeight
          );
        };
        p._applyFilter = function(imageData) {
          var refArray, refArraySrc = imageData.data;
          if (refArraySrc.slice !== void 0) {
            refArray = refArraySrc.slice();
          } else {
            refArray = new Uint8ClampedArray(refArraySrc.length);
            refArray.set(refArraySrc);
          }
          var outArray = imageData.data;
          var width = imageData.width;
          var height = imageData.height;
          var rowOffset, pixelStart;
          var sampleData = this._dudvCtx.getImageData(0, 0, this.dudvMap.width, this.dudvMap.height);
          var sampleArray = sampleData.data;
          var sampleWidth = sampleData.width;
          var sampleHeight = sampleData.height;
          var sampleRowOffset, samplePixelStart;
          var widthRatio = sampleWidth / width;
          var heightRatio = sampleHeight / height;
          var pxRange = 1 / 255;
          var distance = this.distance * 2;
          for (var i = 0; i < height; i++) {
            rowOffset = i * width;
            sampleRowOffset = (i * heightRatio | 0) * sampleWidth;
            for (var j = 0; j < width; j++) {
              pixelStart = (rowOffset + j) * 4;
              samplePixelStart = (sampleRowOffset + (j * widthRatio | 0)) * 4;
              var deltaPower = sampleArray[samplePixelStart + 3] * pxRange * distance;
              var xDelta = (sampleArray[samplePixelStart] * pxRange - 0.5) * deltaPower | 0;
              var yDelta = (sampleArray[samplePixelStart + 1] * pxRange - 0.5) * deltaPower | 0;
              if (j + xDelta < 0) {
                xDelta = -j;
              }
              if (j + xDelta > width) {
                xDelta = width - j;
              }
              if (i + yDelta < 0) {
                yDelta = -i;
              }
              if (i + yDelta > height) {
                yDelta = height - i;
              }
              var targetPixelStart = pixelStart + xDelta * 4 + yDelta * 4 * width;
              outArray[pixelStart] = refArray[targetPixelStart];
              outArray[pixelStart + 1] = refArray[targetPixelStart + 1];
              outArray[pixelStart + 2] = refArray[targetPixelStart + 2];
              outArray[pixelStart + 3] = refArray[targetPixelStart + 3];
            }
          }
          return true;
        };
        createjs.DisplacementFilter = createjs.promote(DisplacementFilter, "Filter");
      })();
    }
  });

  // ../src/easeljs/filters/Filter.js
  var require_Filter = __commonJS({
    "../src/easeljs/filters/Filter.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Filter() {
          this.usesContext = false;
          this._multiPass = null;
          this.VTX_SHADER_BODY = null;
          this.FRAG_SHADER_BODY = null;
        }
        var p = Filter.prototype;
        Filter.isValidImageSource = function(src) {
          return Boolean(src) && (src instanceof Image || src instanceof WebGLTexture || src instanceof HTMLCanvasElement);
        };
        p.getBounds = function(rect) {
          return rect;
        };
        p.shaderParamSetup = function(gl, stage2, shaderProgram) {
        };
        p.applyFilter = function(ctx, x, y, width, height, targetCtx) {
          targetCtx = targetCtx || ctx;
          try {
            var imageData = ctx.getImageData(x, y, width, height);
          } catch (e) {
            return false;
          }
          if (this._applyFilter(imageData)) {
            targetCtx.putImageData(imageData, x, y);
            return true;
          }
          return false;
        };
        p.toString = function() {
          return "[Filter]";
        };
        p.clone = function() {
          return new Filter();
        };
        p._applyFilter = function(imageData) {
          return true;
        };
        createjs.Filter = Filter;
      })();
    }
  });

  // ../src/easeljs/geom/DisplayProps.js
  var require_DisplayProps = __commonJS({
    "../src/easeljs/geom/DisplayProps.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function DisplayProps(visible, alpha, shadow, compositeOperation, matrix) {
          this.setValues(visible, alpha, shadow, compositeOperation, matrix);
        }
        var p = DisplayProps.prototype;
        p.setValues = function(visible, alpha, shadow, compositeOperation, matrix) {
          this.visible = visible == null ? true : !!visible;
          this.alpha = alpha == null ? 1 : alpha;
          this.shadow = shadow;
          this.compositeOperation = compositeOperation;
          this.matrix = matrix || this.matrix && this.matrix.identity() || new createjs.Matrix2D();
          return this;
        };
        p.append = function(visible, alpha, shadow, compositeOperation, matrix) {
          this.alpha *= alpha;
          this.shadow = shadow || this.shadow;
          this.compositeOperation = compositeOperation || this.compositeOperation;
          this.visible = this.visible && visible;
          matrix && this.matrix.appendMatrix(matrix);
          return this;
        };
        p.prepend = function(visible, alpha, shadow, compositeOperation, matrix) {
          this.alpha *= alpha;
          this.shadow = this.shadow || shadow;
          this.compositeOperation = this.compositeOperation || compositeOperation;
          this.visible = this.visible && visible;
          matrix && this.matrix.prependMatrix(matrix);
          return this;
        };
        p.identity = function() {
          this.visible = true;
          this.alpha = 1;
          this.shadow = this.compositeOperation = null;
          this.matrix.identity();
          return this;
        };
        p.clone = function() {
          return new DisplayProps(this.alpha, this.shadow, this.compositeOperation, this.visible, this.matrix.clone());
        };
        createjs.DisplayProps = DisplayProps;
      })();
    }
  });

  // ../src/easeljs/geom/Matrix2D.js
  var require_Matrix2D = __commonJS({
    "../src/easeljs/geom/Matrix2D.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Matrix2D(a, b, c, d, tx, ty) {
          this.setValues(a, b, c, d, tx, ty);
        }
        var p = Matrix2D.prototype;
        Matrix2D.DEG_TO_RAD = Math.PI / 180;
        Matrix2D.identity = null;
        p.setValues = function(a, b, c, d, tx, ty) {
          this.a = a == null ? 1 : a;
          this.b = b || 0;
          this.c = c || 0;
          this.d = d == null ? 1 : d;
          this.tx = tx || 0;
          this.ty = ty || 0;
          return this;
        };
        p.append = function(a, b, c, d, tx, ty) {
          var a1 = this.a;
          var b1 = this.b;
          var c1 = this.c;
          var d1 = this.d;
          if (a != 1 || b != 0 || c != 0 || d != 1) {
            this.a = a1 * a + c1 * b;
            this.b = b1 * a + d1 * b;
            this.c = a1 * c + c1 * d;
            this.d = b1 * c + d1 * d;
          }
          this.tx = a1 * tx + c1 * ty + this.tx;
          this.ty = b1 * tx + d1 * ty + this.ty;
          return this;
        };
        p.prepend = function(a, b, c, d, tx, ty) {
          var a1 = this.a;
          var c1 = this.c;
          var tx1 = this.tx;
          this.a = a * a1 + c * this.b;
          this.b = b * a1 + d * this.b;
          this.c = a * c1 + c * this.d;
          this.d = b * c1 + d * this.d;
          this.tx = a * tx1 + c * this.ty + tx;
          this.ty = b * tx1 + d * this.ty + ty;
          return this;
        };
        p.appendMatrix = function(matrix) {
          return this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        p.prependMatrix = function(matrix) {
          return this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        p.appendTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
          if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
          } else {
            cos = 1;
            sin = 0;
          }
          if (skewX || skewY) {
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
          } else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
          }
          if (regX || regY) {
            this.tx -= regX * this.a + regY * this.c;
            this.ty -= regX * this.b + regY * this.d;
          }
          return this;
        };
        p.prependTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
          if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
          } else {
            cos = 1;
            sin = 0;
          }
          if (regX || regY) {
            this.tx -= regX;
            this.ty -= regY;
          }
          if (skewX || skewY) {
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
          } else {
            this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
          }
          return this;
        };
        p.rotate = function(angle) {
          angle = angle * Matrix2D.DEG_TO_RAD;
          var cos = Math.cos(angle);
          var sin = Math.sin(angle);
          var a1 = this.a;
          var b1 = this.b;
          this.a = a1 * cos + this.c * sin;
          this.b = b1 * cos + this.d * sin;
          this.c = -a1 * sin + this.c * cos;
          this.d = -b1 * sin + this.d * cos;
          return this;
        };
        p.skew = function(skewX, skewY) {
          skewX = skewX * Matrix2D.DEG_TO_RAD;
          skewY = skewY * Matrix2D.DEG_TO_RAD;
          this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
          return this;
        };
        p.scale = function(x, y) {
          this.a *= x;
          this.b *= x;
          this.c *= y;
          this.d *= y;
          return this;
        };
        p.translate = function(x, y) {
          this.tx += this.a * x + this.c * y;
          this.ty += this.b * x + this.d * y;
          return this;
        };
        p.identity = function() {
          this.a = this.d = 1;
          this.b = this.c = this.tx = this.ty = 0;
          return this;
        };
        p.invert = function() {
          var a1 = this.a;
          var b1 = this.b;
          var c1 = this.c;
          var d1 = this.d;
          var tx1 = this.tx;
          var n = a1 * d1 - b1 * c1;
          this.a = d1 / n;
          this.b = -b1 / n;
          this.c = -c1 / n;
          this.d = a1 / n;
          this.tx = (c1 * this.ty - d1 * tx1) / n;
          this.ty = -(a1 * this.ty - b1 * tx1) / n;
          return this;
        };
        p.isIdentity = function() {
          return this.tx === 0 && this.ty === 0 && this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1;
        };
        p.equals = function(matrix) {
          return this.tx === matrix.tx && this.ty === matrix.ty && this.a === matrix.a && this.b === matrix.b && this.c === matrix.c && this.d === matrix.d;
        };
        p.transformPoint = function(x, y, pt) {
          pt = pt || {};
          pt.x = x * this.a + y * this.c + this.tx;
          pt.y = x * this.b + y * this.d + this.ty;
          return pt;
        };
        p.decompose = function(target) {
          if (target == null) {
            target = {};
          }
          target.x = this.tx;
          target.y = this.ty;
          target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
          target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);
          var skewX = Math.atan2(-this.c, this.d);
          var skewY = Math.atan2(this.b, this.a);
          var delta = Math.abs(1 - skewX / skewY);
          if (delta < 1e-5) {
            target.rotation = skewY / Matrix2D.DEG_TO_RAD;
            if (this.a < 0 && this.d >= 0) {
              target.rotation += target.rotation <= 0 ? 180 : -180;
            }
            target.skewX = target.skewY = 0;
          } else {
            target.skewX = skewX / Matrix2D.DEG_TO_RAD;
            target.skewY = skewY / Matrix2D.DEG_TO_RAD;
          }
          return target;
        };
        p.copy = function(matrix) {
          return this.setValues(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        };
        p.clone = function() {
          return new Matrix2D(this.a, this.b, this.c, this.d, this.tx, this.ty);
        };
        p.toString = function() {
          return "[Matrix2D (a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + ")]";
        };
        Matrix2D.identity = new Matrix2D();
        createjs.Matrix2D = Matrix2D;
      })();
    }
  });

  // ../src/easeljs/geom/Point.js
  var require_Point = __commonJS({
    "../src/easeljs/geom/Point.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Point(x, y) {
          this.setValues(x, y);
        }
        var p = Point.prototype;
        p.setValues = function(x, y) {
          this.x = x || 0;
          this.y = y || 0;
          return this;
        };
        p.offset = function(dx, dy) {
          this.x += dx;
          this.y += dy;
          return this;
        };
        Point.polar = function(len, angle, pt) {
          pt = pt || new Point();
          pt.x = len * Math.cos(angle);
          pt.y = len * Math.sin(angle);
          return pt;
        };
        Point.interpolate = function(pt1, pt2, f, pt) {
          pt = pt || new Point();
          pt.x = pt2.x + f * (pt1.x - pt2.x);
          pt.y = pt2.y + f * (pt1.y - pt2.y);
          return pt;
        };
        p.copy = function(point) {
          this.x = point.x;
          this.y = point.y;
          return this;
        };
        p.clone = function() {
          return new Point(this.x, this.y);
        };
        p.toString = function() {
          return "[Point (x=" + this.x + " y=" + this.y + ")]";
        };
        createjs.Point = Point;
      })();
    }
  });

  // ../src/easeljs/geom/Rectangle.js
  var require_Rectangle = __commonJS({
    "../src/easeljs/geom/Rectangle.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Rectangle(x, y, width, height) {
          this.setValues(x, y, width, height);
        }
        var p = Rectangle.prototype;
        p.setValues = function(x, y, width, height) {
          this.x = x || 0;
          this.y = y || 0;
          this.width = width || 0;
          this.height = height || 0;
          return this;
        };
        p.extend = function(x, y, width, height) {
          width = width || 0;
          height = height || 0;
          if (x + width > this.x + this.width) {
            this.width = x + width - this.x;
          }
          if (y + height > this.y + this.height) {
            this.height = y + height - this.y;
          }
          if (x < this.x) {
            this.width += this.x - x;
            this.x = x;
          }
          if (y < this.y) {
            this.height += this.y - y;
            this.y = y;
          }
          return this;
        };
        p.pad = function(top, left, bottom, right) {
          this.x -= left;
          this.y -= top;
          this.width += left + right;
          this.height += top + bottom;
          return this;
        };
        p.copy = function(rectangle) {
          return this.setValues(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        };
        p.contains = function(x, y, width, height) {
          width = width || 0;
          height = height || 0;
          return x >= this.x && x + width <= this.x + this.width && y >= this.y && y + height <= this.y + this.height;
        };
        p.union = function(rect) {
          return this.clone().extend(rect.x, rect.y, rect.width, rect.height);
        };
        p.intersection = function(rect) {
          var x1 = rect.x, y1 = rect.y, x2 = x1 + rect.width, y2 = y1 + rect.height;
          if (this.x > x1) {
            x1 = this.x;
          }
          if (this.y > y1) {
            y1 = this.y;
          }
          if (this.x + this.width < x2) {
            x2 = this.x + this.width;
          }
          if (this.y + this.height < y2) {
            y2 = this.y + this.height;
          }
          return x2 <= x1 || y2 <= y1 ? null : new Rectangle(x1, y1, x2 - x1, y2 - y1);
        };
        p.intersects = function(rect) {
          return rect.x <= this.x + this.width && this.x <= rect.x + rect.width && rect.y <= this.y + this.height && this.y <= rect.y + rect.height;
        };
        p.isEmpty = function() {
          return this.width <= 0 || this.height <= 0;
        };
        p.clone = function() {
          return new Rectangle(this.x, this.y, this.width, this.height);
        };
        p.toString = function() {
          return "[Rectangle (x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + ")]";
        };
        createjs.Rectangle = Rectangle;
      })();
    }
  });

  // ../src/easeljs/ui/ButtonHelper.js
  var require_ButtonHelper = __commonJS({
    "../src/easeljs/ui/ButtonHelper.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function ButtonHelper(target, outLabel, overLabel, downLabel, play, hitArea, hitLabel) {
          if (!target.addEventListener) {
            return;
          }
          this.target = target;
          this.overLabel = overLabel == null ? "over" : overLabel;
          this.outLabel = outLabel == null ? "out" : outLabel;
          this.downLabel = downLabel == null ? "down" : downLabel;
          this.play = play;
          this._isPressed = false;
          this._isOver = false;
          this._enabled = false;
          target.mouseChildren = false;
          this.enabled = true;
          this.handleEvent({});
          if (hitArea) {
            if (hitLabel) {
              hitArea.actionsEnabled = false;
              hitArea.gotoAndStop && hitArea.gotoAndStop(hitLabel);
            }
            target.hitArea = hitArea;
          }
        }
        var p = ButtonHelper.prototype;
        p._setEnabled = function(value) {
          if (value == this._enabled) {
            return;
          }
          var o = this.target;
          this._enabled = value;
          if (value) {
            o.cursor = "pointer";
            o.addEventListener("rollover", this);
            o.addEventListener("rollout", this);
            o.addEventListener("mousedown", this);
            o.addEventListener("pressup", this);
            if (o._reset) {
              o.__reset = o._reset;
              o._reset = this._reset;
            }
          } else {
            o.cursor = null;
            o.removeEventListener("rollover", this);
            o.removeEventListener("rollout", this);
            o.removeEventListener("mousedown", this);
            o.removeEventListener("pressup", this);
            if (o.__reset) {
              o._reset = o.__reset;
              delete o.__reset;
            }
          }
        };
        p.setEnabled = createjs.deprecate(p._setEnabled, "ButtonHelper.setEnabled");
        p._getEnabled = function() {
          return this._enabled;
        };
        p.getEnabled = createjs.deprecate(p._getEnabled, "ButtonHelper.getEnabled");
        try {
          Object.defineProperties(p, {
            enabled: { get: p._getEnabled, set: p._setEnabled }
          });
        } catch (e) {
        }
        p.toString = function() {
          return "[ButtonHelper]";
        };
        p.handleEvent = function(evt) {
          var label, t = this.target, type = evt.type;
          if (type == "mousedown") {
            this._isPressed = true;
            label = this.downLabel;
          } else if (type == "pressup") {
            this._isPressed = false;
            label = this._isOver ? this.overLabel : this.outLabel;
          } else if (type == "rollover") {
            this._isOver = true;
            label = this._isPressed ? this.downLabel : this.overLabel;
          } else {
            this._isOver = false;
            label = this._isPressed ? this.overLabel : this.outLabel;
          }
          if (this.play) {
            t.gotoAndPlay && t.gotoAndPlay(label);
          } else {
            t.gotoAndStop && t.gotoAndStop(label);
          }
        };
        p._reset = function() {
          var p2 = this.paused;
          this.__reset();
          this.paused = p2;
        };
        createjs.ButtonHelper = ButtonHelper;
      })();
    }
  });

  // ../src/easeljs/ui/Touch.js
  var require_Touch = __commonJS({
    "../src/easeljs/ui/Touch.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function Touch() {
          throw "Touch cannot be instantiated";
        }
        Touch.isSupported = function() {
          return !!("ontouchstart" in window || window.MSPointerEvent && window.navigator.msMaxTouchPoints > 0 || window.PointerEvent && window.navigator.maxTouchPoints > 0);
        };
        Touch.enable = function(stage2, singleTouch, allowDefault) {
          if (!stage2 || !stage2.canvas || !Touch.isSupported()) {
            return false;
          }
          if (stage2.__touch) {
            return true;
          }
          stage2.__touch = { pointers: {}, multitouch: !singleTouch, preventDefault: !allowDefault, count: 0 };
          if ("ontouchstart" in window) {
            Touch._IOS_enable(stage2);
          } else if (window.PointerEvent || window.MSPointerEvent) {
            Touch._IE_enable(stage2);
          }
          return true;
        };
        Touch.disable = function(stage2) {
          if (!stage2) {
            return;
          }
          if ("ontouchstart" in window) {
            Touch._IOS_disable(stage2);
          } else if (window.PointerEvent || window.MSPointerEvent) {
            Touch._IE_disable(stage2);
          }
          delete stage2.__touch;
        };
        Touch._IOS_enable = function(stage2) {
          var canvas = stage2.canvas;
          var f = stage2.__touch.f = function(e) {
            Touch._IOS_handleEvent(stage2, e);
          };
          canvas.addEventListener("touchstart", f, false);
          canvas.addEventListener("touchmove", f, false);
          canvas.addEventListener("touchend", f, false);
          canvas.addEventListener("touchcancel", f, false);
        };
        Touch._IOS_disable = function(stage2) {
          var canvas = stage2.canvas;
          if (!canvas) {
            return;
          }
          var f = stage2.__touch.f;
          canvas.removeEventListener("touchstart", f, false);
          canvas.removeEventListener("touchmove", f, false);
          canvas.removeEventListener("touchend", f, false);
          canvas.removeEventListener("touchcancel", f, false);
        };
        Touch._IOS_handleEvent = function(stage2, e) {
          if (!stage2) {
            return;
          }
          if (stage2.__touch.preventDefault) {
            e.preventDefault && e.preventDefault();
          }
          var touches = e.changedTouches;
          var type = e.type;
          for (var i = 0, l = touches.length; i < l; i++) {
            var touch = touches[i];
            var id = touch.identifier;
            if (touch.target != stage2.canvas) {
              continue;
            }
            if (type === "touchstart") {
              this._handleStart(stage2, id, e, touch.pageX, touch.pageY);
            } else if (type === "touchmove") {
              this._handleMove(stage2, id, e, touch.pageX, touch.pageY);
            } else if (type === "touchend" || type === "touchcancel") {
              this._handleEnd(stage2, id, e);
            }
          }
        };
        Touch._IE_enable = function(stage2) {
          var canvas = stage2.canvas;
          var f = stage2.__touch.f = function(e) {
            Touch._IE_handleEvent(stage2, e);
          };
          if (window.PointerEvent === void 0) {
            canvas.addEventListener("MSPointerDown", f, false);
            window.addEventListener("MSPointerMove", f, false);
            window.addEventListener("MSPointerUp", f, false);
            window.addEventListener("MSPointerCancel", f, false);
            if (stage2.__touch.preventDefault) {
              canvas.style.msTouchAction = "none";
            }
          } else {
            canvas.addEventListener("pointerdown", f, false);
            window.addEventListener("pointermove", f, false);
            window.addEventListener("pointerup", f, false);
            window.addEventListener("pointercancel", f, false);
            if (stage2.__touch.preventDefault) {
              canvas.style.touchAction = "none";
            }
          }
          stage2.__touch.activeIDs = {};
        };
        Touch._IE_disable = function(stage2) {
          var f = stage2.__touch.f;
          if (window.PointerEvent === void 0) {
            window.removeEventListener("MSPointerMove", f, false);
            window.removeEventListener("MSPointerUp", f, false);
            window.removeEventListener("MSPointerCancel", f, false);
            if (stage2.canvas) {
              stage2.canvas.removeEventListener("MSPointerDown", f, false);
            }
          } else {
            window.removeEventListener("pointermove", f, false);
            window.removeEventListener("pointerup", f, false);
            window.removeEventListener("pointercancel", f, false);
            if (stage2.canvas) {
              stage2.canvas.removeEventListener("pointerdown", f, false);
            }
          }
        };
        Touch._IE_handleEvent = function(stage2, e) {
          if (!stage2) {
            return;
          }
          if (stage2.__touch.preventDefault) {
            e.preventDefault && e.preventDefault();
          }
          var type = e.type;
          var id = e.pointerId;
          var ids = stage2.__touch.activeIDs;
          if (type === "MSPointerDown" || type === "pointerdown") {
            if (e.srcElement != stage2.canvas) {
              return;
            }
            ids[id] = true;
            this._handleStart(stage2, id, e, e.pageX, e.pageY);
          } else if (ids[id]) {
            if (type === "MSPointerMove" || type === "pointermove") {
              this._handleMove(stage2, id, e, e.pageX, e.pageY);
            } else if (type === "MSPointerUp" || type === "MSPointerCancel" || type === "pointerup" || type === "pointercancel") {
              delete ids[id];
              this._handleEnd(stage2, id, e);
            }
          }
        };
        Touch._handleStart = function(stage2, id, e, x, y) {
          var props = stage2.__touch;
          if (!props.multitouch && props.count) {
            return;
          }
          var ids = props.pointers;
          if (ids[id]) {
            return;
          }
          ids[id] = true;
          props.count++;
          stage2._handlePointerDown(id, e, x, y);
        };
        Touch._handleMove = function(stage2, id, e, x, y) {
          if (!stage2.__touch.pointers[id]) {
            return;
          }
          stage2._handlePointerMove(id, e, x, y);
        };
        Touch._handleEnd = function(stage2, id, e) {
          var props = stage2.__touch;
          var ids = props.pointers;
          if (!ids[id]) {
            return;
          }
          props.count--;
          stage2._handlePointerUp(id, e, true);
          delete ids[id];
        };
        createjs.Touch = Touch;
      })();
    }
  });

  // ../src/easeljs/utils/SpriteSheetBuilder.js
  var require_SpriteSheetBuilder = __commonJS({
    "../src/easeljs/utils/SpriteSheetBuilder.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function SpriteSheetBuilder(framerate) {
          this.EventDispatcher_constructor();
          this.maxWidth = 2048;
          this.maxHeight = 2048;
          this.spriteSheet = null;
          this.scale = 1;
          this.padding = 1;
          this.timeSlice = 0.3;
          this.progress = -1;
          this.framerate = framerate || 0;
          this._frames = [];
          this._animations = {};
          this._data = null;
          this._nextFrameIndex = 0;
          this._index = 0;
          this._timerID = null;
          this._scale = 1;
        }
        var p = createjs.extend(SpriteSheetBuilder, createjs.EventDispatcher);
        SpriteSheetBuilder.ERR_DIMENSIONS = "frame dimensions exceed max spritesheet dimensions";
        SpriteSheetBuilder.ERR_RUNNING = "a build is already running";
        p.addFrame = function(source, sourceRect, scale, setupFunction, setupData) {
          if (this._data) {
            throw SpriteSheetBuilder.ERR_RUNNING;
          }
          var rect = sourceRect || source.bounds || source.nominalBounds;
          if (!rect && source.getBounds) {
            rect = source.getBounds();
          }
          if (!rect) {
            return null;
          }
          scale = scale || 1;
          return this._frames.push({ source, sourceRect: rect, scale, funct: setupFunction, data: setupData, index: this._frames.length, height: rect.height * scale }) - 1;
        };
        p.addAnimation = function(name, frames, next, speed) {
          if (this._data) {
            throw SpriteSheetBuilder.ERR_RUNNING;
          }
          this._animations[name] = { frames, next, speed };
        };
        p.addMovieClip = function(source, sourceRect, scale, setupFunction, setupData, labelFunction) {
          if (this._data) {
            throw SpriteSheetBuilder.ERR_RUNNING;
          }
          var rects = source.frameBounds;
          var rect = sourceRect || source.bounds || source.nominalBounds;
          if (!rect && source.getBounds) {
            rect = source.getBounds();
          }
          if (!rect && !rects) {
            return;
          }
          var i, l, baseFrameIndex = this._frames.length;
          var duration = source.timeline.duration;
          for (i = 0; i < duration; i++) {
            var r = rects && rects[i] ? rects[i] : rect;
            this.addFrame(source, r, scale, this._setupMovieClipFrame, { i, f: setupFunction, d: setupData });
          }
          var labels = source.timeline._labels;
          var lbls = [];
          for (var n in labels) {
            lbls.push({ index: labels[n], label: n });
          }
          if (lbls.length) {
            lbls.sort(function(a, b) {
              return a.index - b.index;
            });
            for (i = 0, l = lbls.length; i < l; i++) {
              var label = lbls[i].label;
              var start = baseFrameIndex + lbls[i].index;
              var end = baseFrameIndex + (i == l - 1 ? duration : lbls[i + 1].index);
              var frames = [];
              for (var j = start; j < end; j++) {
                frames.push(j);
              }
              if (labelFunction) {
                label = labelFunction(label, source, start, end);
                if (!label) {
                  continue;
                }
              }
              this.addAnimation(label, frames, true);
            }
          }
        };
        p.build = function() {
          if (this._data) {
            throw SpriteSheetBuilder.ERR_RUNNING;
          }
          this._startBuild();
          while (this._drawNext()) {
          }
          this._endBuild();
          return this.spriteSheet;
        };
        p.buildAsync = function(timeSlice) {
          if (this._data) {
            throw SpriteSheetBuilder.ERR_RUNNING;
          }
          this.timeSlice = timeSlice;
          this._startBuild();
          var _this = this;
          this._timerID = setTimeout(function() {
            _this._run();
          }, 50 - Math.max(0.01, Math.min(0.99, this.timeSlice || 0.3)) * 50);
        };
        p.stopAsync = function() {
          clearTimeout(this._timerID);
          this._data = null;
        };
        p.clone = function() {
          throw "SpriteSheetBuilder cannot be cloned.";
        };
        p.toString = function() {
          return "[SpriteSheetBuilder]";
        };
        p._startBuild = function() {
          var pad = this.padding || 0;
          this.progress = 0;
          this.spriteSheet = null;
          this._index = 0;
          this._scale = this.scale;
          var dataFrames = [];
          this._data = {
            images: [],
            frames: dataFrames,
            framerate: this.framerate,
            animations: this._animations
            // TODO: should we "clone" _animations in case someone adds more animations after a build?
          };
          var frames = this._frames.slice();
          frames.sort(function(a, b) {
            return a.height <= b.height ? -1 : 1;
          });
          if (frames[frames.length - 1].height + pad * 2 > this.maxHeight) {
            throw SpriteSheetBuilder.ERR_DIMENSIONS;
          }
          var y = 0, x = 0;
          var img = 0;
          while (frames.length) {
            var o = this._fillRow(frames, y, img, dataFrames, pad);
            if (o.w > x) {
              x = o.w;
            }
            y += o.h;
            if (!o.h || !frames.length) {
              var canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
              canvas.width = this._getSize(x, this.maxWidth);
              canvas.height = this._getSize(y, this.maxHeight);
              this._data.images[img] = canvas;
              if (!o.h) {
                x = y = 0;
                img++;
              }
            }
          }
        };
        p._setupMovieClipFrame = function(source, data) {
          var ae = source.actionsEnabled;
          source.actionsEnabled = false;
          source.gotoAndStop(data.i);
          source.actionsEnabled = ae;
          data.f && data.f(source, data.d, data.i);
        };
        p._getSize = function(size, max) {
          var pow = 4;
          while (Math.pow(2, ++pow) < size) {
          }
          return Math.min(max, Math.pow(2, pow));
        };
        p._fillRow = function(frames, y, img, dataFrames, pad) {
          var w = this.maxWidth;
          var maxH = this.maxHeight;
          y += pad;
          var h = maxH - y;
          var x = pad;
          var height = 0;
          for (var i = frames.length - 1; i >= 0; i--) {
            var frame = frames[i];
            var sc = this._scale * frame.scale;
            var rect = frame.sourceRect;
            var source = frame.source;
            var rx = Math.floor(sc * rect.x - pad);
            var ry = Math.floor(sc * rect.y - pad);
            var rh = Math.ceil(sc * rect.height + pad * 2);
            var rw = Math.ceil(sc * rect.width + pad * 2);
            if (rw > w) {
              throw SpriteSheetBuilder.ERR_DIMENSIONS;
            }
            if (rh > h || x + rw > w) {
              continue;
            }
            frame.img = img;
            frame.rect = new createjs.Rectangle(x, y, rw, rh);
            height = height || rh;
            frames.splice(i, 1);
            dataFrames[frame.index] = [x, y, rw, rh, img, Math.round(-rx + sc * source.regX - pad), Math.round(-ry + sc * source.regY - pad)];
            x += rw;
          }
          return { w: x, h: height };
        };
        p._endBuild = function() {
          this.spriteSheet = new createjs.SpriteSheet(this._data);
          this._data = null;
          this.progress = 1;
          this.dispatchEvent("complete");
        };
        p._run = function() {
          var ts = Math.max(0.01, Math.min(0.99, this.timeSlice || 0.3)) * 50;
          var t = (/* @__PURE__ */ new Date()).getTime() + ts;
          var complete = false;
          while (t > (/* @__PURE__ */ new Date()).getTime()) {
            if (!this._drawNext()) {
              complete = true;
              break;
            }
          }
          if (complete) {
            this._endBuild();
          } else {
            var _this = this;
            this._timerID = setTimeout(function() {
              _this._run();
            }, 50 - ts);
          }
          var p2 = this.progress = this._index / this._frames.length;
          if (this.hasEventListener("progress")) {
            var evt = new createjs.Event("progress");
            evt.progress = p2;
            this.dispatchEvent(evt);
          }
        };
        p._drawNext = function() {
          var frame = this._frames[this._index];
          var sc = frame.scale * this._scale;
          var rect = frame.rect;
          var sourceRect = frame.sourceRect;
          var canvas = this._data.images[frame.img];
          var ctx = canvas.getContext("2d");
          frame.funct && frame.funct(frame.source, frame.data);
          ctx.save();
          ctx.beginPath();
          ctx.rect(rect.x, rect.y, rect.width, rect.height);
          ctx.clip();
          ctx.translate(Math.ceil(rect.x - sourceRect.x * sc), Math.ceil(rect.y - sourceRect.y * sc));
          ctx.scale(sc, sc);
          frame.source.draw(ctx);
          ctx.restore();
          return ++this._index < this._frames.length;
        };
        createjs.SpriteSheetBuilder = createjs.promote(SpriteSheetBuilder, "EventDispatcher");
      })();
    }
  });

  // ../src/easeljs/utils/SpriteSheetUtils.js
  var require_SpriteSheetUtils = __commonJS({
    "../src/easeljs/utils/SpriteSheetUtils.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function SpriteSheetUtils() {
          throw "SpriteSheetUtils cannot be instantiated";
        }
        var canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
        if (canvas.getContext) {
          SpriteSheetUtils._workingCanvas = canvas;
          SpriteSheetUtils._workingContext = canvas.getContext("2d");
          canvas.width = canvas.height = 1;
        }
        SpriteSheetUtils.extractFrame = function(spriteSheet, frameOrAnimation) {
          if (isNaN(frameOrAnimation)) {
            frameOrAnimation = spriteSheet.getAnimation(frameOrAnimation).frames[0];
          }
          var data = spriteSheet.getFrame(frameOrAnimation);
          if (!data) {
            return null;
          }
          var r = data.rect;
          var canvas2 = SpriteSheetUtils._workingCanvas;
          canvas2.width = r.width;
          canvas2.height = r.height;
          SpriteSheetUtils._workingContext.drawImage(data.image, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height);
          var img = document.createElement("img");
          img.src = canvas2.toDataURL("image/png");
          return img;
        };
        SpriteSheetUtils.addFlippedFrames = createjs.deprecate(null, "SpriteSheetUtils.addFlippedFrames");
        SpriteSheetUtils.mergeAlpha = createjs.deprecate(null, "SpriteSheetUtils.mergeAlpha");
        SpriteSheetUtils._flip = function(spriteSheet, count, h, v) {
          var imgs = spriteSheet._images;
          var canvas2 = SpriteSheetUtils._workingCanvas;
          var ctx = SpriteSheetUtils._workingContext;
          var il = imgs.length / count;
          for (var i = 0; i < il; i++) {
            var src = imgs[i];
            src.__tmp = i;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas2.width + 1, canvas2.height + 1);
            canvas2.width = src.width;
            canvas2.height = src.height;
            ctx.setTransform(h ? -1 : 1, 0, 0, v ? -1 : 1, h ? src.width : 0, v ? src.height : 0);
            ctx.drawImage(src, 0, 0);
            var img = document.createElement("img");
            img.src = canvas2.toDataURL("image/png");
            img.width = src.width || src.naturalWidth;
            img.height = src.height || src.naturalHeight;
            imgs.push(img);
          }
          var frames = spriteSheet._frames;
          var fl = frames.length / count;
          for (i = 0; i < fl; i++) {
            src = frames[i];
            var rect = src.rect.clone();
            img = imgs[src.image.__tmp + il * count];
            var frame = { image: img, rect, regX: src.regX, regY: src.regY };
            if (h) {
              rect.x = (img.width || img.naturalWidth) - rect.x - rect.width;
              frame.regX = rect.width - src.regX;
            }
            if (v) {
              rect.y = (img.height || img.naturalHeight) - rect.y - rect.height;
              frame.regY = rect.height - src.regY;
            }
            frames.push(frame);
          }
          var sfx = "_" + (h ? "h" : "") + (v ? "v" : "");
          var names = spriteSheet._animations;
          var data = spriteSheet._data;
          var al = names.length / count;
          for (i = 0; i < al; i++) {
            var name = names[i];
            src = data[name];
            var anim = { name: name + sfx, speed: src.speed, next: src.next, frames: [] };
            if (src.next) {
              anim.next += sfx;
            }
            frames = src.frames;
            for (var j = 0, l = frames.length; j < l; j++) {
              anim.frames.push(frames[j] + fl * count);
            }
            data[anim.name] = anim;
            names.push(anim.name);
          }
        };
        createjs.SpriteSheetUtils = SpriteSheetUtils;
      })();
    }
  });

  // ../src/easeljs/utils/UID.js
  var require_UID = __commonJS({
    "../src/easeljs/utils/UID.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function UID() {
          throw "UID cannot be instantiated";
        }
        UID._nextID = 0;
        UID.get = function() {
          return UID._nextID++;
        };
        createjs.UID = UID;
      })();
    }
  });

  // ../src/easeljs/utils/VideoBuffer.js
  var require_VideoBuffer = __commonJS({
    "../src/easeljs/utils/VideoBuffer.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function VideoBuffer(video) {
          this.readyState = video.readyState;
          this._video = video;
          this._canvas = null;
          this._lastTime = -1;
          if (this.readyState < 2) {
            video.addEventListener("canplaythrough", this._videoReady.bind(this));
          }
        }
        var p = VideoBuffer.prototype;
        p.getImage = function() {
          if (this.readyState < 2) {
            return;
          }
          var canvas = this._canvas, video = this._video;
          if (!canvas) {
            canvas = this._canvas = createjs.createCanvas ? createjs.createCanvas() : document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
          if (video.readyState >= 2 && video.currentTime !== this._lastTime) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            this._lastTime = video.currentTime;
          }
          return canvas;
        };
        p._videoReady = function() {
          this.readyState = 2;
        };
        createjs.VideoBuffer = VideoBuffer;
      })();
    }
  });

  // ../src/easeljs/utils/WebGLInspector.js
  var require_WebGLInspector = __commonJS({
    "../src/easeljs/utils/WebGLInspector.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        function WebGLInspector(stage2) {
        }
        var p = createjs.extend(WebGLInspector, createjs.EventDispatcher);
        WebGLInspector.alternateOutput = void 0;
        WebGLInspector.stage = void 0;
        WebGLInspector.log = function() {
          (WebGLInspector.alternateOutput ? WebGLInspector.alternateOutput.log : console.log).apply(this, arguments);
        };
        WebGLInspector.logAll = function(stage2) {
          if (!stage2) {
            stage2 = WebGLInspector.stage;
          }
          WebGLInspector.log("Average batches Per Draw", (stage2._batchID / stage2._drawID).toFixed(4));
          WebGLInspector.logContextInfo(stage2._webGLContext);
          WebGLInspector.logDepth(stage2.children, "");
          WebGLInspector.logTextureFill(stage2);
        };
        WebGLInspector.replaceRenderBatchCall = function(stage2, newFunc) {
          if (!stage2) {
            stage2 = WebGLInspector.stage;
          }
          if (newFunc === void 0 && stage2._renderBatch_) {
            stage2._renderBatch = stage2._renderBatch_;
            stage2._renderBatch_ = void 0;
          } else {
            if (stage2._renderBatch_ === void 0) {
              stage2._renderBatch_ = stage2._renderBatch;
            }
            stage2._renderBatch = newFunc;
          }
        };
        WebGLInspector.replaceRenderCoverCall = function(stage2, newFunc) {
          if (!stage2) {
            stage2 = WebGLInspector.stage;
          }
          if (newFunc === void 0 && stage2._renderCover_) {
            stage2._renderCover = stage2._renderCover_;
            stage2._renderCover_ = void 0;
          } else {
            if (stage2._renderCover_ === void 0) {
              stage2._renderCover_ = stage2._renderCover;
            }
            stage2._renderCover = newFunc;
          }
        };
        WebGLInspector.logDepth = function(children, prepend, customLog) {
          if (!children) {
            children = WebGLInspector.stage.children;
          }
          if (!prepend) {
            prepend = "";
          }
          var l = children.length;
          for (var i = 0; i < l; i++) {
            var child = children[i];
            (customLog !== void 0 ? customLog : WebGLInspector.log)(prepend + "-", child);
            if (child.children && child.children.length) {
              WebGLInspector.logDepth(child.children, "|" + prepend, customLog);
            }
          }
        };
        WebGLInspector.logContextInfo = function(gl) {
          if (!gl) {
            gl = WebGLInspector.stage._webGLContext;
          }
          var data = "== LOG:\n";
          data += "Max textures per draw: " + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS) + "\n";
          data += "Max textures active: " + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS) + "\n";
          data += "\n";
          data += "Max texture size: " + gl.getParameter(gl.MAX_TEXTURE_SIZE) / 2 + "^2 \n";
          data += "Max cache size: " + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) / 2 + "^2 \n";
          data += "\n";
          data += "Max attributes per vertex: " + gl.getParameter(gl.MAX_VERTEX_ATTRIBS) + "\n";
          data += "WebGL Version string: " + gl.getParameter(gl.VERSION) + "\n";
          data += "======";
          WebGLInspector.log(data);
        };
        WebGLInspector.logTextureFill = function(stage2) {
          if (!stage2) {
            stage2 = WebGLInspector.stage;
          }
          var dict = stage2._textureDictionary;
          var count = stage2._batchTextureCount;
          WebGLInspector.log("textureMax:", count);
          var output = [];
          for (var n in dict) {
            var str = n.replace(window.location.origin, "");
            var tex = dict[n];
            var shifted = tex._lastActiveIndex ? tex._lastActiveIndex === tex._activeIndex : false;
            output.push({ src: str, element: tex, shifted });
            tex._lastActiveIndex = tex._activeIndex;
          }
          output.sort(function(a, b) {
            if (a.element._drawID === stage2._drawID) {
              return 1;
            }
            if (a.element._drawID < b.element._drawID) {
              return -1;
            }
            return 0;
          });
          var l = output.length;
          for (var i = 0; i < l; i++) {
            var out = output[i];
            var active = out.element._drawID === stage2._drawID;
            WebGLInspector.log("[" + out.src + "] " + (active ? "ACTIVE" : "stale") + " " + (out.shifted ? "steady" : "DRIFT"), out.element);
          }
        };
        WebGLInspector.dispProps = function(prepend, item) {
          if (!prepend) {
            prepend = "";
          }
          var p2 = "	P:" + item.x.toFixed(2) + "x" + item.y.toFixed(2) + "	";
          var r = "	R:" + item.regX.toFixed(2) + "x" + item.regY.toFixed(2) + "	";
          WebGLInspector.log(prepend, item.toString() + "	", p2, r);
        };
        WebGLInspector.trackMaxBatchDraw = function() {
          var cardCount = this._batchVertexCount / createjs.StageGL.INDICIES_PER_CARD;
          if (!(cardCount < WebGLInspector.__lastHighest)) {
            WebGLInspector.__lastHighest = cardCount;
          }
          stage._renderBatch_();
        };
        WebGLInspector.drawEmptyBatch = function() {
          WebGLInspector.log("BlankBatch[" + this._drawID + ":" + this._batchID + "] : " + this.batchReason);
          this._batchVertexCount = 0;
          this._batchID++;
        };
        WebGLInspector.drawEmptyCover = function() {
          WebGLInspector.log("BlankCover[" + this._drawID + ":" + this._batchID + "] : " + this.batchReason);
          this._batchID++;
        };
        WebGLInspector.drawTexBuffer = function() {
          var gl = this._webGLContext;
          var texSize = 2048;
          var batchVertexCount = this._batchVertexCount;
          var projectionMatrix = this._projectionMatrix;
          var shader = this._activeShader;
          var vertices = this._vertices;
          var indices = this._indices;
          var uvs = this._uvs;
          var alphas = this._alphas;
          var reason = this.batchReason;
          if (this._inspectorFrame === void 0) {
            this._inspectorFrame = this.getRenderBufferTexture(texSize, texSize);
          } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, this._inspectorFrame._frameBuffer);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          this._activeShader = this._mainShader;
          gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
          gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          gl.viewport(0, 0, texSize, texSize);
          this._projectionMatrix = new Float32Array([2 / texSize, 0, 0, 0, 0, -2 / texSize, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);
          this._vertices = new Float32Array(this._batchTextureCount * 2 * createjs.StageGL.INDICIES_PER_CARD);
          this._indices = new Float32Array(this._batchTextureCount * 1 * createjs.StageGL.INDICIES_PER_CARD);
          this._uvs = new Float32Array(this._batchTextureCount * 2 * createjs.StageGL.INDICIES_PER_CARD);
          this._alphas = new Float32Array(this._batchTextureCount * 1 * createjs.StageGL.INDICIES_PER_CARD);
          this.batchReason = "LoadedTextureDebug";
          var squareBase = Math.ceil(Math.sqrt(this._batchTextureCount));
          for (var i = 0; i < this._batchTextureCount; i++) {
            var i1 = i * 6, i2 = i1 * 2;
            var row = i % squareBase, col = Math.floor(i / squareBase), size = 1 / squareBase * texSize;
            this._vertices[i2] = row * size;
            this._vertices[i2 + 1] = col * size;
            this._vertices[i2 + 2] = row * size;
            this._vertices[i2 + 3] = (col + 1) * size;
            this._vertices[i2 + 4] = (row + 1) * size;
            this._vertices[i2 + 5] = col * size;
            this._vertices[i2 + 6] = this._vertices[i2 + 2];
            this._vertices[i2 + 7] = this._vertices[i2 + 3];
            this._vertices[i2 + 8] = this._vertices[i2 + 4];
            this._vertices[i2 + 9] = this._vertices[i2 + 5];
            this._vertices[i2 + 10] = (row + 1) * size;
            this._vertices[i2 + 11] = (col + 1) * size;
            this._uvs[i2] = 0;
            this._uvs[i2 + 1] = 1;
            this._uvs[i2 + 2] = 0;
            this._uvs[i2 + 3] = 0;
            this._uvs[i2 + 4] = 1;
            this._uvs[i2 + 5] = 1;
            this._uvs[i2 + 6] = 0;
            this._uvs[i2 + 7] = 0;
            this._uvs[i2 + 8] = 1;
            this._uvs[i2 + 9] = 1;
            this._uvs[i2 + 10] = 1;
            this._uvs[i2 + 11] = 0;
            this._indices[i1] = this._indices[i1 + 1] = this._indices[i1 + 2] = this._indices[i1 + 3] = this._indices[i1 + 4] = this._indices[i1 + 5] = i;
            this._alphas[i1] = this._alphas[i1 + 1] = this._alphas[i1 + 2] = this._alphas[i1 + 3] = this._alphas[i1 + 4] = this._alphas[i1 + 5] = 1;
          }
          this._batchVertexCount = this._batchTextureCount * createjs.StageGL.INDICIES_PER_CARD;
          this._renderBatch_();
          this._batchID--;
          gl.bindFramebuffer(gl.FRAMEBUFFER, this._batchTextureOutput._frameBuffer);
          var shaderData = this._builtShaders[this._renderMode];
          gl.blendEquationSeparate(shaderData.eqRGB, shaderData.eqA);
          gl.blendFuncSeparate(shaderData.srcRGB, shaderData.dstRGB, shaderData.srcA, shaderData.dstA);
          gl.viewport(0, 0, this._viewportWidth, this._viewportHeight);
          this._activeShader = shader;
          this._batchVertexCount = batchVertexCount;
          this._projectionMatrix = projectionMatrix;
          this._vertices = vertices;
          this._indices = indices;
          this._uvs = uvs;
          this._alphas = alphas;
          this.batchReason = reason;
          this._renderBatch_();
        };
        createjs.WebGLInspector = createjs.promote(WebGLInspector, "EventDispatcher");
      })();
    }
  });

  // ../src/easeljs/version.js
  var require_version = __commonJS({
    "../src/easeljs/version.js"(exports) {
      exports.createjs = exports.createjs || {};
      (function() {
        "use strict";
        var s = createjs.EaselJS = createjs.EaselJS || {};
        s.version = /*=version*/
        "";
        s.buildDate = /*=date*/
        "";
      })();
    }
  });

  // bundle.js
  var import_Event = __toESM(require_Event());
  var import_EventDispatcher = __toESM(require_EventDispatcher());
  var import_deprecate = __toESM(require_deprecate());
  var import_extend = __toESM(require_extend());
  var import_indexOf = __toESM(require_indexOf());
  var import_promote = __toESM(require_promote());
  var import_Ticker = __toESM(require_Ticker());
  var import_Bitmap = __toESM(require_Bitmap());
  var import_BitmapText = __toESM(require_BitmapText());
  var import_Container = __toESM(require_Container());
  var import_DisplayObject = __toESM(require_DisplayObject());
  var import_DOMElement = __toESM(require_DOMElement());
  var import_Graphics = __toESM(require_Graphics());
  var import_MovieClip = __toESM(require_MovieClip());
  var import_Shadow = __toESM(require_Shadow());
  var import_Shape = __toESM(require_Shape());
  var import_Sprite = __toESM(require_Sprite());
  var import_SpriteSheet = __toESM(require_SpriteSheet());
  var import_Stage = __toESM(require_Stage());
  var import_StageGL = __toESM(require_StageGL());
  var import_Text = __toESM(require_Text());
  var import_MouseEvent = __toESM(require_MouseEvent());

  // ../src/easeljs/filters/AberrationFilter.js
  (function() {
    "use strict";
    function AberrationFilter(xDir, yDir, redMultiplier, greenMultiplier, blueMultiplier, originalMix, alphaMax) {
      this.Filter_constructor();
      this.xDir = Number(xDir) || 0;
      this.yDir = Number(yDir) || 0;
      this.redMultiplier = Number(redMultiplier) || 0;
      this.greenMultiplier = Number(greenMultiplier) || 0;
      this.blueMultiplier = Number(blueMultiplier) || 0;
      this.originalMix = Math.min(Math.max(originalMix, 0), 1) || 0;
      this._alphaMax = Boolean(alphaMax);
      this.FRAG_SHADER_BODY = "uniform vec2 uColorDirection;uniform vec3 uColorMultiplier;uniform vec2 uExtraProps;void main(void) {vec4 sample = texture2D(uSampler, vTextureCoord);vec4 rSample = texture2D(uSampler, vTextureCoord + (uColorDirection * uColorMultiplier.r));vec4 gSample = texture2D(uSampler, vTextureCoord + (uColorDirection * uColorMultiplier.g));vec4 bSample = texture2D(uSampler, vTextureCoord + (uColorDirection * uColorMultiplier.b));float newAlpha = " + (alphaMax ? "max(rSample.a, max(gSample.a, max(bSample.a, sample.a)))" : "(rSample.a + gSample.a + bSample.a) / 3.0") + ";vec4 result = vec4(min(1.0, rSample.r/(rSample.a+0.00001)) * newAlpha, min(1.0, gSample.g/(gSample.a+0.00001)) * newAlpha, min(1.0, bSample.b/(bSample.a+0.00001)) * newAlpha, newAlpha);gl_FragColor = mix(result, sample, uExtraProps[0]*sample.a);}";
    }
    var p = createjs.extend(AberrationFilter, createjs.Filter);
    p.shaderParamSetup = function(gl, stage2, shaderProgram) {
      gl.uniform2f(
        gl.getUniformLocation(shaderProgram, "uColorDirection"),
        this.xDir * (1 / stage2._viewportWidth),
        this.yDir * (1 / -stage2._viewportHeight)
      );
      gl.uniform3f(
        gl.getUniformLocation(shaderProgram, "uColorMultiplier"),
        -this.redMultiplier,
        -this.greenMultiplier,
        -this.blueMultiplier
      );
      gl.uniform2f(
        gl.getUniformLocation(shaderProgram, "uExtraProps"),
        this.originalMix,
        0
      );
    };
    p._applyFilter = function(imageData) {
      var refPixels = imageData.data.slice();
      var outPixels = imageData.data;
      var width = imageData.width;
      var height = imageData.height;
      var offset, pixel;
      for (var i = 0; i < height; i++) {
        offset = i * width;
        for (var j = 0; j < width; j++) {
          pixel = (offset + j) * 4;
          var redX = j + (this.xDir * -this.redMultiplier | 0), redY = i + (this.yDir * -this.redMultiplier | 0);
          var grnX = j + (this.xDir * -this.greenMultiplier | 0), grnY = i + (this.yDir * -this.greenMultiplier | 0);
          var bluX = j + (this.xDir * -this.blueMultiplier | 0), bluY = i + (this.yDir * -this.blueMultiplier | 0);
          if (redX < 0) {
            redX = 0;
          }
          if (redX >= width) {
            redX = width - 1;
          }
          if (redY < 0) {
            redY = 0;
          }
          if (redY >= height) {
            redY = height - 1;
          }
          if (grnX < 0) {
            grnX = 0;
          }
          if (grnX >= width) {
            grnX = width - 1;
          }
          if (grnY < 0) {
            grnY = 0;
          }
          if (grnY >= height) {
            grnY = height - 1;
          }
          if (bluX < 0) {
            bluX = 0;
          }
          if (bluX >= width) {
            bluX = width - 1;
          }
          if (bluY < 0) {
            bluY = 0;
          }
          if (bluY >= height) {
            bluY = height - 1;
          }
          var redPixel = (redY * width + redX) * 4;
          var grnPixel = (grnY * width + grnX) * 4;
          var bluPixel = (bluY * width + bluX) * 4;
          outPixels[pixel] = refPixels[redPixel];
          outPixels[pixel + 1] = refPixels[grnPixel + 1];
          outPixels[pixel + 2] = refPixels[bluPixel + 2];
          outPixels[pixel + 3] = this._alphaMax ? Math.max(refPixels[redPixel + 3], refPixels[grnPixel + 3], refPixels[bluPixel + 3]) : (refPixels[redPixel + 3] + refPixels[grnPixel + 3] + refPixels[bluPixel + 3]) / 3;
        }
      }
      return true;
    };
    createjs.AberrationFilter = createjs.promote(AberrationFilter, "Filter");
  })();

  // bundle.js
  var import_AlphaMapFilter = __toESM(require_AlphaMapFilter());
  var import_AlphaMaskFilter = __toESM(require_AlphaMaskFilter());
  var import_BitmapCache = __toESM(require_BitmapCache());
  var import_BlurFilter = __toESM(require_BlurFilter());
  var import_ColorFilter = __toESM(require_ColorFilter());
  var import_ColorMatrix = __toESM(require_ColorMatrix());
  var import_ColorMatrixFilter = __toESM(require_ColorMatrixFilter());
  var import_DisplacementFilter = __toESM(require_DisplacementFilter());
  var import_Filter = __toESM(require_Filter());
  var import_DisplayProps = __toESM(require_DisplayProps());
  var import_Matrix2D = __toESM(require_Matrix2D());
  var import_Point = __toESM(require_Point());
  var import_Rectangle = __toESM(require_Rectangle());
  var import_ButtonHelper = __toESM(require_ButtonHelper());
  var import_Touch = __toESM(require_Touch());
  var import_SpriteSheetBuilder = __toESM(require_SpriteSheetBuilder());
  var import_SpriteSheetUtils = __toESM(require_SpriteSheetUtils());
  var import_UID = __toESM(require_UID());
  var import_VideoBuffer = __toESM(require_VideoBuffer());
  var import_WebGLInspector = __toESM(require_WebGLInspector());
  var import_version = __toESM(require_version());
  var bundle_default = createjs;
})();
