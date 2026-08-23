const steps = [
  { key: 'base', title: 'Base', icon: 'fa-cake-candles', hint: 'Qual delícia servirá de fundação para a sua criação?', helper: 'Vamos começar! Escolha a base perfeita para o seu doce.', options: [['Cupcake', 'fa-cake-candles', 'cupcake'], ['Donut', 'fa-circle-dot', 'donut'], ['Bolo', 'fa-cake-candles', 'bolo'], ['Sorvete', 'fa-ice-cream', 'icecream']] },
  { key: 'filling', title: 'Recheio', icon: 'fa-droplet', hint: 'Agora escolha um recheio irresistível para o coração do doce.', helper: 'Uma camada cremosa deixa tudo mais gostoso!', options: [['Chocolate', 'fa-cookie-bite', '#6b3f2d', 'chocolate'], ['Morango', 'fa-heart', '#ef5a7e', 'morango'], ['Baunilha', 'fa-star', '#f4d888', 'baunilha'], ['Doce de leite', 'fa-candy-cane', '#d99148', 'doce-de-leite']] },
  { key: 'coat', title: 'Cobertura', icon: 'fa-wand-magic-sparkles', hint: 'Dê cor e brilho à sua criação com uma cobertura.', helper: 'Hora de deixar seu doce ainda mais bonito!', options: [['Chocolate', 'fa-cookie-bite', '#71402c', 'chocolate'], ['Morango', 'fa-heart', '#f565a3', 'morango'], ['Branca', 'fa-cloud', '#fff3ef', 'branca'], ['Caramelo', 'fa-bottle-droplet', '#d6954a', 'caramelo']] },
  { key: 'top', title: 'Toppings', icon: 'fa-sparkles', hint: 'Escolha os detalhes crocantes e coloridos.', helper: 'Um toque de magia faz toda diferença!', options: [['Granulado', 'fa-grip', '#5b3a75', 'granulado'], ['Confetes', 'fa-circle-nodes', '#fdc945', 'confetes'], ['Frutas', 'fa-apple-whole', '#f15a76', 'frutas'], ['Chocolate', 'fa-cookie-bite', '#5f3829', 'chocolate']] },
  { key: 'decor', title: 'Decoração', icon: 'fa-crown', hint: 'Finalize sua obra-prima com uma decoração especial.', helper: 'O último detalhe: faça seu doce brilhar!', options: [['Cereja', 'fa-circle', '#dd2650', 'cereja'], ['Estrela', 'fa-star', '#ffcb44', 'estrela'], ['Coração', 'fa-heart', '#f3618e', 'coracao'], ['Vela', 'fa-fire', '#8e5cf3', 'vela']] }
];

const baseAssets = { cupcake: 'assets/cupcake-base.png', donut: 'assets/donut-base.png', bolo: 'assets/bolo-base.png', icecream: 'assets/sorvete-base.png' };
const cakeFillingAssets = { baunilha: 'assets/layers/bolo/bolo_rb.png', chocolate: 'assets/layers/bolo/bolo_rc.png', morango: 'assets/layers/bolo/bolo_rm.png', 'doce-de-leite': 'assets/layers/bolo/bolo_rd.png' };
const icecreamFillingAssets = Object.fromEntries(['chocolate', 'morango', 'baunilha', 'doce-de-leite'].map(id => [id, `assets/layers/sorvete/scoop-${id}.png`]));
const icecreamCoatAssets = Object.fromEntries(['chocolate', 'morango', 'branca', 'caramelo'].map(id => [id, `assets/layers/sorvete/calda-${id}.png`]));
const icecreamTopAssets = Object.fromEntries(['granulado', 'confetes', 'frutas', 'chocolate'].map(id => [id, `assets/layers/sorvete/topping-${id}.png`]));
const cakeCoatAssets = Object.fromEntries(['chocolate', 'morango', 'branca', 'caramelo'].map(id => [id, `assets/layers/bolo-coat/coat-${id}.png`]));
const cakeTopAssets = Object.fromEntries(['granulado', 'confetes', 'frutas', 'chocolate'].map(id => [id, `assets/layers/bolo-topping/topping-${id}.png`]));
const cakeDecorAssets = Object.fromEntries(['cereja', 'estrela', 'coracao', 'vela'].map(id => [id, `assets/layers/bolo-decor-normalized/decor-${id}.png`]));
const donutFillingAssets = Object.fromEntries(['chocolate', 'morango', 'baunilha', 'doce-de-leite'].map(id => [id, `assets/layers/donut-completo/donut-${id}.png`]));
const cupcakeFillingAssets = Object.fromEntries(['chocolate', 'morango', 'baunilha', 'doce-de-leite'].map(id => [id, `assets/layers/cupcake-completo/cupcake-${id}.png`]));
const fillingCodes = { baunilha: 'rb', chocolate: 'rc', morango: 'rm', 'doce-de-leite': 'rd' };
const coatCodes = { caramelo: 'ca', branca: 'cb', chocolate: 'cc', morango: 'cm' };
const layerAssets = {
  coat: Object.fromEntries(Object.entries(coatCodes).map(([id, code]) => [id, `assets/layers/cobertura/cobertura_${code}.png`])),
  top: { granulado: 'assets/layers/topping/topping_granulado.png', confetes: 'assets/layers/topping/topping_confetes.png', frutas: 'assets/layers/topping/topping_frutas.png', chocolate: 'assets/layers/topping/topping_chocolate.png' },
  decor: { cereja: 'assets/layers/decor/decor_cereja.png', estrela: 'assets/layers/decor/decor_estrela.png', coracao: 'assets/layers/decor/decor_coracao.png', vela: 'assets/layers/decor/decor_vela.png' }
};
const basePrices = { cupcake: 12, donut: 11, bolo: 42, icecream: 10 };
let current = 0;
const picks = {};
const $ = selector => document.querySelector(selector);
const dessert = $('#dessert');
const options = $('#options');
const progress = $('#progressList');

