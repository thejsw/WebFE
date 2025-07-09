// HTML 요소 가져오기
const resultBox = document.getElementById("result-box");
const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".operator-btn");
const actionBtns = document.querySelectorAll(".action-btn");

// 현재 입력 중인 수식 저장할 변수
let currentInput = "";

// 숫자, 연산자 버튼 클릭 이벤트 등록
numBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;
    currentInput += value;
    resultBox.innerHTML = currentInput;
  });
});

operatorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;
    currentInput += value;
    resultBox.innerHTML = currentInput;
  });
});

// = 버튼을 누르면 계산 처리
actionBtns.forEach((btn) => {
  if (btn.textContent === "=") {
    btn.addEventListener("click", () => {
      try {
        // 연산자 기호 변환
        const expression = currentInput.replace(/×/g, "*").replace(/÷/g, "/");

        const result = eval(expression);
        resultBox.innerHTML = result;
        currentInput = "";
      } catch (err) {
        resultBox.innerHTML = "Error";
        currentInput = "";
      }
    });
  }
});
