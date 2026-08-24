const siteRoot = document.body.dataset.page === "home" ? "" : "../";

const routes = {
  home: `${siteRoot}index.html`,
  sobre: `${siteRoot}pages/sobre-nos.html`,
  cardapio: `${siteRoot}pages/cardapio.html`,
  contato: `${siteRoot}pages/contato.html`,
  montar: `${siteRoot}pages/monte-seu-doce.html`,
};

const navigationItems = [
  ["home", "Home"],
  ["sobre", "Sobre Nós"],
  ["cardapio", "Doces"],
  ["contato", "Contatos"],
];

/**
 * Monta a Navbar global e identifica de forma acessível a página atual.
 */
class DoceNavbar extends HTMLElement {
  connectedCallback() {
    const activePage = document.body.dataset.page;
    const navigation = navigationItems
      .map(([key, label]) => `<a href="${routes[key]}"${activePage === key ? ' aria-current="page"' : ""}>${label}</a>`)
      .join("");
    const customizerCta = activePage === "home"
      ? '<span class="site-cta site-cta--placeholder" aria-hidden="true">Monte seu doce!</span>'
      : `<a class="site-cta" href="${routes.montar}"${activePage === "montar" ? ' aria-current="page"' : ""}>Monte seu doce!</a>`;
    const cartButton = `
      <button class="site-cart-button" type="button" data-cart-toggle aria-label="Abrir carrinho">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H7M10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg>
        <span class="site-cart-count" data-cart-count hidden>0</span>
      </button>`;

    this.innerHTML = `
      <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <header class="site-header">
        <a class="site-brand" href="${routes.home}" aria-label="Página inicial da Doce Rush">
          <img src="${siteRoot}assets/brand/logo-doce-rush.png" alt="Doce Rush">
        </a>
        <nav class="site-nav" aria-label="Navegação principal">${navigation}</nav>
        <div class="site-header__actions">${cartButton}${customizerCta}</div>
      </header>`;
  }
}

/**
 * Monta o Footer global a partir de uma única estrutura compartilhada.
 */
class DoceFooter extends HTMLElement {
  connectedCallback() {
    const socialNetworks = ["instagram", "facebook", "whatsapp", "github"];
    const icons = socialNetworks
      .map((network) => `
        <a href="#" data-social-placeholder aria-label="${network} — perfil ainda não informado" aria-disabled="true">
          <img src="${siteRoot}assets/icons/${network}.png" alt="">
        </a>`)
      .join("");

    this.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer__brand">
          <img src="${siteRoot}assets/brand/logo-doce-rush.png" alt="Doce Rush">
          <p>A mágica dos sabores artesanais premium diretamente para a sua mesa. Feito com amor e fantasia.</p>
        </div>
        <div class="site-footer__social">
          <h2>Redes Sociais</h2>
          <div class="site-footer__icons">${icons}</div>
        </div>
      </footer>`;
  }
}

customElements.define("doce-navbar", DoceNavbar);
customElements.define("doce-footer", DoceFooter);
