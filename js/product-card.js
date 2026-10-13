(function () {
  'use strict';

  const ADDED_STATE_MS = 2000;

  function formatPrice(value) {
    const digits = Number.isInteger(value) ? 0 : 2;
    return value.toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }

  function getDiscount(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round((1 - price / oldPrice) * 100);
  }

  function initProductCard(root) {
    const form = root.querySelector('[data-product-form]');
    const skuEl = root.querySelector('[data-product-sku]');
    const priceEl = root.querySelector('[data-product-price]');
    const oldPriceEl = root.querySelector('[data-product-old-price]');
    const oldPriceWrap = root.querySelector('[data-product-old-price-wrap]');
    const badgeEl = root.querySelector('[data-product-badge]');
    const submitBtn = root.querySelector('[data-product-submit]');
    const submitLabel = root.querySelector('[data-product-submit-label]');
    const defaultLabel = submitLabel.textContent;
    let addedTimer = null;

    function render(input) {
      const price = Number(input.dataset.price);
      const oldPrice = Number(input.dataset.oldPrice) || 0;
      const discount = getDiscount(price, oldPrice);

      skuEl.textContent = input.dataset.sku;
      priceEl.textContent = formatPrice(price);

      oldPriceWrap.hidden = discount === 0;
      oldPriceEl.textContent = discount ? formatPrice(oldPrice) : '';

      badgeEl.hidden = discount === 0;
      badgeEl.textContent = `−${discount}%`;
    }

    form.addEventListener('change', (event) => {
      if (event.target.matches('.packing__input')) {
        render(event.target);
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      submitBtn.classList.add('is-added');
      submitLabel.textContent = 'Добавлено';

      clearTimeout(addedTimer);
      addedTimer = setTimeout(() => {
        submitBtn.classList.remove('is-added');
        submitLabel.textContent = defaultLabel;
      }, ADDED_STATE_MS);
    });

    const checked = form.querySelector('.packing__input:checked');
    if (checked) render(checked);
  }

  document.querySelectorAll('[data-product]').forEach(initProductCard);
})();
