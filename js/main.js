const $ownDrinkList = document.querySelector("#ownDrinkList");
const $vendingMenu = document.querySelector("#vendingMenu");
const $shoppingList = document.querySelector("#shoppingList");
const $totalMoney = document.querySelector("#totalMoney");
const $leftMoney = document.querySelector("#leftMoney");
const $getButton = document.querySelector("#getButton");
const $inputMoneyBtn = document.querySelector("#inputMoneyBtn");
const $moneyInput = document.querySelector("#money_input");
const $MoneyReturnBtn = document.querySelector("#MoneyReturnBtn");
const $totalPay = document.querySelector("#totalPay");

let totalMoney = 25000;
let leftMoney = 1000;

const drinkType = [
  {
    id: 1,
    name: "Original_Cola",
    imgPath: "img/Original_Cola.png",
    alt: "빨간 오리지널 캔 콜라",
    price: 1000,
    count: 3,
  },
  {
    id: 2,
    name: "Violet_Cola",
    imgPath: "img/Violet_Cola.png",
    alt: "보라색 캔 콜라",
    price: 1000,
    count: 0,
  },
  {
    id: 3,
    name: "Yellow_Cola",
    imgPath: "img/Yellow_Cola.png",
    alt: "노란 캔 콜라",
    price: 1000,
    count: 3,
  },
  {
    id: 4,
    name: "Cool_Cola",
    imgPath: "img/Cool_Cola.png",
    alt: "하늘색 캔 콜라",
    price: 1000,
    count: 3,
  },
  {
    id: 5,
    name: "Green_Cola",
    imgPath: "img/Green_Cola.png",
    alt: "녹색 캔 콜라",
    price: 1000,
    count: 3,
  },
  {
    id: 6,
    name: "Orange_Cola",
    imgPath: "img/Orange_Cola.png",
    alt: "오렌지색 캔 콜라",
    price: 1000,
    count: 3,
  },
];

let ownColaList = [
  { name: "Original_Cola", count: 1 },
  { name: "Green_Cola", count: 2 },
  { name: "Orange_Cola", count: 1 },
  { name: "Violet_Cola", count: 5 },
];

let tempList = [
  { name: "Original_Cola", count: 1 },
  { name: "Green_Cola", count: 2 },
];

// drinkType에서 이름으로 매치되는 콜라 찾기
function searchDrinkList(colaName) {
  return drinkType.find((cola) => cola.name == colaName);
}

// tempList에서 이름으로 매치되는 콜라 찾기
function searchTempList(colaName) {
  return tempList.find((cola) => cola.name == colaName);
}

// 콜라 장바구니 속 아이템 그리기
function drawDrink(tempDrinkItem) {
  const drinkObj = searchDrinkList(tempDrinkItem.name);
  const li = document.createElement("li");
  const img = document.createElement("img");
  const span = document.createElement("span");
  const div = document.createElement("div");
  li.classList = "own_cola_item";
  div.classList = "item_count";
  div.textContent = tempDrinkItem.count;
  img.src = drinkObj.imgPath;
  img.alt = drinkObj.alt;
  span.textContent = drinkObj.name;
  li.append(img, span, div);
  return li;
}

//벤딩 머신 음료 리스트 아이템 그리기
function drawVendingItem(drinkItem) {
  const drinkObj = searchDrinkList(drinkItem.name);
  const li = document.createElement("li");
  const img = document.createElement("img");
  const div = document.createElement("div");
  const span = document.createElement("span");
  const button = document.createElement("button");

  if (drinkObj.count == 0) {
    li.classList.toggle("sold_out");
  }

  if (menuInTempList(drinkObj.name)) {
    li.classList.add("select");
  }
  li.classList.add("cola_wrapper");
  img.src = drinkObj.imgPath;
  img.alt = drinkObj.alt;
  span.textContent = drinkObj.name;
  span.classList.add("cola_name");
  button.type = "button";
  button.classList.add("buy_button");
  button.textContent = drinkObj.price;
  div.classList = "cola_caption";
  div.append(span, button);
  li.append(img, div);
  eventListener(li);
  return li;
}

// 소유한 콜라 목록 그리기
function drawOwnColaList(drinkArr) {
  const $frag = document.createDocumentFragment();
  $ownDrinkList.textContent = "";
  let totalPrice = 0;
  drinkArr.map((obj) => {
    $frag.append(drawDrink(obj));

    const result = drinkType.find((cola) => cola.name == obj.name);
    // 총 가격
    totalPrice += result.price * obj.count;
  });
  $ownDrinkList.append($frag);
  $totalPay.innerText = totalPrice.toLocaleString();
}

// 장바구니속 콜라 아이템 그리기
function drawShoppingListItem(drinkArr) {
  $shoppingList.textContent = "";
  drinkArr.forEach((obj) => {
    const li = drawDrink(obj);
    li.addEventListener("click", handleShoppingItem);
    $shoppingList.append(li);
  });
}

