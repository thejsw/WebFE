지난 _**'다크 모드에 색상이 바뀌는 계산기 만들기'**_ 프로젝트에서 HTML/CSS 뿐만 아니라, 
JavaScript로 **실제 계산 가능하도록** 프로젝트를 확장해 보았습니다.

https://velog.io/@jswtncapetnc/%EB%8B%A4%ED%81%AC-%EB%AA%A8%EB%93%9C%EC%97%90-%EC%83%89%EC%83%81%EC%9D%B4-%EB%B0%94%EB%80%8C%EB%8A%94-%EA%B3%84%EC%82%B0%EA%B8%B0-%EB%A7%8C%EB%93%A4%EA%B8%B0-HTMLCSS-3

이전 프로젝트는 이 글을 확인해주세요 :)

이 글에서는 계산기의 **UI/UX 구조와 스타일링(CSS)**에 대해 설명하고, 
사용자 친화적인 기능을 어떻게 구현했는지 소개합니다.

---

## 🧩 프로젝트 구성 개요

이 계산기는 다음과 같은 기능을 포함합니다:

- 기본 사칙연산 버튼 UI
- 소수점, 연산자 중복 방지
- 다크 모드 대응
- 결과 화면 출력
- 입력 내역 히스토리 패널
- localstorage를 이용한 계산 기록 저장 및 삭제

---

## 🏗️ HTML 구조

계산기의 뼈대는 크게 세 부분으로 나뉩니다:

1. `result` : 결과 출력과 히스토리 버튼
2. `history-container` : 계산 기록을 보여주는 패널
3. `buttons` : 실제 숫자와 연산자 버튼

```html
<div class="container">
  <div class="result">
    <p id="result-box"></p>
  </div>

  <div id="history=container">
    <button id="toggle-history-btn">📜 계산 기록</button>
    <div id="history-panel" class="hidden">
      <p id="empty-message" class="empty">계산 기록이 없습니다.</p>
      <ul id="history"></ul>
    </div>
  </div>

  <div class="buttons">
    <!-- 숫자/연산자 버튼들 -->
    <div class="button action-btn">AC</div>
    <div class="button action-btn">CE</div>
    <div class="button action-btn">⌫</div>
    <div class="button operator-btn">÷</div>
    ...
    <div class="button num-btn">000</div>
    <div class="button num-btn">0</div>
    <div class="button dot-btn">.</div>
    <div class="button action-btn">=</div>
  </div>
</div>
```

---

## 🎨 CSS 스타일링 (UX 중심)

### 📐 전체 컨테이너 구조




계산기의 전체 틀은 .container를 기준으로 **flex-column** 구조로 배치됩니다.
디자인에는 부드럽고 가벼운 외관과 함께 요소가 배경 위에 떠 있는 것처럼 보이는 **뉴포미즘** 스타일을 적용해 부드러운 그림자와 입체감을 주었습니다.

```css
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 320px;
  height: 550px;
  background: #dde1e7;
  box-shadow: -3px -3px 7px #ffffff73, 2px 2px 5px rgba(94, 104, 121, 0.288);
}
```

### 🧮 결과 출력 영역
사용자의 입력과 결과가 출력되는 부분입니다.

```css
.result p {
  font-size: 40pt;
  text-align: right;
  overflow-y: auto;
  margin: 0 15px;
}

```

### 🔢 버튼 그리드 구성
버튼들은 grid를 이용해 4열로 배치되며, 동그란 형태로 디자인되었습니다.

```css
.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1em;
}

.button {
  width: 60px;
  height: 50px;
  border-radius: 50%;
  font-size: 18px;
  display: grid;
  place-content: center;
  box-shadow: 2px 2px 5px #babecc, -5px -5px 10px #ffffff73;
}

```

### 🌗 다크 모드 대응
시스템 다크 모드에 따라 배경/글자색을 자동으로 전환합니다.

```css
@media (prefers-color-scheme: dark) {
  body, .container {
    background-color: rgba(74, 73, 73);
    color: white;
  }

  #toggle-history-btn {
    background-color: #444;
  }

  #history li:hover {
    background: #222;
  }
}

```

### 🧾 계산 기록 패널 (히스토리)
버튼을 누르면 위에 있는 패널이 내려오며 계산 기록을 보여주는 구조입니다.
position: absolute와 z-index를 활용해 버튼 위에 덮도록 구성했습니다.

```css
#history-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 335px;
  overflow-y: auto;
  background-color: #dde1e7;
  z-index: 10;
}

#history-panel.hidden {
  display: none;
}

```

빈 히스토리 상태에서는 "계산 기록이 없습니다"라는 메시지를 보여줍니다.

```css
#empty-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
  font-style: italic;
  color: gray;
  text-align: center;
}

```

---

## ✨ 마무리
CSS만으로도 꽤 직관적이고 예쁜 계산기 UI를 만들 수 있다는 점이 인상적이었습니다.
다음 포스팅에서는 JavaScript를 활용한 **계산 기능 구현**에 대해 다뤄보겠습니다.

**👉 다음 글 예고:
✅ 자바스크립트로 계산기 기능 구현하기 (입력 처리, 계산 알고리즘, 결과 출력)**
