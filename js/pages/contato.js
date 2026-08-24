const form = document.querySelector(".contact-form");
const successMessage = document.querySelector(".contact-success");

/**
 * Valida o formulário no próprio navegador sem transmitir dados.
 */
form?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    successMessage.hidden = true;
    return;
  }

  successMessage.hidden = false;
  form.reset();
  successMessage.focus?.();
});
