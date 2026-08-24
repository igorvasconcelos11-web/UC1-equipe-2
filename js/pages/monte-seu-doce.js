// Etapas e opções exibidas no console de ingredientes.
const steps = [
  { key: 'base', title: 'Base', icon: 'fa-cake-candles', hint: 'Qual delícia servirá de fundação para a sua criação?', helper: 'Vamos começar! Escolha a base perfeita para o seu doce.', options: [['Cupcake', 'fa-cake-candles', 'cupcake'], ['Donut', 'fa-circle-dot', 'donut'], ['Bolo', 'fa-cake-candles', 'bolo'], ['Sorvete', 'fa-ice-cream', 'icecream']] },
  { key: 'filling', title: 'Recheio', icon: 'fa-droplet', hint: 'Agora escolha um recheio irresistível para o coração do doce.', helper: 'Uma camada cremosa deixa tudo mais gostoso!', options: [['Chocolate', 'fa-cookie-bite', '#6b3f2d', 'chocolate'], ['Morango', 'fa-heart', '#ef5a7e', 'morango'], ['Baunilha', 'fa-star', '#f4d888', 'baunilha'], ['Doce de leite', 'fa-candy-cane', '#d99148', 'doce-de-leite']] },
  { key: 'coat', title: 'Cobertura', icon: 'fa-wand-magic-sparkles', hint: 'Dê cor e brilho à sua criação com uma cobertura.', helper: 'Hora de deixar seu doce ainda mais bonito!', options: [['Chocolate', 'fa-cookie-bite', '#71402c', 'chocolate'], ['Morango', 'fa-heart', '#f565a3', 'morango'], ['Branca', 'fa-cloud', '#fff3ef', 'branca'], ['Caramelo', 'fa-bottle-droplet', '#d6954a', 'caramelo']] },
  { key: 'top', title: 'Toppings', icon: 'fa-sparkles', hint: 'Escolha os detalhes crocantes e coloridos.', helper: 'Um toque de magia faz toda diferença!', options: [['Granulado', 'fa-grip', '#5b3a75', 'granulado'], ['Confetes', 'fa-circle-nodes', '#fdc945', 'confetes'], ['Frutas', 'fa-apple-whole', '#f15a76', 'frutas'], ['Chocolate', 'fa-cookie-bite', '#5f3829', 'chocolate']] },
  { key: 'decor', title: 'Decoração', icon: 'fa-crown', hint: 'Finalize sua obra-prima com uma decoração especial.', helper: 'O último detalhe: faça seu doce brilhar!', options: [['Cereja', 'fa-circle', '#dd2650', 'cereja'], ['Estrela', 'fa-star', '#ffcb44', 'estrela'], ['Coração', 'fa-heart', '#f3618e', 'coracao'], ['Vela', 'fa-fire', '#8e5cf3', 'vela']] }
];

