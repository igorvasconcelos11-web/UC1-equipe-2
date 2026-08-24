const quizSteps = [...document.querySelectorAll(".quiz-step")];
const quizResult = document.querySelector("[data-quiz-result]");
const quizProgress = document.querySelector("[data-quiz-progress]");
const quizCounter = document.querySelector("[data-quiz-counter]");
const quizCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

const recommendations = {
  1: { id: "product-cookie-chocolate", name: "Cookie de Chocolate", price: 10, image: "assets/products/cookie-chocolate.png", character: "../assets/characters/tico-teco-cookie.png", description: "Você é intenso, clássico e impossível de resistir. Assim como um bom cookie, deixa sua marca por onde passa!" },
  2: { id: "product-mochi-morango", name: "Mochi de Morango", price: 15, image: "assets/products/mochi-morango.png", character: "../assets/characters/mulan-mochi.png", description: "Você é doce, romântico e cheio de personalidade: uma combinação perfeita de leveza e sabor!" },
  3: { id: "product-donut-rosa", name: "Donut Rosa", price: 12, image: "assets/products/donut-rosa.png", character: "../assets/characters/vanellope-donut.png", description: "Você é carinhoso, divertido e adora deixar tudo mais especial. Seu jeito doce conquista todo mundo!" },
  4: { id: "product-maca-do-amor", name: "Maçã do Amor", price: 11, image: "assets/products/maca-do-amor.png", character: "../assets/characters/branca-neve-maca.png", description: "Você é criativo, marcante e cheio de personalidade: alguém que definitivamente não passa despercebido!" },
};

let currentStep = 0;
let scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
let selectedRecommendation;

/** Atualiza o indicador conforme a pessoa avança pelo Quiz. */
function updateProgress() {
  quizProgress.style.width = `${((currentStep + 1) / quizSteps.length) * 100}%`;
  quizCounter.textContent = `${currentStep + 1} de ${quizSteps.length}`;
}

/** Exibe a recomendação com maior pontuação e seus dados de compra. */
function showRecommendation() {
  const winningValue = Object.keys(scores).reduce((winner, value) => scores[value] > scores[winner] ? value : winner, "1");
  selectedRecommendation = recommendations[winningValue];
  document.querySelector("[data-result-title]").textContent = selectedRecommendation.name;
  document.querySelector("[data-result-description]").textContent = selectedRecommendation.description;
  document.querySelector("[data-result-price]").textContent = quizCurrency.format(selectedRecommendation.price);
  document.querySelector("[data-result-image]").src = `../${selectedRecommendation.image}`;
  document.querySelector("[data-result-image]").alt = selectedRecommendation.name;
  document.querySelector("[data-result-character]").src = selectedRecommendation.character;
  document.querySelector("[data-result-character]").alt = `Personagem relacionado a ${selectedRecommendation.name}`;
  document.querySelector(".quiz-questions").hidden = true;
  quizCounter.hidden = true;
  quizProgress.parentElement.hidden = true;
  quizResult.classList.add("show");
}

document.querySelectorAll(".quiz-answer").forEach((answer) => {
  answer.addEventListener("click", () => {
    scores[answer.dataset.value] += 1;
    quizSteps[currentStep].classList.remove("active");
    currentStep += 1;
    if (currentStep < quizSteps.length) {
      quizSteps[currentStep].classList.add("active");
      updateProgress();
    } else showRecommendation();
  });
});

document.querySelector("[data-quiz-add]").addEventListener("click", () => {
  if (!selectedRecommendation) return;
  window.DoceCart?.addItem(selectedRecommendation);
});

document.querySelector("[data-quiz-restart]").addEventListener("click", () => {
  currentStep = 0;
  scores = { 1: 0, 2: 0, 3: 0, 4: 0 };
  selectedRecommendation = undefined;
  quizResult.classList.remove("show");
  document.querySelector(".quiz-questions").hidden = false;
  quizCounter.hidden = false;
  quizProgress.parentElement.hidden = false;
  quizSteps.forEach((step, index) => step.classList.toggle("active", index === 0));
  updateProgress();
});

updateProgress();