// 벤딩머신 음료 메뉴 그리기
function drawVendingMenu(drinkArr) {
  $vendingMenu.textContent = "";
  const $frag = document.createDocumentFragment();
  drinkArr.forEach((obj) => {
    $frag.append(drawVendingItem(obj));
  });
  $vendingMenu.append($frag);
}
// 장바구니 목록에 있는 아이템이 메뉴에 있는 아이템인지 bool 반환
function menuInTempList(name) {
  return tempList.some((tempCola) => tempCola.name == name);
}

// 총 소지금 텍스트 변경
function totalMoneySet() {
  $totalMoney.innerText = totalMoney.toLocaleString();
}

// 잔여금 텍스트 변경
function leftMoneySet() {
  $leftMoney.innerText = leftMoney.toLocaleString();
}

// 메뉴 클릭시 잔여금에서 금액 변경
function spendMoney(cost) {
  if (leftMoney - cost >= 0) {
    leftMoney -= cost;
    leftMoneySet();
    return true;
  } else {
    alert("소지금이 부족합니다. 입금해주세요.");
    return false;
  }
}

// 구매버튼 클릭 시
function handleBuyButton(event) {
  const colaName = event.currentTarget.querySelector(".cola_name").textContent;

  const drinkTypeItem = searchDrinkList(colaName);

  if (drinkTypeItem.count > 0) {
    const tempColaListItem = searchTempList(drinkTypeItem.name);

    if (tempColaListItem) {
      const haveMoney = spendMoney(drinkTypeItem.price);
      if (!haveMoney) {
        return;
      }
      tempColaListItem.count += 1;
      drinkTypeItem.count -= 1;
      drawVendingMenu(drinkType);
      drawShoppingListItem(tempList);
    } else {
      const haveMoney = spendMoney(drinkTypeItem.price);
      if (!haveMoney) {
        return;
      }
      drinkTypeItem.count -= 1;
      tempList.push({ name: drinkTypeItem.name, count: 1 });
      drawVendingMenu(drinkType);
      drawShoppingListItem(tempList);
    }
  } else {
    alert("해당 음료는 매진되었습니다.");
  }
}

// 장바구니에 있는 음료목록 획득한 음료목록으로 이동
function pushTempToOwn() {
  let excluded = [];
  ownColaList.forEach((ownCola) => {
    tempList.forEach((tempCola) => {
      if (ownCola.name == tempCola.name) {
        excluded.push(tempCola);
        ownCola.count += tempCola.count;
        drawOwnColaList(ownColaList);
      }
    });
  });
  const result = tempList.filter((temCola) => {
    return !ownColaList.some((ownCola) => temCola.name === ownCola.name);
  });
  tempList = [];
  ownColaList.push(...result);
  drawOwnColaList(ownColaList);
  drawShoppingListItem(tempList);
  drawVendingMenu(drinkType);
}

// 잔돈반환버튼 눌렀을시
function handleMoneyReturnBtn() {
  totalMoney += leftMoney;
  leftMoney = 0;
  totalMoneySet();
  leftMoneySet();
}

// 장바구니에 있는 아이템 클릭햇을때
function handleShoppingItem() {
  let index = 0;
  // 클릭한 요소가 tempList와 비교해서 참조하는 객체 가져오기
  const findCola = tempList.find((tempCola, cola_index) => {
    // 여기서 this는 Event의 currentTarget과 동일
    const isMatched = tempCola.name == this.getElementsByTagName("span")[0].textContent;
    if (isMatched) {
      index = cola_index;
    }
    return isMatched;
  });

  const drinkItem = searchDrinkList(findCola.name);
  // 장바구니 아이템들을 눌렀을때 수량이 0이된다면 장바구니에서 삭제
  if (findCola.count - 1 == 0) {
    tempList.splice(index, 1);
  } else {
    findCola.count -= 1;
  }
  //환불되었으니 DB에 있는 음료 수량 증가
  drinkItem.count += 1;
  leftMoney += drinkItem.price;
  leftMoneySet();
  drawShoppingListItem(tempList);
  drawVendingMenu(drinkType);
}

// 입력한 금액을 총 소지금에서 입금
function inputMoney(event) {
  event.preventDefault();

  if ($moneyInput.value == "") {
    return alert("금액을 입력해주세요.");
  }
  if (totalMoney - parseInt($moneyInput.value) >= 0) {
    totalMoney -= parseInt($moneyInput.value);
    leftMoney += parseInt($moneyInput.value);
    $moneyInput.value = "";
    totalMoneySet();
    leftMoneySet();
  } else {
    alert("금액이 부족합니다.");
  }
}

// 메뉴아이템마다 이벤트리스너 추가
function eventListener(drinkitem) {
  drinkitem.addEventListener("click", handleBuyButton);
}

// 초기화
function init() {
  $getButton.addEventListener("click", pushTempToOwn);
  $inputMoneyBtn.addEventListener("click", inputMoney);
  $MoneyReturnBtn.addEventListener("click", handleMoneyReturnBtn);
  totalMoneySet();
  leftMoneySet();
  drawOwnColaList(ownColaList);
  drawShoppingListItem(tempList);
  drawVendingMenu(drinkType);
}

init();