// Mapeamento central das imagens usadas para montar cada combinação.
const assetRoot = '../assets/customizer';
const transparentPixel = '../assets/icons/transparent-pixel.svg';
const baseAssets = { cupcake: `${assetRoot}/cupcake-base.png`, donut: `${assetRoot}/donut-base.png`, bolo: `${assetRoot}/bolo-base.png`, icecream: `${assetRoot}/sorvete-base.png` };
const cakeFillingAssets = { baunilha: `${assetRoot}/layers/bolo/bolo-rb.png`, chocolate: `${assetRoot}/layers/bolo/bolo-rc.png`, morango: `${assetRoot}/layers/bolo/bolo-rm.png`, 'doce-de-leite': `${assetRoot}/layers/bolo/bolo-rd.png` };
const icecreamFillingAssets = Object.fromEntries(['chocolate', 'morango', 'baunilha', 'doce-de-leite'].map(id => [id, `${assetRoot}/layers/sorvete/scoop-${id}.png`]));
const icecreamCoatAssets = Object.fromEntries(['chocolate', 'morango', 'branca', 'caramelo'].map(id => [id, `${assetRoot}/layers/sorvete/calda-${id}.png`]));
const icecreamTopAssets = Object.fromEntries(['granulado', 'confetes', 'frutas', 'chocolate'].map(id => [id, `${assetRoot}/layers/sorvete/topping-${id}.png`]));
const cakeTopAssets = Object.fromEntries(['granulado', 'confetes', 'frutas', 'chocolate'].map(id => [id, `${assetRoot}/layers/bolo-topping/topping-${id}.png`]));
const cakeDecorAssets = Object.fromEntries(['cereja', 'estrela', 'coracao', 'vela'].map(id => [id, `${assetRoot}/layers/bolo-decor-normalized/decor-${id}.png`]));
const donutFillingAssets = Object.fromEntries(['chocolate', 'morango', 'baunilha', 'doce-de-leite'].map(id => [id, `${assetRoot}/layers/donut-completo/donut-${id}.png`]));
const cupcakeFillingAssets = Object.fromEntries(['chocolate', 'morango', 'baunilha', 'doce-de-leite'].map(id => [id, `${assetRoot}/layers/cupcake-completo/cupcake-${id}.png`]));
const basePrices = { cupcake: 12, donut: 11, bolo: 42, icecream: 10 };
const cartBaseImages = { cupcake: 'cupcake-base.png', donut: 'donut-base.png', bolo: 'bolo-base.png', icecream: 'sorvete-base.png' };
// Estado atual da receita; existe apenas enquanto a página está aberta.
let current = 0;
let finishedPrice = 0;
const picks = {};
const $ = selector => document.querySelector(selector);
const dessert = $('#dessert');
const options = $('#options');
const progress = $('#progressList');

/** Retorna a arte completa correspondente ao recheio e à cobertura escolhidos. */
function getCakeAsset() {
  const fillingId = picks.filling?.id;
  const coatId = picks.coat?.id;
  if (fillingId && coatId) return `${assetRoot}/layers/bolo-completo/cake-${fillingId}-${coatId}.png`;
  return fillingId ? cakeFillingAssets[fillingId] : baseAssets.bolo;
}

function getDonutAsset() {
  const fillingId = picks.filling?.id;
  const coatId = picks.coat?.id;
  if (fillingId && coatId) return `${assetRoot}/layers/donut-completo/donut-${fillingId}-${coatId}.png`;
  return fillingId ? donutFillingAssets[fillingId] : baseAssets.donut;
}

function getCupcakeAsset() {
  const fillingId = picks.filling?.id;
  const coatId = picks.coat?.id;
  if (fillingId && coatId) return `${assetRoot}/layers/cupcake-completo/cupcake-${fillingId}-${coatId}.png`;
  return fillingId ? cupcakeFillingAssets[fillingId] : baseAssets.cupcake;
}

function optionArtwork(step, item) {
  const id = item[3] || item[2];
  if (step.key === 'base') {
    return `<img class="option-image" src="${baseAssets[id]}" alt="Ilustração cartoon de ${item[0]}">`;
  }
  return `<span class="ingredient-thumb ${step.key} ${id}" aria-hidden="true"><span></span></span>`;
}

/** Atualiza progresso, opções, botões e prévia para a etapa atual. */
function render() {
  const step = steps[current];
  const isCake = picks.base?.id === 'bolo';
  const total = isCake ? 5 : 4;
  const article = ['base', 'coat', 'decor'].includes(step.key) ? 'a' : 'o';
  $('#consoleTitle').textContent = `Console de Ingredientes: Selecione ${article} ${step.title}`;
  $('#consoleHint').textContent = `Passo ${current + 1} · ${step.hint}`;
  $('#stepBadge').textContent = `${current + 1} / ${total}`;
  progress.innerHTML = steps.map((item, index) => index === 4 && !isCake ? '' : `<li class="${index === current ? 'active' : ''} ${index < current ? 'done' : ''}"><span>${index < current ? '✓' : index + 1}</span>${item.title}</li>`).join('');
  $('#helperCard').innerHTML = `<i class="fa-solid ${step.icon}"></i>${step.helper}`;
  options.innerHTML = step.options.map((item, index) => `<button class="option ${picks[step.key]?.id === (item[3] || item[2]) ? 'selected' : ''}" style="--accent:${item[2]?.startsWith('#') ? item[2] : '#f65b9c'};--soft:${item[2]?.startsWith('#') ? item[2] + '22' : '#fde7f0'}" data-index="${index}">${optionArtwork(step, item)}<span class="option-label">${item[0]}</span></button>`).join('');
  document.querySelectorAll('.option').forEach(button => button.onclick = () => select(step.options[button.dataset.index]));
  $('#back').disabled = current === 0;
  $('#next').innerHTML = current === 4 || (current === 3 && !isCake) ? 'Finalizar Doce <i class="fa-solid fa-sparkles"></i>' : 'Próximo Passo <i class="fa-solid fa-arrow-right"></i>';
  updateDessert();
}

