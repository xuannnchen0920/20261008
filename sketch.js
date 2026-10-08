// =====================================================
// p5.js 響應式選擇題測驗系統
// 支援電腦、平板、手機直向與橫向
// =====================================================

// 建立五道 p5.js 簡易指令練習題
const questions = [
  {
    // 設定第一題題目
    question: "在 p5.js 中，哪一個函式會在程式開始時執行一次？",

    // 設定第一題的四個選項
    options: ["draw()", "setup()", "start()", "begin()"],

    // 設定正確答案索引
    answer: 1
  },
  {
    // 設定第二題題目
    question: "在 p5.js 中，哪一個函式會持續重複執行？",

    // 設定第二題的四個選項
    options: ["setup()", "loop()", "draw()", "repeat()"],

    // 設定正確答案索引
    answer: 2
  },
  {
    // 設定第三題題目
    question: "下列哪一個指令可以在畫布上繪製橢圓形？",

    // 設定第三題的四個選項
    options: [
      "circle(x, y, size)",
      "ellipse(x, y, width, height)",
      "round(x, y, size)",
      "ball(x, y, size)"
    ],

    // 設定正確答案索引
    answer: 1
  },
  {
    // 設定第四題題目
    question: "哪一個指令可以設定圖形的填滿顏色？",

    // 設定第四題的四個選項
    options: ["stroke()", "background()", "fill()", "color()"],

    // 設定正確答案索引
    answer: 2
  },
  {
    // 設定第五題題目
    question: "哪一個指令可以設定畫布的背景顏色？",

    // 設定第五題的四個選項
    options: ["background()", "canvas()", "bgColor()", "screen()"],

    // 設定正確答案索引
    answer: 0
  }
];

// 設定目前題目編號
let currentQuestion = 0;

// 設定答對題數
let score = 0;

// 設定是否已經作答
let hasAnswered = false;

// 記錄使用者選擇的選項索引
let selectedOption = -1;

// 設定測驗是否完成
let quizFinished = false;

// 儲存目前所有元件的位置與大小
let layoutData = {};

// 儲存下一題按鈕的位置與大小
let nextButton = {
  // 設定按鈕 X 座標
  x: 0,

  // 設定按鈕 Y 座標
  y: 0,

  // 設定按鈕寬度
  width: 220,

  // 設定按鈕高度
  height: 58
};

// 儲存重新開始按鈕的位置與大小
let restartButton = {
  // 設定按鈕 X 座標
  x: 0,

  // 設定按鈕 Y 座標
  y: 0,

  // 設定按鈕寬度
  width: 240,

  // 設定按鈕高度
  height: 58
};

// 設定頁面背景顏色
const PAGE_BACKGROUND = "#F1F7F6";

// 設定題目方框背景顏色
const QUESTION_BOX_COLOR = "#1C7C54";

// 設定題目文字顏色
const QUESTION_TEXT_COLOR = "#FFFFFF";

// 設定正確選項背景顏色
const CORRECT_COLOR = "#75DDDD";

// 設定錯誤選項背景顏色
const WRONG_COLOR = "#1B512D";

// 設定一般選項背景顏色
const NORMAL_COLOR = "#FFFFFF";

// 設定主要文字顏色
const TEXT_COLOR = "#16302B";

// 設定按鈕背景顏色
const BUTTON_COLOR = "#2F7D6D";

// 設定外框顏色
const BORDER_COLOR = "#75A9A3";

// p5.js 初始化函式
function setup() {
  // 建立符合瀏覽器視窗大小的畫布
  createCanvas(windowWidth, windowHeight);

  // 設定文字水平置中
  textAlign(CENTER, CENTER);

  // 設定矩形以中心點為基準繪製
  rectMode(CENTER);

  // 設定文字自動換行模式
  textWrap(WORD);

  // 計算目前畫面的所有元件位置
  updateLayout();

  // 設定畫布可以接收觸控操作
  canvas.addEventListener("touchmove", preventTouchMove, {
    passive: false
  });
}

// p5.js 每一幀執行一次的繪圖函式
function draw() {
  // 重新計算目前畫面版面
  updateLayout();

  // 設定頁面背景顏色
  background(PAGE_BACKGROUND);

  // 判斷測驗是否完成
  if (quizFinished) {
    // 繪製結果畫面
    drawResultScreen();

    // 結束本次繪圖
    return;
  }

  // 繪製測驗標題
  drawTitle();

  // 繪製題目方框
  drawQuestionBox();

  // 繪製四個選項
  drawOptions();

  // 作答後繪製下一題按鈕
  if (hasAnswered) {
    // 繪製下一題按鈕
    drawNextButton();
  }
}

