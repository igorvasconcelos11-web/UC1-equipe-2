let toastTimer;

/**
 * Exibe um aviso temporário sem criar carrinho ou salvar dados.
 */
function showSiteToast(message) {
  let toast = document.querySelector(".site-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "site-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.addEventListener("click", (event) => {
  const socialPlaceholder = event.target.closest("[data-social-placeholder]");
  if (socialPlaceholder) event.preventDefault();

  const addButton = event.target.closest("[data-add-product]");
  if (addButton) {
    window.DoceCart?.addItem({
      id: addButton.dataset.productId,
      name: addButton.dataset.addProduct,
      price: Number(addButton.dataset.productPrice),
      image: addButton.dataset.productImage,
    });
    showSiteToast(`${addButton.dataset.addProduct} adicionado ao carrinho.`);
  }
});