function select(item) {
  const key = steps[current].key;
  if (key === 'base') Object.keys(picks).filter(name => name !== 'base').forEach(name => delete picks[name]);
  picks[key] = { name: item[0], icon: item[1], value: item[2], id: item[3] || item[2] };
  render();
  showToast(`${item[0]} selecionado!`);
  dessert.classList.remove('animate');
  void dessert.offsetWidth;
  dessert.classList.add('animate');
}

/** Combina a base e as camadas visuais do doce selecionado. */
function updateDessert() {
  const baseId = picks.base?.id || 'cupcake';
  dessert.className = `dessert ${baseId}`;
  const image = dessert.querySelector('.base-art');
  image.onerror = () => {
    image.onerror = null;
    if (baseId === 'bolo' && picks.filling?.id) image.src = cakeFillingAssets[picks.filling.id];
  };
  image.src = baseId === 'bolo' ? getCakeAsset() : baseId === 'donut' ? getDonutAsset() : baseId === 'cupcake' ? getCupcakeAsset() : baseAssets[baseId];
  image.alt = `${picks.base?.name || 'Cupcake'} sem recheio`;
  const fillingLayer = dessert.querySelector('.filling-layer');
  fillingLayer.style.backgroundImage = 'none';
  dessert.classList.remove('has-cake-filling-art');
  const fillingAsset = baseId === 'icecream' ? icecreamFillingAssets[picks.filling?.id] : '';
  dessert.classList.toggle('has-filling-art', Boolean(fillingAsset));
  setLayerImage(fillingLayer, fillingAsset || '');
  const coatLayer = dessert.querySelector('.coat-layer');
  const coatAsset = baseId === 'icecream' ? icecreamCoatAssets[picks.coat?.id] : '';
  dessert.classList.toggle('has-coat-art', Boolean(coatAsset));
  setLayerImage(coatLayer, coatAsset);
  ['coat-mid-layer', 'coat-bottom-layer'].forEach(name => setLayerImage(dessert.querySelector(`.${name}`), ''));
  const topAsset = baseId === 'icecream'
    ? icecreamTopAssets[picks.top?.id]
    : baseId === 'bolo' ? cakeTopAssets[picks.top?.id] : '';
  dessert.classList.toggle('has-top-art', Boolean(topAsset));
  setLayerImage(dessert.querySelector('.top-layer'), topAsset || '');
  ['top-mid-layer', 'top-bottom-layer'].forEach(name => setLayerImage(dessert.querySelector(`.${name}`), baseId === 'bolo' ? topAsset : ''));
  const decorAsset = baseId === 'bolo' ? cakeDecorAssets[picks.decor?.id] : '';
  dessert.classList.toggle('has-decor-art', Boolean(decorAsset));
  setLayerImage(dessert.querySelector('.decor-layer'), decorAsset || '');
  ['filling', 'coat', 'top', 'decor'].forEach(key => dessert.classList.add(picks[key] ? `has-${key}` : `no-${key}`));
  ['filling', 'coat', 'top', 'decor'].forEach(key => { if (picks[key]) dessert.classList.add(`${key}-${picks[key].id}`); });
  dessert.style.setProperty('--fill', picks.filling?.value || '#6d3f27');
  dessert.style.setProperty('--coat', picks.coat?.value || '#f66fac');
}