// 阻止手機觸控時頁面滑動
function preventTouchMove(event) {
  // 停止瀏覽器預設的頁面滑動
  event.preventDefault();
}

// 根據目前畫布大小重新計算版面
function updateLayout() {
  // 判斷目前是否為測驗結果頁面
  if (quizFinished) {
    // 計算結果頁版面
    layoutData = calculateResultLayout();
  } else {
    // 計算測驗頁版面
    layoutData = calculateQuizLayout();
  }
}

// 計算測驗頁面的響應式版面
function calculateQuizLayout() {
  // 取得目前畫布寬度
  const canvasWidth = width;

  // 取得目前畫布高度
  const canvasHeight = height;

  // 計算最小尺寸，用於設定響應式字體
  const minSize = min(canvasWidth, canvasHeight);

  // 判斷目前是否為手機直向
  const isPhonePortrait =
    canvasWidth < 600 && canvasHeight >= canvasWidth;

  // 判斷目前是否為手機橫向
  const isPhoneLandscape =
    canvasWidth < 900 &&
    canvasHeight < canvasWidth &&
    canvasHeight < 550;

  // 判斷目前是否為平板或中等尺寸
  const isTablet =
    canvasWidth >= 600 &&
    canvasWidth < 1200;

  // 設定標題位置
  const titleY = max(28, canvasHeight * 0.065);

  // 設定進度文字位置
  const progressY = max(62, canvasHeight * 0.12);

  // 設定中央題目方框寬度
  const questionWidth = min(canvasWidth * 0.78, 820);

  // 設定中央題目方框高度
  const questionHeight = constrain(canvasHeight * 0.20, 110, 180);

  // 將題目方框水平置中
  const questionX = canvasWidth / 2;

  // 將題目方框垂直置中
  const questionY = canvasHeight / 2;

  // 設定響應式選項寬度
  let optionWidth;

  // 設定響應式選項高度
  let optionHeight;

  // 設定選項間距
  let gap;

  // 設定版面模式
  let mode;

  // 手機直向採用單欄
  if (isPhonePortrait) {
    // 設定手機直向模式
    mode = "single";

    // 設定手機直向選項寬度
    optionWidth = min(canvasWidth * 0.88, 500);

    // 設定手機直向選項高度
    optionHeight = constrain(canvasHeight * 0.075, 42, 58);

    // 設定手機直向選項間距
    gap = constrain(canvasHeight * 0.018, 8, 16);
  } else if (isPhoneLandscape || isTablet) {
    // 手機橫向與平板採用雙欄
    mode = "dual";

    // 設定雙欄選項寬度
    optionWidth = min(canvasWidth * 0.36, 360);

    // 設定雙欄選項高度
    optionHeight = constrain(canvasHeight * 0.10, 42, 62);

    // 設定雙欄選項間距
    gap = constrain(canvasWidth * 0.025, 12, 28);
  } else {
    // 電腦寬螢幕採用四周排列
    mode = "desktop";

    // 設定電腦版選項寬度
    optionWidth = min(canvasWidth * 0.25, 360);

    // 設定電腦版選項高度
    optionHeight = constrain(canvasHeight * 0.09, 48, 68);

    // 設定電腦版選項間距
    gap = constrain(canvasWidth * 0.025, 20, 55);
  }

  // 建立四個選項的資料陣列
  const optionBounds = [];

  // 設定手機直向單欄的位置
  if (mode === "single") {
    // 設定選項總高度
    const totalHeight =
      optionHeight * 4 +
      gap * 3;

    // 設定選項起始 Y 座標
    const startY =
      questionY +
      questionHeight / 2 +
      gap +
      optionHeight / 2;

    // 逐一建立四個選項的位置
    for (let i = 0; i < 4; i++) {
      // 計算選項 Y 座標
      const optionY = startY + i * (optionHeight + gap);

      // 建立選項位置資料
      optionBounds.push({
        x: questionX,
        y: optionY,
        width: optionWidth,
        height: optionHeight
      });
    }
  }

  // 設定平板與手機橫向雙欄位置
  if (mode === "dual") {
    // 設定左右兩欄的 X 座標
    const leftX = canvasWidth * 0.25;
    const rightX = canvasWidth * 0.75;

    // 設定雙欄的上方 Y 座標
    const topY = canvasHeight * 0.32;

    // 設定雙欄的下方 Y 座標
    const bottomY = canvasHeight * 0.68;

    // 建立第一個選項位置
    optionBounds.push({
      x: leftX,
      y: topY,
      width: optionWidth,
      height: optionHeight
    });

    // 建立第二個選項位置
    optionBounds.push({
      x: rightX,
      y: topY,
      width: optionWidth,
      height: optionHeight
    });

    // 建立第三個選項位置
    optionBounds.push({
      x: leftX,
      y: bottomY,
      width: optionWidth,
      height: optionHeight
    });

    // 建立第四個選項位置
    optionBounds.push({
      x: rightX,
      y: bottomY,
      width: optionWidth,
      height: optionHeight
    });
  }

  // 設定電腦寬螢幕四周位置
  if (mode === "desktop") {
    // 設定題目方框左右邊界
    const boxLeft = questionX - questionWidth / 2;
    const boxRight = questionX + questionWidth / 2;

    // 設定左側選項 X 座標
    const leftX = max(optionWidth / 2 + 12, boxLeft - gap - optionWidth / 2);

    // 設定右側選項 X 座標
    const rightX = min(
      canvasWidth - optionWidth / 2 - 12,
      boxRight + gap + optionWidth / 2
    );

    // 設定上方選項 Y 座標
    const topY = questionY - questionHeight / 2;

    // 設定下方選項 Y 座標
    const bottomY = questionY + questionHeight / 2;

    // 建立第一個選項位置
    optionBounds.push({
      x: leftX,
      y: topY,
      width: optionWidth,
      height: optionHeight
    });

    // 建立第二個選項位置
    optionBounds.push({
      x: rightX,
      y: topY,
      width: optionWidth,
      height: optionHeight
    });

    // 建立第三個選項位置
    optionBounds.push({
      x: leftX,
      y: bottomY,
      width: optionWidth,
      height: optionHeight
    });

    // 建立第四個選項位置
    optionBounds.push({
      x: rightX,
      y: bottomY,
      width: optionWidth,
      height: optionHeight
    });
  }

  // 設定回饋文字位置
  const feedbackY = canvasHeight * 0.86;

  // 設定下一題按鈕寬度
  const buttonWidth = min(canvasWidth * 0.55, 230);

  // 設定下一題按鈕高度
  const buttonHeight = constrain(canvasHeight * 0.07, 44, 60);

  // 設定下一題按鈕位置
  const nextButtonData = {
    x: canvasWidth / 2,
    y: canvasHeight - buttonHeight / 2 - 12,
    width: buttonWidth,
    height: buttonHeight
  };

  // 回傳完整測驗版面資料
  return {
    // 儲存目前版面模式
    mode: mode,

    // 儲存畫布最小尺寸
    minSize: minSize,

    // 儲存標題位置
    titleY: titleY,

    // 儲存進度位置
    progressY: progressY,

    // 儲存題目方框資料
    questionBox: {
      x: questionX,
      y: questionY,
      width: questionWidth,
      height: questionHeight
    },

    // 儲存選項資料
    options: optionBounds,

    // 儲存回饋位置
    feedbackY: feedbackY,

    // 儲存下一題按鈕資料
    nextButton: nextButtonData
  };
}

