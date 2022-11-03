import { drinkType, ownColaList, tempList } from "./fakeDB";

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
const $totalPay = document.querySelector("#totalPay");
console.log(drinkType);
let totalMoney = 25000;
let leftMoney = 1000;

// drinkType에서 매치되는 콜라 찾기
function findDrinkObjs(obj) {
  const drinkObj = drinkType.find((drink) => drink.name == obj.name);
  return drinkObj;
}

// 콜라 리스트속 아이템 그리기
function drawDrink(obj) {
  const drinkObj = findDrinkObjs(obj);
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

// 소유한 콜라 목록 그리기
function drawOwnColaList(drinkArr) {
  $ownDrinkList.innerHTML = "";
  let totalAmount = 0;
  drinkArr.map((obj) => {
    const li = drawDrink(obj);
    $ownDrinkList.append(li);

    const result = drinkType.find((cola) => cola.name == obj.name);
    totalAmount += result.price * obj.count;
  });
  $totalPay.innerText = totalAmount.toLocaleString();
}

// 장바구니속 콜라 아이템 그리기
function drawShoppingListItem(drinkArr) {
  $shoppingList.innerHTML = "";
  drinkArr.forEach((obj) => {
    const li = drawDrink(obj);
    li.addEventListener("click", handleShoppingItem);
    $shoppingList.append(li);
  });
}

// 벤딩머신 음료 메뉴 그리기
function drawVendingMenu(drinkArr) {
  $vendingMenu.innerHTML = "";
  const $frag = document.createDocumentFragment();
  drinkArr.forEach((obj) => {
    const drinkObj = findDrinkObjs(obj);
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
    button.classList.add("buy_button");
    button.innerText = drinkObj.price;
    div.classList = "cola_caption";
    div.append(span, button);
    li.append(img, div);
    eventListener(li);
    $frag.append(li);
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

function searchDrinkList(colaName) {
  return drinkType.find((cola) => cola.name == colaName);
}

function searchTempList(colaName) {
  return tempList.find((cola) => cola.name == colaName);
}

// 구매버튼 클릭 시
function handleBuyButton(event) {
  const colaName = event.currentTarget.children[1].children[0].innerText;

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
function handleShoppingItem(event) {
  let index = 0;
  const findCola = tempList.find((tempCola, cola_index) => {
    const result = tempCola.name == event.currentTarget.children[1].innerText;
    if (result) {
      index = cola_index;
    }
    return result;
  });

  const result = searchDrinkList(findCola.name);
  if (findCola.count - 1 == 0) {
    tempList.splice(index, 1);
  } else {
    findCola.count -= 1;
  }
  result.count += 1;
  leftMoney += result.price;
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

// 메뉴에 select 클래스 부여
function menuSelect(event) {
  event.currentTarget.classList.toggle("select");
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
