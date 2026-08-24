document.addEventListener('DOMContentLoaded', () => {
  // Catálogo usado pelos filtros, miniaturas e destaque principal.
  const products = [
    { category: 'frios', title: 'Sorvete Blue Ice', price: 'R$ 14,00', food: 'sorvete-blue-ice.png', character: 'lilo-stitch-sorvete.png', characterSide: 'left', characterAnchor: 'bottom', characterSize: 'large', desc: 'Sorvete azul cremoso inspirado em Lilo & Stitch, com uma apresentação gelada e divertida.' },
    { category: 'frios', title: 'Milkshake Frozen', price: 'R$ 16,00', food: 'milkshake-frozen.png', character: 'elsa-milkshake.png', characterSide: 'left', characterAnchor: 'bottom', characterSize: 'large', desc: 'Milkshake cremoso e refrescante inspirado no universo de Frozen.' },
    { category: 'frios', title: 'Mochi de Morango', price: 'R$ 15,00', food: 'mochi-morango.png', character: 'mulan-mochi.png', characterSide: 'right', characterAnchor: 'bottom', characterSize: 'large', desc: 'Mochi macio de morango, inspirado na delicadeza e coragem de Mulan.' },
    { category: 'frios', title: 'Macaron Colorido', price: 'R$ 12,00', food: 'macaron-colorido.png', character: 'divertidamente-macaron-cutout.png', cutout: true, characterSide: 'left', characterAnchor: 'top', characterSize: 'large', desc: 'Macarons coloridos e leves, inspirados nas emoções de Divertida Mente.' },
    { category: 'quentes', title: 'Brownie de Mel', price: 'R$ 14,00', food: 'brownie-mel.png', character: 'aladdin-brownie-cutout.png', characterSide: 'left', characterAnchor: 'bottom', characterSize: 'large', desc: 'Brownie intenso com fio de mel dourado, inspirado nas aventuras de Aladdin.' },
    { category: 'quentes', title: 'Cookie de Chocolate', price: 'R$ 10,00', food: 'cookie-chocolate.png', character: 'tico-teco-cookie.png', characterSide: 'center', characterAnchor: 'bottom', characterSize: 'presenter', desc: 'Cookie quentinho com gotas de chocolate, inspirado na dupla Tico e Teco.' },
    { category: 'quentes', title: 'Bolo de Cenoura', price: 'R$ 11,00', food: 'bolo-cenoura.png', character: 'judy-bolo-cenoura.png', characterSide: 'right', characterAnchor: 'bottom', characterSize: 'large', desc: 'Bolo de cenoura macio com cobertura de chocolate, inspirado em Zootopia.' },
    { category: 'quentes', title: 'Cupcake de Mel', price: 'R$ 13,00', food: 'cupcake-mel.png', character: 'ursinho-pooh-cupcake.png', characterSide: 'right', characterAnchor: 'bottom', characterSize: 'large', desc: 'Cupcake fofinho com mel, feito para os fãs do Ursinho Pooh.' },
    { category: 'doces', title: 'Donut Rosa', price: 'R$ 12,00', food: 'donut-rosa.png', character: 'vanellope-donut.png', characterSide: 'left', characterAnchor: 'bottom', characterSize: 'large', desc: 'Donut rosa com cobertura brilhante, inspirado em Vanellope e Detona Ralph.', featured: true },
    { category: 'doces', title: 'Maçã do Amor', price: 'R$ 11,00', food: 'maca-do-amor.png', character: 'branca-neve-maca.png', characterSide: 'left', characterAnchor: 'bottom', characterSize: 'large', desc: 'Maçã do amor crocante inspirada no conto da Branca de Neve.' },
    { category: 'doces', title: 'Brigadeiro de Coco', price: 'R$ 8,00', food: 'brigadeiro-coco.png', character: 'moana-brigadeiro.png', characterSide: 'left', characterAnchor: 'bottom', characterSize: 'large', desc: 'Brigadeiro de coco com clima tropical inspirado em Moana.' },
    { category: 'doces', title: 'Brigadeiro de Doce de Leite', price: 'R$ 8,00', food: 'brigadeiro-doce-de-leite.png', character: 'rei-leao-brigadeiro.png', characterSide: 'right', characterAnchor: 'bottom', characterSize: 'large', desc: 'Brigadeiro de doce de leite inspirado na savana de O Rei Leão.' }
  ].map(product => ({
    ...product,
    img: `../assets/products/${product.food}`,
    characterImg: `../assets/characters/${product.character}`,
  }));
  const themes = { todos: ['#a154c1', '161,84,193'], frios: ['#49c5f7', '73,197,247'], quentes: ['#ff843f', '255,132,63'] };
  const els = { box: document.querySelector('.main-image-container'), image: document.querySelector('#main-image'), character: document.querySelector('#character-image'), title: document.querySelector('#product-title'), desc: document.querySelector('#product-desc'), price: document.querySelector('#product-price'), counter: document.querySelector('#product-counter'), tag: document.querySelector('#category-tag'), thumbnails: document.querySelector('#thumbnails-container'), feedback: document.querySelector('#order-feedback'), add: document.querySelector('#btn-add') };
  let category = 'frios'; let index = 0; let changing = false;
  const visibleProducts = () => category === 'todos' ? products : products.filter(product => product.category === category);
  const categoryLabel = () => category === 'todos' ? 'Todos os doces e personagens' : `Categoria ${category}`;
  function applyTheme() { const [color, rgb] = themes[category]; document.documentElement.style.setProperty('--accent', color); document.documentElement.style.setProperty('--accent-rgb', rgb); }
  /** Atualiza a lista de miniaturas conforme a categoria selecionada. */
  function renderThumbnails() {
    els.thumbnails.innerHTML = visibleProducts().map((product, productIndex) => `<button class="thumb-card ${productIndex === index ? 'active' : ''}" type="button" data-index="${productIndex}" aria-label="Selecionar ${product.title}"><img class="thumb-img" src="${product.img}" alt=""><span class="thumb-info"><h2>${product.title}</h2><p>${String(productIndex + 1).padStart(2, '0')}</p></span></button>`).join('');
    els.thumbnails.querySelectorAll('.thumb-card').forEach(card => card.addEventListener('click', () => showProduct(Number(card.dataset.index))));
  }
  /** Ajusta o produto à moldura sem cortar a imagem original. */
  function fitFoodFrame() {
    if (!els.image.complete || !els.image.naturalWidth) return;
    // A moldura acompanha a proporção real da foto: ocupa toda a borda sem cortar o doce.
    const hero = els.box.closest('.hero-section');
    const heroStyle = getComputedStyle(hero);
    const availableWidth = hero.clientWidth - parseFloat(heroStyle.paddingLeft) - parseFloat(heroStyle.paddingRight);
    const availableHeight = hero.clientHeight - parseFloat(heroStyle.paddingTop) - parseFloat(heroStyle.paddingBottom);
    const maxWidth = Math.min(520, availableWidth);
    const maxHeight = Math.min(390, availableHeight);
    const imageRatio = els.image.naturalWidth / els.image.naturalHeight;
    const width = imageRatio >= maxWidth / maxHeight ? maxWidth : maxHeight * imageRatio;
    const height = imageRatio >= maxWidth / maxHeight ? maxWidth / imageRatio : maxHeight;
    els.box.style.width = `${width}px`;
    els.box.style.height = `${height}px`;
    els.box.dataset.foodOrientation = imageRatio >= 1 ? 'landscape' : 'portrait';
    if (els.character.complete) fitCharacter();
  }
  /** Posiciona personagens com proporções diferentes dentro do destaque. */
  function fitCharacter() {
    if (!els.character.complete || !els.character.naturalWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = els.character.naturalWidth; canvas.height = els.character.naturalHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(els.character, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0, opaquePixels = 0, sampledPixels = 0;
    for (let y = 0; y < canvas.height; y += 2) for (let x = 0; x < canvas.width; x += 2) {
      sampledPixels += 1;
      if (pixels[(y * canvas.width + x) * 4 + 3] > 16) { opaquePixels += 1; minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
    }
    if (maxX <= minX || maxY <= minY) return;
    if (els.character.dataset.cropped !== 'true') {
      // Margem generosa para não cortar cabelo, braços ou acessórios no medalhão.
      const padding = Math.round(Math.max(maxX - minX, maxY - minY) * .18);
      const cropX = Math.max(0, minX - padding); const cropY = Math.max(0, minY - padding);
      const cropWidth = Math.min(canvas.width - cropX, maxX - minX + padding * 2);
      const cropHeight = Math.min(canvas.height - cropY, maxY - minY + padding * 2);
      const croppedCanvas = document.createElement('canvas'); croppedCanvas.width = cropWidth; croppedCanvas.height = cropHeight;
      croppedCanvas.getContext('2d').drawImage(els.character, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      els.character.dataset.cropped = 'true'; els.character.src = croppedCanvas.toDataURL('image/png');
      return;
    }
    // O cartão usa contain para exibir por completo personagens verticais e imagens de grupo.
    const characterRatio = els.character.naturalWidth / els.character.naturalHeight;
    els.character.dataset.orientation = characterRatio < .82 ? 'portrait' : characterRatio > 1.22 ? 'landscape' : 'square';
    els.character.dataset.badge = 'true'; els.character.style.removeProperty('width'); els.character.style.removeProperty('height');
    els.character.style.left = '10px'; els.character.style.top = 'auto'; els.character.style.bottom = '10px';
  }
  /** Troca o produto em destaque e sincroniza textos, imagens e miniaturas. */
  function showProduct(nextIndex, animate = true) {
    if (changing || (nextIndex === index && animate)) return;
    changing = true; const product = visibleProducts()[nextIndex]; const fade = [els.box, els.title, els.desc, els.price, els.counter, els.tag];
    if (animate) fade.forEach(element => element.classList.add('is-changing'));
    window.setTimeout(() => {
      index = nextIndex; els.image.onload = fitFoodFrame; els.image.src = product.img; els.image.alt = product.title; els.character.dataset.cropped = 'false'; els.character.dataset.badge = 'false'; els.character.dataset.cutout = product.cutout ? 'true' : 'false'; els.character.dataset.side = product.characterSide || 'left'; els.character.dataset.anchor = product.characterAnchor || 'bottom'; els.character.dataset.size = product.characterSize || 'regular'; els.character.src = product.characterImg; els.character.alt = `Personagem relacionado a ${product.title}`; els.character.onload = fitCharacter; els.title.textContent = product.title; els.desc.textContent = product.desc; els.price.textContent = product.price; els.counter.textContent = `${String(index + 1).padStart(2, '0')}/${String(visibleProducts().length).padStart(2, '0')}`; els.tag.textContent = categoryLabel();
      renderThumbnails(); if (els.character.complete) fitCharacter(); if (animate) fade.forEach(element => element.classList.remove('is-changing')); changing = false;
    }, animate ? 220 : 0);
  }
  /** Aplica o filtro escolhido e reinicia o carrossel no produto correto. */
  function setCategory(nextCategory, selectedProduct = null) { category = nextCategory; index = selectedProduct ? Math.max(0, visibleProducts().indexOf(selectedProduct)) : nextCategory === 'todos' ? products.findIndex(product => product.featured) : 0; applyTheme(); document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.category === category)); showProduct(index, false); }
  function pulseArrow(button, direction) { button.style.transform = `scale(.9) translateX(${direction * 4}px)`; window.setTimeout(() => { button.style.transform = ''; }, 170); }
  document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => setCategory(tab.dataset.category)));
  document.querySelector('#btn-next').addEventListener('click', event => { pulseArrow(event.currentTarget, 1); showProduct((index + 1) % visibleProducts().length); });
  document.querySelector('#btn-prev').addEventListener('click', event => { pulseArrow(event.currentTarget, -1); showProduct((index - 1 + visibleProducts().length) % visibleProducts().length); });
  els.add.addEventListener('click', () => {
    const product = visibleProducts()[index];
    const numericPrice = Number(product.price.replace(/[^0-9,]/g, '').replace(',', '.'));
    window.DoceCart?.addItem({ id: `product-${product.food.replace('.png', '')}`, name: product.title, price: numericPrice, image: `assets/products/${product.food}` });
    els.feedback.textContent = `${product.title} adicionado ao carrinho`;
    window.setTimeout(() => els.feedback.textContent = '', 2600);
  });
  window.addEventListener('resize', fitFoodFrame);
  setCategory('frios');
});