// 計算結果頁響應式版面
function calculateResultLayout() {
  // 設定重新開始按鈕寬度
  const buttonWidth = min(width * 0.70, 260);

  // 設定重新開始按鈕高度
  const buttonHeight = constrain(height * 0.075, 46, 62);

  // 回傳結果頁面版面資料
  return {
    // 設定結果標題 Y 座標
    titleY: height * 0.25,

    // 設定分數文字 Y 座標
    scoreY: height * 0.42,

    // 設定鼓勵文字 Y 座標
    messageY: height * 0.54,

    // 設定重新開始按鈕資料
    restartButton: {
      x: width / 2,
      y: height * 0.70,
      width: buttonWidth,
      height: buttonHeight
    }
  };
}

// 繪製測驗標題
function drawTitle() {
  // 設定標題文字顏色
  fill(TEXT_COLOR);

  // 移除外框線
  noStroke();

  // 設定標題文字大小
  textSize(constrain(min(width, height) * 0.045, 22, 42));

  // 設定粗體文字
  textStyle(BOLD);

  // 顯示測驗標題
  text("p5.js 簡易指令練習測驗", width / 2, layoutData.titleY);

  // 恢復一般字體
  textStyle(NORMAL);

  // 設定進度文字大小
  textSize(constrain(min(width, height) * 0.022, 14, 22));

  // 顯示目前題數
  text(
    `第 ${currentQuestion + 1} 題／共 ${questions.length} 題`,
    width / 2,
    layoutData.progressY
  );
}

