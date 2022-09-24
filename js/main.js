const $ownDrinkList = document.querySelector("#ownDrinkList");
const $vendingMenu = document.querySelector("#vendingMenu");
const $shoppingList = document.querySelector("#shoppingList");
const $totalMoney = document.querySelector("#totalMoney");
const $leftMoney = document.querySelector("#leftMoney");
const $getButton = document.querySelector("#getButton");
const $inputMoneyBtn = document.querySelector("#inputMoneyBtn");
const $moneyInput = document.querySelector("#money_input");
const $vendingItem = document.getElementsByClassName("cola_wrapper");
const $MoneyReturnBtn = document.querySelector("#MoneyReturnBtn");

let totalMoney = 25000;
let leftMoney = 1000;

const tempStorage = [
  { name: "Original_Cola", count: 1, imgPath: "img/Original_Cola.png" },
  { name: "Green_Cola", count: 2, imgPath: "img/Green_Cola.png" },
];
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

function drinkMatch(obj) {
  const [drinkObj] = drinkType.filter((drink) => drink.name == obj.name);
  return drinkObj;
}

function drawDrink(obj) {
  const drinkObj = drinkMatch(obj);
  const li = document.createElement("li");
  const img = document.createElement("img");
  const span = document.createElement("span");
  const div = document.createElement("div");
  li.classList = "own_cola_item";
  div.classList = "item_count";
  div.innerText = obj.count;
  img.src = drinkObj.imgPath;
  img.alt = drinkObj.alt;
  span.innerHTML = drinkObj.name;
  li.append(img, span, div);
  return li;
}

function drawOwnColaList(drinkArr) {
  $ownDrinkList.innerHTML = "";
  drinkArr.map((obj) => {
    const li = drawDrink(obj);
    $ownDrinkList.append(li);
  });
}
function drawShoppingListItem(drinkArr) {
  $shoppingList.innerHTML = "";
  drinkArr.forEach((obj) => {
    const li = drawDrink(obj);
    $shoppingList.append(li);
  });
}

function drawVendingMenu(drinkArr) {
  $vendingMenu.innerHTML = "";
  drinkArr.forEach((obj) => {
    const drinkObj = drinkMatch(obj);
    const li = document.createElement("li");
    const img = document.createElement("img");
    const div = document.createElement("div");
    const span = document.createElement("span");
    const button = document.createElement("button");

    if (drinkObj.count == 0) {
      li.classList = "cola_wrapper sold_out";
    } else {
      li.classList = "cola_wrapper";
    }
    if (menuInTempList(drinkObj.name)) {
      li.classList.add("select");
    }
    img.src = drinkObj.imgPath;
    img.alt = drinkObj.alt;
    span.innerText = drinkObj.name;
    button.type = "button";
    button.classList = "buy_button";
    button.innerText = drinkObj.price;
    div.classList = "cola_caption";
    div.append(span, button);
    li.append(img, div);
    $vendingMenu.append(li);
    eventListener();
  });
}
function menuInTempList(name) {
  return tempList.some((tempCola) => tempCola.name == name);
}

function totalMoneySet() {
  $totalMoney.innerText = totalMoney.toLocaleString();
}
function leftMoneySet() {
  $leftMoney.innerText = leftMoney.toLocaleString();
}

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

function handleBuyButton(event) {
  const colaName = event.currentTarget.children[1].children[0].innerText;

  const drinkTypeItem = drinkType.find((cola) => cola.name == colaName);
  if (drinkTypeItem.count > 0) {
    const tempColaListItem = tempList.find(
      (cola) => cola.name == drinkTypeItem.name
    );
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

function handleMoneyReturnBtn() {
  totalMoney += leftMoney;
  leftMoney = 0;
  totalMoneySet();
  leftMoneySet();
}

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
function menuSelect(event) {
  event.currentTarget.classList.toggle("select");
}

function eventListener() {
  $getButton.addEventListener("click", pushTempToOwn);
  $inputMoneyBtn.addEventListener("click", inputMoney);
  for (let i = 0; i < $vendingItem.length; i++) {
    $vendingItem[i].addEventListener("click", handleBuyButton);
  }
  $MoneyReturnBtn.addEventListener("click", handleMoneyReturnBtn);
}
function init() {
  totalMoneySet();
  leftMoneySet();
  drawOwnColaList(ownColaList);
  drawShoppingListItem(tempList);
  drawVendingMenu(drinkType);
}

// 장바구니에서 환불기능 만들기

init();