function getCakeAsset() {
  const fillingId = picks.filling?.id;
  const coatId = picks.coat?.id;
  if (fillingId && coatId) return `assets/layers/bolo-completo/cake-${fillingId}-${coatId}.png`;
  return fillingId ? cakeFillingAssets[fillingId] : baseAssets.bolo;
}

function getDonutAsset() {
  const fillingId = picks.filling?.id;
  const coatId = picks.coat?.id;
  if (fillingId && coatId) return `assets/layers/donut-completo/donut-${fillingId}-${coatId}.png`;
  return fillingId ? donutFillingAssets[fillingId] : baseAssets.donut;
}

function getCupcakeAsset() {
  const fillingId = picks.filling?.id;
  const coatId = picks.coat?.id;
  if (fillingId && coatId) return `assets/layers/cupcake-completo/cupcake-${fillingId}-${coatId}.png`;
  return fillingId ? cupcakeFillingAssets[fillingId] : baseAssets.cupcake;
}

function optionArtwork(step, item) {
  const id = item[3] || item[2];
  if (step.key === 'base') {
    return `<img class="option-image" src="${baseAssets[id]}" alt="Ilustração cartoon de ${item[0]}">`;
  }
  return `<span class="ingredient-thumb ${step.key} ${id}" aria-hidden="true"><span></span></span>`;
}

function render() {
  const step = steps[current];
  const isCake = picks.base?.id === 'bolo';
  const total = isCake ? 5 : 4;
  $('#consoleTitle').textContent = `Console de Ingredientes: Selecione ${current === 0 || current === 2 ? 'a' : 'o'} ${step.title}`;
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
    : baseId === 'bolo' ? cakeTopAssets[picks.top?.id] : layerAssets.top[picks.top?.id];
  dessert.classList.toggle('has-top-art', Boolean(topAsset));
  setLayerImage(dessert.querySelector('.top-layer'), topAsset || '');
  ['top-mid-layer', 'top-bottom-layer'].forEach(name => setLayerImage(dessert.querySelector(`.${name}`), baseId === 'bolo' ? topAsset : ''));
  const decorAsset = baseId === 'bolo' ? cakeDecorAssets[picks.decor?.id] : layerAssets.decor[picks.decor?.id];
  dessert.classList.toggle('has-decor-art', Boolean(decorAsset));
  setLayerImage(dessert.querySelector('.decor-layer'), decorAsset || '');
  ['filling', 'coat', 'top', 'decor'].forEach(key => dessert.classList.add(picks[key] ? `has-${key}` : `no-${key}`));
  ['filling', 'coat', 'top', 'decor'].forEach(key => { if (picks[key]) dessert.classList.add(`${key}-${picks[key].id}`); });
  dessert.style.setProperty('--fill', picks.filling?.value || '#6d3f27');
  dessert.style.setProperty('--coat', picks.coat?.value || '#f66fac');
}

function setLayerImage(layer, source, onMissing) {
  if (!layer) return;
  layer.onerror = () => { layer.onerror = null; layer.removeAttribute('src'); layer.classList.remove('asset-loaded'); if (onMissing) onMissing(); };
  layer.classList.toggle('asset-loaded', Boolean(source));
  if (source) layer.src = source;
  else layer.removeAttribute('src');
}

function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 1900); }
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
  const price = (basePrices[picks.base.id] || 10) + 2 + 2 + 2 + (picks.decor ? 4 : 0);
  const formattedPrice = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
$('#next').onclick = () => { if (!picks[steps[current].key]) return showToast('Escolha um ingrediente para continuar.'); if (current === 4 || (current === 3 && picks.base?.id !== 'bolo')) return finish(); current++; render(); };
$('#back').onclick = () => { if (current) { current--; render(); } };
$('#restart').onclick = () => { Object.keys(picks).forEach(key => delete picks[key]); current = 0; $('#modal').classList.remove('open'); render(); showToast('Nova receita iniciada!'); };
$('#playAgain').onclick = () => { Object.keys(picks).forEach(key => delete picks[key]); current = 0; $('#modal').classList.remove('open'); render(); };
$('#orderFinish').onclick = () => showToast(`Pedido de ${$('#dessertName').textContent} adicionado!`);
$('#shareFinish').onclick = async () => {
  const text = `Criei ${$('#dessertName').textContent} no Monte seu Doce!`;
  try {
    if (navigator.share) await navigator.share({ title: 'Monte seu Doce', text });
    else { await navigator.clipboard.writeText(text); showToast('Descrição copiada!'); }
  } catch (error) { if (error?.name !== 'AbortError') showToast('Não foi possível compartilhar.'); }
};
render();