// 繪製中央題目方框
function drawQuestionBox() {
  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 取得題目方框資料
  const box = layoutData.questionBox;

  // 設定題目方框背景色
  fill(QUESTION_BOX_COLOR);

  // 移除方框外框
  noStroke();

  // 繪製題目方框
  rect(box.x, box.y, box.width, box.height, 20);

  // 設定題目文字顏色
  fill(QUESTION_TEXT_COLOR);

  // 設定題目文字大小
  textSize(constrain(min(width, height) * 0.027, 16, 28));

  // 顯示題目文字
  text(
    questionData.question,
    box.x,
    box.y,
    box.width * 0.86,
    box.height * 0.78
  );
}

// 取得套用動畫後的選項位置
function getAnimatedOptionBounds(index) {
  // 取得原始選項位置
  const original = layoutData.options[index];

  // 複製選項位置資料
  const animated = {
    x: original.x,
    y: original.y,
    width: original.width,
    height: original.height
  };

  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 判斷是否已經答錯
  if (hasAnswered && selectedOption !== questionData.answer) {
    // 正確選項上下跳動
    if (index === questionData.answer) {
      // 計算上下跳動位置
      animated.y += getCorrectBounceOffset();
    }

    // 錯誤選項左右移動
    if (index === selectedOption) {
      // 計算左右移動位置
      animated.x += getWrongShakeOffset();
    }
  }

  // 回傳動畫後位置
  return animated;
}

// 繪製四個選項
function drawOptions() {
  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 逐一繪製四個選項
  for (let i = 0; i < questionData.options.length; i++) {
    // 取得套用動畫後的選項位置
    const option = getAnimatedOptionBounds(i);

    // 設定選項背景顏色
    if (hasAnswered && i === questionData.answer) {
      // 正確答案使用淡藍色
      fill(CORRECT_COLOR);
    } else if (
      hasAnswered &&
      i === selectedOption &&
      selectedOption !== questionData.answer
    ) {
      // 選錯答案使用深綠色
      fill(WRONG_COLOR);
    } else {
      // 尚未選擇的選項使用白色
      fill(NORMAL_COLOR);
    }

    // 設定選項文字顏色
    if (
      hasAnswered &&
      i === selectedOption &&
      selectedOption !== questionData.answer
    ) {
      // 錯誤選項使用白色文字
      textColor("#FFFFFF");
    } else {
      // 其他選項使用深色文字
      textColor(TEXT_COLOR);
    }

    // 設定外框顏色
    stroke(BORDER_COLOR);

    // 設定外框粗細
    strokeWeight(2);

    // 繪製選項方框
    rect(option.x, option.y, option.width, option.height, 14);

    // 設定選項文字大小
    textSize(constrain(min(width, height) * 0.021, 14, 22));

    // 顯示選項文字
    text(
      `${String.fromCharCode(65 + i)}. ${questionData.options[i]}`,
      option.x,
      option.y,
      option.width * 0.88,
      option.height * 0.80
    );
  }

  // 移除外框
  noStroke();

  // 作答後顯示回饋
  if (hasAnswered) {
    // 繪製答題回饋
    drawFeedback();
  }
}

// 設定 p5.js 文字顏色的輔助函式
function textColor(colorValue) {
  // 設定文字填滿顏色
  fill(colorValue);
}

// 繪製答題回饋
function drawFeedback() {
  // 取得目前題目資料
  const questionData = questions[currentQuestion];

  // 設定回饋文字顏色
  fill(TEXT_COLOR);

  // 設定回饋文字大小
  textSize(constrain(min(width, height) * 0.022, 14, 22));

  // 判斷使用者是否答對
  if (selectedOption === questionData.answer) {
    // 顯示答對訊息
    text("答對了！做得很好！", width / 2, layoutData.feedbackY);
  } else {
    // 顯示答錯訊息
    text(
      `答錯了！正確答案是 ${String.fromCharCode(
        65 + questionData.answer
      )}。`,
      width / 2,
      layoutData.feedbackY
    );
  }
}

