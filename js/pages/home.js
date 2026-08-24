const featuredCarousel = document.querySelector("#featured-products-carousel");
const carouselArrows = document.querySelectorAll("[data-carousel-direction]");
let carouselIsAnimating = false;

/**
 * Mantém as setas coerentes com o início e o fim da lista.
 */
function updateCarouselArrows() {
  if (!featuredCarousel) return;

  const maximumScroll = featuredCarousel.scrollWidth - featuredCarousel.clientWidth;
  carouselArrows.forEach((arrow) => {
    const direction = Number(arrow.dataset.carouselDirection);
    arrow.disabled = carouselIsAnimating || (direction < 0
      ? featuredCarousel.scrollLeft <= 2
      : featuredCarousel.scrollLeft >= maximumScroll - 2);
  });
}

/**
 * Anima a rolagem com uma desaceleração suave até o próximo card.
 */
function moveFeaturedCarousel(direction) {
  const card = featuredCarousel?.querySelector(".home-card");
  if (!card || carouselIsAnimating) return;

  const gap = Number.parseFloat(getComputedStyle(featuredCarousel).columnGap) || 0;
  const startPosition = featuredCarousel.scrollLeft;
  const maximumScroll = featuredCarousel.scrollWidth - featuredCarousel.clientWidth;
  const targetPosition = Math.min(
    maximumScroll,
    Math.max(0, startPosition + direction * (card.getBoundingClientRect().width + gap)),
  );

  carouselIsAnimating = true;
  featuredCarousel.classList.add("is-animating");
  updateCarouselArrows();

  const duration = 700;
  let animationStart;

  function animateScroll(timestamp) {
    animationStart ??= timestamp;
    const progress = Math.min((timestamp - animationStart) / duration, 1);
    const easedProgress = progress < 0.5
      ? 4 * progress ** 3
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    featuredCarousel.scrollLeft = startPosition + (targetPosition - startPosition) * easedProgress;

    if (progress < 1) {
      window.requestAnimationFrame(animateScroll);
      return;
    }

    carouselIsAnimating = false;
    featuredCarousel.classList.remove("is-animating");
    updateCarouselArrows();
  }

  window.requestAnimationFrame(animateScroll);
}

carouselArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => moveFeaturedCarousel(Number(arrow.dataset.carouselDirection)));
});

featuredCarousel?.addEventListener("scroll", updateCarouselArrows, { passive: true });
window.addEventListener("resize", updateCarouselArrows);
updateCarouselArrows();
