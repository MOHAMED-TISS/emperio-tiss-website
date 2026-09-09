(() => {
  'use strict';

  const enhance = () => {
    document.querySelectorAll('.fish-catalog-card__media').forEach((media) => {
      const image = media.querySelector('.fish-card-image');
      if (!image || media.querySelector('.fish-catalog-card__zoom')) return;

      const images = JSON.parse(media.dataset.images || '[]');
      if (!images.length) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'fish-catalog-card__zoom';
      button.setAttribute('aria-label', `View ${image.alt || 'fish image'}`);
      button.appendChild(image);
      media.insertBefore(button, media.firstChild);

      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        media.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });
    });
  };

  enhance();
  new MutationObserver(enhance).observe(document.body, { childList: true, subtree: true });
})();