// 繪製下一題按鈕
function drawNextButton() {
  // 取得下一題按鈕版面資料
  const button = layoutData.nextButton;

  // 更新全域按鈕資料
  nextButton = button;

  // 設定按鈕背景顏色
  fill(BUTTON_COLOR);

  // 移除按鈕外框
  noStroke();

  // 繪製下一題按鈕
  rect(button.x, button.y, button.width, button.height, 14);

  // 設定按鈕文字顏色
  fill("#FFFFFF");

  // 設定按鈕文字大小
  textSize(constrain(min(width, height) * 0.022, 16, 22));

  // 判斷是否為最後一題
  if (currentQuestion === questions.length - 1) {
    // 顯示查看結果
    text("查看結果", button.x, button.y);
  } else {
    // 顯示下一題
    text("下一題", button.x, button.y);
  }
}

// 繪製結果頁面
function drawResultScreen() {
  // 取得結果頁版面資料
  const result = layoutData;

  // 更新重新開始按鈕資料
  restartButton = result.restartButton;

  // 設定結果標題顏色
  fill(TEXT_COLOR);

  // 設定結果標題文字大小
  textSize(constrain(min(width, height) * 0.055, 28, 52));

  // 設定粗體
  textStyle(BOLD);

  // 顯示測驗完成
  text("測驗完成！", width / 2, result.titleY);

  // 恢復一般字體
  textStyle(NORMAL);

  // 設定分數文字大小
  textSize(constrain(min(width, height) * 0.042, 24, 40));

  // 設定分數文字顏色
  fill(BUTTON_COLOR);

  // 顯示答對題數
  text(
    `你答對了 ${score} 題，共 ${questions.length} 題`,
    width / 2,
    result.scoreY
  );

  // 設定鼓勵文字大小
  textSize(constrain(min(width, height) * 0.026, 15, 25));

  // 設定鼓勵文字顏色
  fill(TEXT_COLOR);

  // 根據分數顯示不同訊息
  if (score === questions.length) {
    // 全部答對時顯示訊息
    text("太棒了！你已經熟悉 p5.js 基礎指令！", width / 2, result.messageY);
  } else if (score >= 3) {
    // 答對三題以上時顯示訊息
    text("表現不錯！繼續練習會越來越熟悉！", width / 2, result.messageY);
  } else {
    // 答對少於三題時顯示訊息
    text("再多練習幾次，就能掌握 p5.js 基礎指令！", width / 2, result.messageY);
  }

  // 設定重新開始按鈕背景
  fill(BUTTON_COLOR);

  // 繪製重新開始按鈕
  rect(
    restartButton.x,
    restartButton.y,
    restartButton.width,
    restartButton.height,
    14
  );

  // 設定按鈕文字顏色
  fill("#FFFFFF");

  // 設定按鈕文字大小
  textSize(constrain(min(width, height) * 0.022, 16, 22));

  // 顯示重新開始
  text("重新開始測驗", restartButton.x, restartButton.y);
}

// 處理滑鼠按下事件
function mousePressed() {
  // 處理滑鼠點擊
  handlePointerPress(mouseX, mouseY);

  // 防止瀏覽器預設行為
  return false;
}

// 處理觸控事件
function touchStarted() {
  // 判斷目前是否有觸控點
  if (touches.length > 0) {
    // 取得第一個觸控點 X 座標
    const touchX = touches[0].x;

    // 取得第一個觸控點 Y 座標
    const touchY = touches[0].y;

    // 處理觸控點擊
    handlePointerPress(touchX, touchY);
  }

  // 防止手機頁面滑動
  return false;
}

