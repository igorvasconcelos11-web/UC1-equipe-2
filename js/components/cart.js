(() => {
  const storageKey = "doce-rush-cart";
  const windowNamePrefix = "doce-rush-cart:";
  const assetPrefix = document.body.dataset.page === "home" ? "" : "../";
  const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  /** Recupera o carrinho, inclusive durante navegação direta entre arquivos HTML. */
  function loadItems() {
    try {
      if (window.name.startsWith(windowNamePrefix)) return JSON.parse(window.name.slice(windowNamePrefix.length));
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  }

  let items = loadItems();

  document.body.insertAdjacentHTML("beforeend", `
    <div class="cart-overlay" data-cart-overlay aria-hidden="true">
      <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div class="cart-header">
          <h2 id="cart-title">Seu carrinho</h2>
          <button class="cart-close" type="button" data-cart-close aria-label="Fechar carrinho">×</button>
        </div>
        <p class="cart-empty" data-cart-empty>Seu carrinho ainda está vazio.</p>
        <ul class="cart-items" data-cart-items></ul>
        <div class="cart-footer">
          <div class="cart-summary"><span>Subtotal</span><strong data-cart-total>R$ 0,00</strong></div>
          <p class="cart-note">O carrinho é salvo neste navegador. Pagamento e entrega são combinados no atendimento.</p>
          <button class="cart-clear" type="button" data-cart-clear>Limpar carrinho</button>
        </div>
      </aside>
    </div>`);

  const overlay = document.querySelector("[data-cart-overlay]");
  const itemsList = document.querySelector("[data-cart-items]");
  const emptyMessage = document.querySelector("[data-cart-empty]");
  const totalElement = document.querySelector("[data-cart-total]");

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
  const imageUrl = (path) => /^(?:https?:|file:|data:)/.test(path) ? path : `${assetPrefix}${path}`;

  /** Salva e redesenha o carrinho após qualquer alteração. */
  function persist() {
    const serialized = JSON.stringify(items);
    window.name = `${windowNamePrefix}${serialized}`;
    try { localStorage.setItem(storageKey, serialized); } catch { /* O carrinho continua disponível na aba atual. */ }
    render();
  }

  function render() {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
      badge.textContent = count;
      badge.hidden = count === 0;
    });

    emptyMessage.hidden = items.length > 0;
    itemsList.hidden = items.length === 0;
    itemsList.innerHTML = items.map((item) => `
      <li class="cart-item">
        <img class="cart-item__image" src="${escapeHtml(imageUrl(item.image))}" alt="">
        <div class="cart-item__content">
          <h3>${escapeHtml(item.name)}</h3>
          <span class="cart-item__price">${currency.format(item.price * item.quantity)}</span>
          <div class="cart-quantity" aria-label="Quantidade de ${escapeHtml(item.name)}">
            <button type="button" data-cart-action="decrease" data-cart-id="${escapeHtml(item.id)}" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-cart-id="${escapeHtml(item.id)}" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <button class="cart-remove" type="button" data-cart-action="remove" data-cart-id="${escapeHtml(item.id)}">Remover</button>
      </li>`).join("");
    totalElement.textContent = currency.format(total);
    document.querySelector("[data-cart-clear]").disabled = items.length === 0;
  }

  function openCart() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-is-open");
    document.querySelector("[data-cart-close]").focus();
  }

  function closeCart() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-is-open");
  }

  function addItem(product) {
    if (!product?.id || !product?.name || !Number.isFinite(product.price)) return;
    const existingItem = items.find((item) => item.id === product.id);
    if (existingItem) existingItem.quantity += 1;
    else items.push({ ...product, quantity: 1 });
    persist();
    openCart();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-cart-toggle]")) openCart();
    if (event.target.closest("[data-cart-close]") || event.target === overlay) closeCart();
    if (event.target.closest("[data-cart-clear]")) { items = []; persist(); }

    const actionButton = event.target.closest("[data-cart-action]");
    if (!actionButton) return;
    const item = items.find((entry) => entry.id === actionButton.dataset.cartId);
    if (!item) return;
    if (actionButton.dataset.cartAction === "increase") item.quantity += 1;
    if (actionButton.dataset.cartAction === "decrease") item.quantity -= 1;
    if (actionButton.dataset.cartAction === "remove" || item.quantity <= 0) items = items.filter((entry) => entry.id !== item.id);
    persist();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) closeCart();
  });

  window.DoceCart = { addItem, open: openCart, close: closeCart };
  render();
})();
