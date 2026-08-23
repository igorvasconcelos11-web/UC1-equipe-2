document.addEventListener('DOMContentLoaded', () => {
    
    // Dados dos produtos
    const products = [
        {
            id: "01",
            title: "Sorvete Blue Ice",
            desc: "Gelato artesanal ultra cremoso saborizado com creme de baunilha azul de Madagascar, infundido com cristais de açúcar que brilham sob o frio e servido sob uma névoa congelante de nitrogênio liquido.",
            price: "R$ 14,00",
            img: "image_117845.png" 
        },
        {
            id: "02",
            title: "Mochi Gelado",
            desc: "Deliciosa massa de arroz glutinoso recheada com sorvete artesanal refrescante, uma explosão de sabor.",
            price: "R$ 18,50",
            img: "https://via.placeholder.com/400x350/2C3E50/ffffff?text=Mochi+Gelado"
        },
        {
            id: "03",
            title: "Açaí Bowl",
            desc: "Açaí premium batido com frutas vermelhas, servido com granola artesanal e mel orgânico.",
            price: "R$ 22,00",
            img: "https://via.placeholder.com/400x350/8E44AD/ffffff?text=Acai+Bowl"
        },
        {
            id: "04",
            title: "Picolé Artístico",
            desc: "Picolé esculpido à mão com sabores exóticos de frutas tropicais e cobertura de chocolate branco.",
            price: "R$ 12,00",
            img: "https://via.placeholder.com/400x350/2980B9/ffffff?text=Picole+Artistico"
        }
    ];

    let currentIndex = 0;
    let isAnimating = false;

    // Pegando os elementos principais do HTML
    const mainImage = document.getElementById('main-image');
    const productTitle = document.getElementById('product-title');
    const productDesc = document.getElementById('product-desc');
    const productPrice = document.getElementById('product-price');
    const productCounter = document.getElementById('product-counter');

    // Pegando os botões das setinhas e as miniaturas
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const thumbCards = document.querySelectorAll('.thumb-card');

    // Elementos que sofrerão a animação
    const animatedElements = [mainImage, productTitle, productDesc, productPrice, productCounter];
    animatedElements.forEach(el => el.classList.add('fade-transition'));

    // Função para processar a animação e trocar os dados
    function updateDisplay(index) {
        if (isAnimating) return;
        isAnimating = true;

        animatedElements.forEach(el => el.classList.add('fade-out'));

        thumbCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        setTimeout(() => {
            const product = products[index];
            
            mainImage.src = product.img;
            productTitle.textContent = product.title;
            productDesc.textContent = product.desc;
            productPrice.textContent = product.price;
            productCounter.textContent = `${product.id}/0${products.length}`;

            animatedElements.forEach(el => el.classList.remove('fade-out'));
            
            setTimeout(() => {
                isAnimating = false;
            }, 300);

        }, 300);
    }

    // Interação ao clicar nas miniaturas
    thumbCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (currentIndex !== index) {
                currentIndex = index;
                updateDisplay(currentIndex);
            }
        });
    });

    // Interação ao clicar na Seta para a Direita
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if(!isAnimating) {
                currentIndex = (currentIndex + 1) % products.length;
                updateDisplay(currentIndex);
            }
        });
    }

    // Interação ao clicar na Seta para a Esquerda
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if(!isAnimating) {
                currentIndex = (currentIndex - 1 + products.length) % products.length;
                updateDisplay(currentIndex);
            }
        });
    }
});