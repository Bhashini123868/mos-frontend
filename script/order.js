
loadMenu();

async function CustomerSelection() {
  try {
    const response = await fetch("http://localhost:8085/mos/customer/get-all");
    const customers = await response.json();
    const selectElement = document.getElementById("existingCustomer");

    customers.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = customer.name;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
}
window.addEventListener("DOMContentLoaded", CustomerSelection);

function loadMenu() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:8085/mos/item/get-all", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Fetched menu items:", result);

      const menuContent = document.getElementById("menu-content");
      let body = "";

      result.forEach((e) => {
        body += `
            <div class="card" style="width: 300px; ">
                <img src="${e.image}" class="card-img-top" alt="${e.name}">
            <div class="card-body text-center">
            <h3 class="card-title fw-bold">${e.name}</h3>
             <h7>#${e.id}</h7>
            <h5 class="">Rs.${e.price}/=</h5>
            <button style="background-color:rgb(251, 171, 12);" class="btn btn-add-item" onclick="addCart(${e.id})">Add to Cart</button>
                </div>
            </div>
        `;
      });
      menuContent.innerHTML = body;
    })
    .catch((error) => console.error("Error loading menu:", error));
}

//===========Add cart=============
let CartArray = [];

function addCart(index) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let isExist = true;

  CartArray.forEach((item) => {
    if (item.id === index) {
      item.qty++;
      isExist = false;
      displayCart();
    }
  });
  console.log(CartArray);

  if (isExist) {
    async function fetchData() {
      const data = await fetch(
        `http://localhost:8085/mos/item/search-by-id/${index}`
      );

      const result = await data.json();

      const resultObj = {
        id: result[0].id,
        name: result[0].name,
        price: result[0].price,
        image: result[0].image,
        qty: 1,
      };
      CartArray.push(resultObj);
      displayCart();
      console.log(CartArray);
    }
    fetchData();
  }
}

// Display Cart
function displayCart() {
  let cartTable = document.getElementById("cartboxId");
  let TempAddCart = "";

  CartArray.forEach((element) => {
    TempAddCart += `
  <tr>
    <td>${element.id}</td>
    <td>${element.name}</td>
    <td>Rs.${element.price}</td>
    <td><img src="${element.image}" alt="${
      element.name
    }" class="item-image" style="width: 60px; height: auto;"></td>
    <td>${element.qty}</td>
    <td>
      <button class="btn btn-sm btn-outline-danger" onclick="removeCartItem(${CartArray.indexOf(
        element
      )})">🗑️</button>
    </td>
  </tr>
`;
  });
  cartTable.innerHTML = TempAddCart;
}

// Remove  Cart
function removeCartItem(index) {
  CartArray.splice(index, 1);
  displayCart();
}

// order place

let Oderarray = [];

function OderPlace() {
  const name = document.getElementById("existingCustomer").value;
  const discount = parseFloat(document.getElementById("discount").value || 0);

  if (!name || isNaN(discount)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const tempItem = [];

  CartArray.forEach((item) => {
    tempItem.push({
      id: item.id,
      qty: item.qty,
      price: item.price,
    });
  });

  let total = 0;

  CartArray.forEach((item) => {
    total += item.price * item.qty;
  });

  const discountedTotal =
    discount !== 0 ? total - total * (discount / 100) : total;


  let date = new Date();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let orderdate = date.getFullYear() + "-" + month + "-" + day;

  let orderDetail = [];

  CartArray.forEach((element) => {
    orderDetail.push({
      orderDetailID:1,
      order:null,
      itemID: element.id,
      qty: element.qty,
      unitPrice: element.price,
      
    });
    console.log(element.orderDetail);
  });

  // =========================================================================================================================

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    cusID: name,
    total: discountedTotal,
    date: orderdate,
    orderDetail: orderDetail,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8085/mos/order/add", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);

      alert("Order placed successfully!");
      CartArray = [];
      displayCart();

      document.getElementById("existingCustomer").value = "";
      document.getElementById("discount").value = "";
    })
    .catch((error) => console.error(error));
}

$(document).on('click', '.order', function () {
  let button = $(this);

  if (!button.hasClass('animate')) {
    button.addClass('animate');
    setTimeout(() => {
      button.removeClass('animate');
    }, 10000);
  }
});
