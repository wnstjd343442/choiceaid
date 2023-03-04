const main = document.querySelector("#main");
const qna = document.querySelector("#qna");
const loading = document.querySelector("#loading");
const result = document.querySelector("#result");

const endPoint = qnaList.length;
const sentence = [];

function begin() {
  main.style.WebkitAnimation = "fadeOut 1s";
  main.style.animation = "fadeOut 1s";
  setTimeout(() => {
    qna.style.WebkitAnimation = "fadeIn 1s";
    qna.style.animation = "fadeIn 1s";
    setTimeout(() => {
      main.style.display = "none";
      qna.style.display = "flex";
    }, 400);
    let qIdx = 0;
    goNext(qIdx);
  }, 400);
}

function goNext(qIdx) {
  var status = document.querySelector(".status");

  if (qIdx === endPoint) {
    status.innerHTML = "100%";
    goResult();
    return;
  }

  var q = document.querySelector(".qBox");

  q.innerHTML = qnaList[qIdx].q;
  for (let i in qnaList[qIdx].a) {
    addAnswer(qnaList[qIdx].a[i].aBox, qIdx, i);
  }

  var statusNumber = (100 / endPoint) * (qIdx + 0);

  console.log(Math.ceil(statusNumber));
  status.innerHTML = Math.ceil(statusNumber) + "%";
}

function addAnswer(answerText, qIdx, idx) {
  var a = document.querySelector(".answerBox");
  var answer = document.createElement("button");
  answer.classList.add("answerList");
  answer.classList.add("fadeIn");

  a.appendChild(answer);
  answer.innerHTML = answerText;

  answer.addEventListener(
    "click",
    function () {
      var children = document.querySelectorAll(".answerList");
      for (let i = 0; i < children.length; i++) {
        children[i].disabled = true;
        children[i].style.WebkitAnimation = "fadeOut 0.5s";
        children[i].style.animation = "fadeOut 0.5s";
      }
      setTimeout(() => {
        var target = qnaList[qIdx].a[idx].type;
        for (let i = 0; i < target.length; i++) {
          sentence.push(target[i]);
          console.log(sentence);
        }

        for (let i = 0; i < children.length; i++) {
          children[i].style.display = "none";
        }
        goNext(++qIdx);
      }, 450);
    },
    false
  );
}

function goResult() {
  qna.style.WebkitAnimation = "fadeOut 1s";
  qna.style.animation = "fadeOut 1s";
  setTimeout(() => {
    result.style.WebkitAnimation = "fadeIn 1s";
    result.style.animation = "fadeIn 1s";
    setTimeout(() => {
      qna.style.display = "none";
      loading.style.display = "flex";
    }, 450);
  });
  calResult();
}

async function calResult() {
  const loadingP = document.querySelector(".loading-p");
  sentence.push(
    `, can you recommend one unique sport or exercise and reason with image link? (answer plase give me using Json form like {"sport": sport, "sportDes": reason, "image": image link}then put single quote first and last)`
  );

  let fullSentence = sentence.join("");
  console.log(fullSentence);

  setTimeout(() => {
    setTimeout(() => {
      loadingP.innerHTML = "I am finding the result, please wait a second";
    }, 10000);

    loadingP.innerHTML = "Something wrong, please try again later ";
  }, 20000);

  const response = await fetch("http://localhost:5000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: fullSentence,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
    const text = eval(parsedData);

    const myJSON = JSON.parse(text);

    setResult(myJSON);
    loading.style.display = "none";
    result.style.display = "flex";
  } else {
    const err = await response.text();

    loadingP.innerHTML = "Something went wrong please try again later";
    alert(err);
  }
}

async function setResult(answer) {
  const resultTitle = document.querySelector(".resultTitle");
  const resultanswer = document.querySelector(".resultanswer");
  const resultImgae = document.querySelector("img");

  // let src = answer.image;
  // console.log(src);

  // resultImgae.src = src;
  resultTitle.innerHTML = answer.sport;
  resultanswer.innerHTML = answer.sportDes;
}
