/* Burntide DTC — interactions */
(function () {
  'use strict';

  // mobile menu
  var burger = document.getElementById('hamburger');
  var links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) links.classList.remove('open');
    });
  }

  // FAQ accordion — single-open behaviour
  var items = document.querySelectorAll('.faq-item');
  items.forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      items.forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // ----- todos os CTAs rolam pro bloco de preço -----
  // (placeholder até os links de checkout BuyGoods entrarem)
  var order = document.getElementById('order-section');
  document.querySelectorAll('a[href="#order-section"], .pkg-btn').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      if (order) order.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
