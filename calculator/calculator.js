// DOM 요소 가져오기
const display = document.querySelectorAll(".result"); // 결과 보여줄 화면
const buttons = document.querySelectorAll(".button"); // 모든 벼튼 노드 리스트

// 계산기에 필요한 상태(state)
let currentInput = ""; // 사용자가 누르는 숫자,연산자를 이어 붙인 문자열
let result = null; // 마지막 계산 결과

document.addEventListener("DOMContentLoaded", () => {
  // 메인: 모든 버튼에 클릭 이벤트 등록
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // 어떤 버튼이 눌렸는지 콘솔에 출력
      handleClick(button.textContent);
      console.log("버튼 클릭됨:", button.textContent);

      // 결과창 요소가 잘 연결됐는지도 확인
      const resultBox = document.getElementById("result-box");
      console.log("result-box:", resultBox);
    });
  });

  // 1. 버튼 클릭 처리
  let handleClick = (value) => {
    if (value === "=") {
      if (currentInput.trim() === "") return; // 빈 입력 예외처리
      result = evaluateExpression(currentInput); // 직접 만든 계산 함수 호출
      console.log(result);
      display.textContent = result; // 결과 표시
      currentInput = result.toString(); // 겨로가를 다음 입력의 시작으로
      return;
    }

    // 숫자,연산자,소수점 버튼이면 화면에 이어쓰기
    currentInput += value;
    display.textContent = currentInput;
  };

  // 2. 수식 계산
  let evaluateExpression = (expr) => {
    // 2-1) 공백 제거 후 토큰화
    const tokens = expr.replace(/\s+/g, "").match(/(\d+(\.\d+)?)|[+\-*/]/g);

    if (!tokens) throw new Error("Invalid Expression");

    // 2-2) 1차 스캔: 곱하기, 나누기 우선 계산
    const firstPass = [];
    let i = 0;
    while (i < tokens.length) {
      const token = tokens[i];
      if (token === "×" || token === "÷") {
        const prev = parseFloat(firstPass.pop());
        const next = parseFloat(tokens[++i]);
        const temp = token === "×" ? prev * next : prev / next;
        firstPass.push(temp.toString());
      } else {
        firstPass.push(token);
      }
      i++;
    }

    /* 2‑3) 2차 스캔:  +, -  계산 (왼→오 순서) */
    let result = parseFloat(firstPass[0]);
    for (let j = 1; j < firstPass.length; j += 2) {
      const operator = firstPass[j];
      const nextVal = parseFloat(firstPass[j + 1]);
      result = operator === "+" ? result + nextVal : result - nextVal;
    }

    /* 2‑4) 유효하지 않은 숫자 처리 */
    if (Number.isNaN(result) || !Number.isFinite(result)) {
      throw new Error("Calculation Error");
    }
    return result;
  };
});
