// HTML 요소 가져오기
const resultBox = document.getElementById("result-box");
const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".operator-btn");
const actionBtns = document.querySelectorAll(".action-btn");
const dotBtn = document.querySelectorAll(".dot-btn");
const historyEl = document.getElementById("history");
const historyPanel = document.getElementById("history-panel");
const emptyMessage = document.getElementById("empty-message");
const toggleBtn = document.getElementById("toggle-history-btn");

// 현재 입력 중인 수식 저장할 변수
let currentInput = "";
let isDotEntered = false;
let historyList = [];

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
    const lastChar = currentInput.slice(-1);
    // 연산자 중복 입력 방지
    const isOperator = (char) => ["+", "-", "÷", "×"].includes(char);
    if (currentInput === "" || isOperator(lastChar) || lastChar === ".") {
      return;
    }
    currentInput += value;
    resultBox.innerHTML = currentInput;
    isDotEntered = false;
  });
});

// = 버튼을 누르면 계산 처리
actionBtns.forEach((btn) => {
  if (btn.textContent === "=") {
    btn.addEventListener("click", () => {
      try {
        const result = evaluateExpression(currentInput);
        resultBox.innerHTML = result;
        // 계산 기록 저장
        addToHistory(currentInput, result);

        currentInput = "";
      } catch (err) {
        resultBox.innerHTML = "Error";
        currentInput = "";
      }
      isDotEntered = false;
    });
  }
});

// 소수점 중복 입력 방지
dotBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (isDotEntered === false) {
      // 입력이 처음이거나 마지막이 연산자면 "0."부터 시작
      if (currentInput === "" || /[+\-*/]$/.test(currentInput)) {
        currentInput += "0.";
      } else {
        currentInput += value;
      }

      resultBox.innerHTML = currentInput;
      isDotEntered = true; // 중복 방지
    }
  });
});

// 백스페이스 기능 및 클리어 기능
actionBtns.forEach((btn) => {
  if (btn.textContent === "⌫") {
    btn.addEventListener("click", () => {
      if (currentInput.length > 0) {
        const removedChar = currentInput.slice(-1);
        currentInput = currentInput.slice(0, -1);
        if (removedChar === ".") {
          isDotEntered = false;
        }
        resultBox.innerHTML = currentInput;
      }
    });
  }
  if (btn.textContent === "CE") {
    btn.addEventListener("click", () => {
      currentInput = "";
      resultBox.innerHTML = currentInput;
    });
  }
  if (btn.textContent === "AC") {
    btn.addEventListener("click", () => {
      localStorage.removeItem("calc-history");
      historyList = [];
      currentInput = "";
      resultBox.innerHTML = currentInput;
      historyEl.innerHTML = "";

      emptyMessage.style.display = "flex";
    });
  }
});

// 계산 기록 추가 함수
const addToHistory = (expression, result) => {
  const item = `${expression} = ${result}`;
  historyList.unshift(item);

  // 최신 10개까지만 저장
  if (historyList.length > 10) {
    historyList.pop();
  }

  renderHistory();
  saveHistoryToStorage();
};

// 계산 기록 출력 함수
const renderHistory = () => {
  historyEl.innerHTML = "";

  if (historyList.length === 0) {
    emptyMessage.style.display = "flex";
  } else {
    emptyMessage.style.display = "none";
  }

  historyList.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;

    li.addEventListener("click", () => {
      const [expression] = entry.split(" = ");
      currentInput = expression;
      resultBox.innerHTML = currentInput;
      historyPanel.classList.add("hidden");
    });

    historyEl.appendChild(li);
  });
};

// 계산 기록 토글 버튼
toggleBtn.addEventListener("click", () => {
  historyPanel.classList.toggle("hidden");
});

// 계산 기록 localStorage 연동 및 불러오기
function saveHistoryToStorage() {
  localStorage.setItem("calc-history", JSON.stringify(historyList));
}

function loadHistoryFromStorage() {
  const saved = localStorage.getItem("calc-history");
  if (saved) {
    historyList = JSON.parse(saved);
    renderHistory();
  }
}
loadHistoryFromStorage();

// Shunting Yard 알고리즘을 이용한 계산 로직
const evaluateExpression = (expression) => {
  // 공백 없이도 분리 가능하게 수정
  function tokenize(expression) {
    const tokens = [];
    let num = "";
    for (let ch of expression.replace(/×/g, "*").replace(/÷/g, "/")) {
      if ("0123456789.".includes(ch)) {
        num += ch;
      } else if ("+-*/".includes(ch)) {
        if (num !== "") {
          tokens.push(num);
          num = "";
        }
        tokens.push(ch);
      }
    }
    if (num !== "") tokens.push(num);
    return tokens;
  }

  const tokens = tokenize(expression);
  const outputQueue = [];
  const operatorStack = [];

  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
  };

  const applyOperator = (a, b, operator) => {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
    }
  };

  // Shunting Yard 알고리즘으로 중위표기 -> 후위표기 변환
  // 예시 입력: ["3", "+", "4", "*", "2"]
  // 출력 큐 (후위표기): ["3", "4", "2", "*", "+"]
  tokens.forEach((token) => {
    if (!isNaN(token)) {
      // 숫자라면 그대로 출력 큐에 추가
      outputQueue.push(token);
    } else if (["+", "-", "*", "/"].includes(token)) {
      // 연산자일 경우
      while (
        operatorStack.length && // 스택에 연산자가 남아 있고
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token] // 스택 위 연산자의 우선순위가 현재 연산자보다 높으면
      ) {
        outputQueue.push(operatorStack.pop()); // 스택에서 연산자를 꺼내 출력 큐에 넣음 (우선순위 높은 연산자부터 처리)
      }
      operatorStack.push(token); // 현재 연산자를 스택에 추가
    }
  });

  // 남아 있는 연산자를 출력 큐로 이동
  while (operatorStack.length) {
    outputQueue.push(operatorStack.pop());
  }

  // 후위표기법 계산
  const stack = [];
  outputQueue.forEach((token) => {
    if (!isNaN(token)) {
      // 숫자라면 스택에 push
      stack.push(token);
    } else {
      // 연산자라면 스택에서 숫자 2개를 꺼내 연산 수행
      const b = stack.pop(); // 오른쪽 피연산자
      const a = stack.pop(); // 왼쪽 피연산자
      stack.push(applyOperator(a, b, token)); // 계산 결과를 다시 스택에 push
    }
  });

  // 스택에 남아 있는 하나의 값이 최종 계산 결과가 됨
  return stack[0];
};