/** Usa um pixel transparente quando uma camada opcional ainda não foi escolhida. */
function setLayerImage(layer, source, onMissing) {
  if (!layer) return;
  layer.onerror = () => { layer.onerror = null; layer.src = transparentPixel; layer.classList.remove('asset-loaded'); if (onMissing) onMissing(); };
  layer.classList.toggle('asset-loaded', Boolean(source));
  if (source) layer.src = source;
  else layer.src = transparentPixel;
}

function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 1900); }
/** Preenche o resumo final, calcula o preço e abre o modal da receita. */
function finish() {
  const title = picks.decor
    ? `${picks.base.name} ${picks.coat.name} com ${picks.decor.name}`
    : `${picks.base.name} ${picks.coat.name} com ${picks.top.name}`;
  $('#dessertName').textContent = title;
  $('#summaryBase').textContent = picks.base.name;
  $('#summaryFilling').textContent = picks.filling.name;
  $('#summaryCoat').textContent = picks.coat.name;
  $('#summaryTop').textContent = picks.top.name;
  $('#summaryDecor').textContent = picks.decor?.name || 'Sem decoração extra';
  $('#summaryDecorRow').hidden = !picks.decor;
  finishedPrice = (basePrices[picks.base.id] || 10) + 2 + 2 + 2 + (picks.decor ? 4 : 0);
  const formattedPrice = finishedPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  $('#summaryPrice').textContent = formattedPrice;
  $('#orderPrice').textContent = formattedPrice;
  const final = $('#finalDessert');
  final.className = dessert.className;
  final.style.cssText = dessert.style.cssText;
  final.querySelector('.base-art').src = dessert.querySelector('.base-art').src;
  ['filling-layer', 'coat-layer', 'coat-mid-layer', 'coat-bottom-layer', 'top-layer', 'top-mid-layer', 'top-bottom-layer', 'decor-layer'].forEach(name => {
    const layer = final.querySelector(`.${name}`);
    const source = dessert.querySelector(`.${name}`).getAttribute('src');
    setLayerImage(layer, source || '');
  });
  $('#modal').classList.add('open');
  $('#modal').setAttribute('aria-hidden', 'false');
}
// Controles principais do fluxo: avançar, voltar, reiniciar e finalizar.
$('#next').onclick = () => { if (!picks[steps[current].key]) return showToast('Escolha um ingrediente para continuar.'); if (current === 4 || (current === 3 && picks.base?.id !== 'bolo')) return finish(); current++; render(); };
$('#back').onclick = () => { if (current) { current--; render(); } };
$('#restart').onclick = () => { Object.keys(picks).forEach(key => delete picks[key]); current = 0; $('#modal').classList.remove('open'); render(); showToast('Nova receita iniciada!'); };
$('#playAgain').onclick = () => { Object.keys(picks).forEach(key => delete picks[key]); current = 0; $('#modal').classList.remove('open'); render(); };
$('#orderFinish').onclick = () => {
  const recipeId = ['base', 'filling', 'coat', 'top', 'decor'].map(key => picks[key]?.id || 'sem').join('-');
  window.DoceCart?.addItem({
    id: `personalizado-${recipeId}`,
    name: $('#dessertName').textContent,
    price: finishedPrice,
    image: `assets/customizer/${cartBaseImages[picks.base.id]}`,
  });
  showToast(`Pedido de ${$('#dessertName').textContent} adicionado ao carrinho!`);
};
$('#shareFinish').onclick = async () => {
  const text = `Criei ${$('#dessertName').textContent} no Monte seu Doce!`;
  try {
    if (navigator.share) await navigator.share({ title: 'Monte seu Doce', text });
    else { await navigator.clipboard.writeText(text); showToast('Descrição copiada!'); }
  } catch (error) { if (error?.name !== 'AbortError') showToast('Não foi possível compartilhar.'); }
};
render();