// 處理滑鼠與觸控點擊
function handlePointerPress(pointerX, pointerY) {
  // 先重新計算版面，確保旋轉或縮放後座標正確
  updateLayout();

  // 判斷是否位於結果頁
  if (quizFinished) {
    // 取得重新開始按鈕
    const button = layoutData.restartButton;

    // 判斷是否點擊重新開始按鈕
    if (
      isInsideRect(
        pointerX,
        pointerY,
        button.x,
        button.y,
        button.width,
        button.height
      )
    ) {
      // 重新開始測驗
      restartQuiz();
    }

    // 結束點擊處理
    return;
  }

  // 尚未作答時才可以點擊選項
  if (!hasAnswered) {
    // 逐一檢查四個選項
    for (let i = 0; i < layoutData.options.length; i++) {
      // 取得目前選項位置
      const option = layoutData.options[i];

      // 判斷是否點擊選項
      if (
        isInsideRect(
          pointerX,
          pointerY,
          option.x,
          option.y,
          option.width,
          option.height
        )
      ) {
        // 記錄使用者選擇
        selectOption(i);

        // 結束迴圈
        break;
      }
    }

    // 結束點擊處理
    return;
  }

  // 取得下一題按鈕
  const button = layoutData.nextButton;

  // 判斷是否點擊下一題按鈕
  if (
    isInsideRect(
      pointerX,
      pointerY,
      button.x,
      button.y,
      button.width,
      button.height
    )
  ) {
    // 前往下一題
    goToNextQuestion();
  }
}

// 判斷點擊位置是否在矩形內
function isInsideRect(pointerX, pointerY, centerX, centerY, boxWidth, boxHeight) {
  // 判斷 X 座標是否在範圍內
  const insideX =
    pointerX >= centerX - boxWidth / 2 &&
    pointerX <= centerX + boxWidth / 2;

  // 判斷 Y 座標是否在範圍內
  const insideY =
    pointerY >= centerY - boxHeight / 2 &&
    pointerY <= centerY + boxHeight / 2;

  // 回傳是否位於矩形範圍
  return insideX && insideY;
}

// 選擇答案並計分
function selectOption(optionIndex) {
  // 防止重複作答
  if (hasAnswered) {
    // 結束函式
    return;
  }

  // 記錄選擇的選項
  selectedOption = optionIndex;

  // 設定已經作答
  hasAnswered = true;

  // 取得目前題目
  const questionData = questions[currentQuestion];

  // 判斷是否答對
  if (optionIndex === questionData.answer) {
    // 答對時增加分數
    score++;
  }
}

// 前往下一題
function goToNextQuestion() {
  // 尚未作答時不能進入下一題
  if (!hasAnswered) {
    // 結束函式
    return;
  }

  // 判斷是否為最後一題
  if (currentQuestion === questions.length - 1) {
    // 設定測驗完成
    quizFinished = true;

    // 重新計算結果頁版面
    updateLayout();

    // 結束函式
    return;
  }

  // 題目編號加一
  currentQuestion++;

  // 重設作答狀態
  hasAnswered = false;

  // 清除選項紀錄
  selectedOption = -1;

  // 重新計算測驗版面
  updateLayout();
}

// 重新開始測驗
function restartQuiz() {
  // 回到第一題
  currentQuestion = 0;

  // 分數歸零
  score = 0;

  // 設定尚未作答
  hasAnswered = false;

  // 清除選項紀錄
  selectedOption = -1;

  // 設定測驗尚未完成
  quizFinished = false;

  // 重新計算測驗版面
  updateLayout();
}

// 計算錯誤選項的左右移動
function getWrongShakeOffset() {
  // 使用 sin 函式產生左右移動動畫
  return sin(frameCount * 0.35) * 12;
}

// 計算正確選項的上下跳動
function getCorrectBounceOffset() {
  // 使用絕對值產生向上跳動動畫
  return -abs(sin(frameCount * 0.18)) * 18;
}

// 處理視窗大小改變
function windowResized() {
  // 重新建立符合視窗大小的畫布
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算所有元件位置與尺寸
  updateLayout();
}

// 處理鍵盤操作
function keyPressed() {
  // 尚未作答時可以使用數字鍵選擇答案
  if (!quizFinished && !hasAnswered) {
    // 判斷是否按下 1 到 4
    if (key >= "1" && key <= "4") {
      // 將數字轉成選項索引
      selectOption(Number(key) - 1);
    }

    // 取得大寫英文字母
    const upperKey = key.toUpperCase();

    // 判斷是否按下 A 到 D
    if (upperKey >= "A" && upperKey <= "D") {
      // 將英文字母轉成選項索引
      const optionIndex = upperKey.charCodeAt(0) - 65;

      // 選擇對應選項
      selectOption(optionIndex);
    }
  }

  // 作答後按 Enter 或空白鍵進入下一題
  if (!quizFinished && hasAnswered && (keyCode === ENTER || key === " ")) {
    // 前往下一題
    goToNextQuestion();
  }

  // 結果頁按 R 重新開始
  if (quizFinished && key.toLowerCase() === "r") {
    // 重新開始測驗
    restartQuiz();
  }
}