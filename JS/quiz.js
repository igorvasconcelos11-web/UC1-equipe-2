const questions = document.querySelectorAll(".quiz-step");

const answers = document.querySelectorAll(".quiz-answer");

const results = document.getElementById("results");

const resultTitle = document.getElementById("result-title");

const resultDescription = document.getElementById("result-description");

const restartButton = document.getElementById("restart");

const resultImage = document.getElementById("result-image");

const resultCharacter = document.getElementById("result-character");


let currentQuestion = 0;

let scores = {
    chocolate: 0,
    morango: 0,
    coco: 0,
    limao: 0
};


/* ESCOLHER RESPOSTA */

answers.forEach(answer => {

    answer.addEventListener("click", () => {

        const value = answer.dataset.value;

        adicionarPonto(value);

        nextQuestion();

    });

});


/* ADICIONAR PONTOS */

function adicionarPonto(value) {

    if (value === "1") {
        scores.chocolate++;
    }

    if (value === "2") {
        scores.morango++;
    }

    if (value === "3") {
        scores.coco++;
    }

    if (value === "4") {
        scores.limao++;
    }

}


/* PRÓXIMA PERGUNTA */

function nextQuestion() {

    questions[currentQuestion].classList.remove("active");

    currentQuestion++;

    if (currentQuestion < questions.length) {

        questions[currentQuestion].classList.add("active");

    } else {

        showResult();

    }

}


/* MOSTRAR RESULTADO */

function showResult() {

    results.classList.add("show");

    const highestScore = Math.max(
        scores.chocolate,
        scores.morango,
        scores.coco,
        scores.limao
    );


    if (highestScore === scores.chocolate) {

        resultTitle.textContent = "🍪 Cookie Tico e Teco! 🍪";

        resultDescription.textContent =
            "Você é intenso, clássico e impossível de resistir. Assim como um bom Cookie, você deixa sua marca por onde passa!";

        resultImage.src = "imagens quiz/cookie.png";
        resultImage.alt = "Cookie";
        resultCharacter.src = "imagens quiz/tico-e-teco.png"; 
        resultCharacter.alt = "Tico e Teco";
    }

    else if (highestScore === scores.morango) {

        resultTitle.textContent = "🍓 Mochi de Morango da Mulan! 🍓";

        resultDescription.textContent =
            "Você é doce, romântico e cheio de personalidade. Uma combinação perfeita de leveza e sabor!";

        resultImage.src = "imagens quiz/mochimorango.png";
        resultImage.alt = "Mochi de Morango";
        resultCharacter.src = "imagens quiz/mulan.png";
        resultCharacter.alt = "Mulan";
    }

    else if (highestScore === scores.coco) {

        resultTitle.textContent = "🍩 Vanellope Dunet! 🍩";

        resultDescription.textContent =
            "Você é carinhoso, divertido e adora deixar tudo mais especial. Tem aquele jeitinho doce que conquista todo mundo!";

        resultImage.src = "imagens quiz/dunet.png";
        resultImage.alt = "Penelope Dunet";
        resultCharacter.src = "imagens quiz/vanellope.png";
        resultCharacter.alt = "Vanellope";
    }

    else {

        resultTitle.textContent = "🍎 Maça do Amor Branca de Neve! 🍎";

        resultDescription.textContent =
            "Você é criativo, refrescante e cheio de personalidade. Uma pessoa que definitivamente não passa despercebida!";

        resultImage.src = "imagens quiz/macadoamor.png";
        resultImage.alt = "Maça Neve do Amor";
        resultCharacter.src = "imagens quiz/brancadeneve.png";
        resultCharacter.alt = "Branca de Neve";
    }

}


/* REINICIAR QUIZ */

restartButton.addEventListener("click", () => {

    currentQuestion = 0;

    scores = {
        chocolate: 0,
        morango: 0,
        coco: 0,
        limao: 0
    };

    results.classList.remove("show");

    questions.forEach(question => {
        question.classList.remove("active");
    });

    questions[0].classList.add("active");

});