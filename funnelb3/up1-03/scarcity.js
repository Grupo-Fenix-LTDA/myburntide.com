(function () {
  "use strict";

  // Config
  var CONFIG = {
    startValue: 31,            // starting value
    minFloor: 3,               // min floor
    maxFloor: 7,               // max floor (randomized per visitor)
    minIntervalMs: 15000,      // 15s
    maxIntervalMs: 40000,      // 40s
    doubleDropChance: 0.12,    // 12% chance of double-step decrement
    storageKey: "bt_bottles_v1",
    floorKey: "bt_bottles_floor_v1",
    // counter selectors (first match wins)
    targetSelectors: [
      "[data-bottles-remaining]",
      "#bottles-remaining",
      ".bottles-remaining"
    ],
    // fallback: build a bar and insert above the offer box
    fallbackInsertBefore: ".box-6-bottle",
    label: "Bottles Remaining"
  };

  // Helpers
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getFloor() {
    var f = parseInt(localStorage.getItem(CONFIG.floorKey), 10);
    if (isNaN(f) || f < CONFIG.minFloor || f > CONFIG.maxFloor) {
      f = rand(CONFIG.minFloor, CONFIG.maxFloor);
      try { localStorage.setItem(CONFIG.floorKey, f); } catch (e) {}
    }
    return f;
  }

  function getCount() {
    var c = parseInt(localStorage.getItem(CONFIG.storageKey), 10);
    if (isNaN(c) || c > CONFIG.startValue || c < 1) {
      c = CONFIG.startValue;
      try { localStorage.setItem(CONFIG.storageKey, c); } catch (e) {}
    }
    return c;
  }

  function setCount(c) {
    try { localStorage.setItem(CONFIG.storageKey, c); } catch (e) {}
  }

  // DOM
  function findOrCreateEl() {
    for (var i = 0; i < CONFIG.targetSelectors.length; i++) {
      var el = document.querySelector(CONFIG.targetSelectors[i]);
      if (el) return el;
    }
    // fallback: cria a barra e injeta acima da oferta
    var host = document.querySelector(CONFIG.fallbackInsertBefore);
    if (!host) return null;

    var wrap = document.createElement("div");
    wrap.className = "scarcity-bar";
    wrap.style.cssText =
      "display:flex;align-items:center;justify-content:center;gap:8px;" +
      "background:#fff4e5;border:2px solid #ff8a00;color:#a64200;" +
      "font-family:'Roboto',sans-serif;font-weight:700;font-size:18px;" +
      "padding:10px 16px;border-radius:10px;margin:0 auto 18px;max-width:420px;" +
      "box-shadow:0 2px 10px rgba(0,0,0,.06);";
    wrap.innerHTML =
      '<span>⏳ ' + CONFIG.label + ':</span>' +
      '<span id="bottles-remaining" data-bottles-remaining style="font-size:22px;color:#c0392b;">--</span>';

    host.parentNode.insertBefore(wrap, host);
    return wrap.querySelector("#bottles-remaining");
  }

  function pulse(el) {
    el.style.transition = "transform .25s ease, color .25s ease";
    el.style.transform = "scale(1.25)";
    el.style.color = "#c0392b";
    setTimeout(function () {
      el.style.transform = "scale(1)";
    }, 250);
  }

  // Loop
  function scheduleNext(el, floor) {
    var current = getCount();
    if (current <= floor) return; // floor reached, stop
    var delay = rand(CONFIG.minIntervalMs, CONFIG.maxIntervalMs);
    setTimeout(function () {
      var c = getCount();
      if (c <= floor) return;

      // chance of multi-step drop
      var dropBy = (Math.random() < CONFIG.doubleDropChance && c - 2 >= floor) ? 2 : 1;
      c = c - dropBy;
      setCount(c);
      el.textContent = c;
      pulse(el);

      scheduleNext(el, floor);
    }, delay);
  }

  // Boot
  function init() {
    var el = findOrCreateEl();
    if (!el) return;

    var floor = getFloor();
    var count = getCount();
    el.textContent = count;

    // already at floor, nothing scheduled
    if (count > floor) {
      // shorter first tick for a "live" feel
      setTimeout(function () {
        var c = getCount();
        if (c > floor) {
          c = c - 1;
          setCount(c);
          el.textContent = c;
          pulse(el);
          scheduleNext(el, floor);
        }
      }, rand(3000, 10000));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
