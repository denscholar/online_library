document.addEventListener("DOMContentLoaded", () => {
  const cartList = document.getElementById("cart-items");
  const totalItemsEl = document.getElementById("total-items");
  const totalOrdersEl = document.getElementById("total-orders");
  const totalCostEl = document.getElementById("total-cost");
  const cartCountElement = document.getElementById("cart-count");
  const GroFundBal = document.querySelector("#grofund-bal");
  const checkoutBtn = document.querySelector('#check-out-button')

  let cart = JSON.parse(localStorage.getItem("cart")) || {};
  const DELIVERY_FEE = 1500


  // ✅ Place the helper function here
  function toggleEmptyCartMessage() {
    const emptyCartMessage = document.getElementById("empty-cart-message");
    if (Object.keys(cart).length === 0) {
      cartList.style.display = "none";
      if (emptyCartMessage) emptyCartMessage.style.display = "flex";
    } else {
      cartList.style.display = "block";
      if (emptyCartMessage) emptyCartMessage.style.display = "none";
    }
  }

  function renderCart() {
    cartList.innerHTML = "";
    toggleEmptyCartMessage();
    let totalPrice = 0;
    let itemCount = 0;

    // const emptyCartMessage = document.getElementById("empty-cart-message");

    // if (Object.keys(cart).length === 0) {
    //   cartList.style.display = "none";
    //   if (emptyCartMessage) emptyCartMessage.style.display = "flex";
    // } else {
    //   if (emptyCartMessage) emptyCartMessage.style.display = "none";
    // }

    for (const [id, item] of Object.entries(cart)) {
      const itemPrice = item.price * item.quantity;
      totalPrice += itemPrice;
      itemCount += item.quantity;

      const li = document.createElement("li");
      li.className =
        "d-flex justify-content-between align-items-center my-3 gap-2";

      li.innerHTML = `
          <div class="image-wrapper d-flex justify-content-center gap-3">
            <img width="100px" height="100px" src="${item.image}" alt="${
        item.name
      }" />
            <div class="increament-decreament d-flex justify-content-center gap-2 flex-column">
              <div class="product-name-desc">
                <h2 class="fs-6 m-0 p-0">${item.name}</h2>
                <p class="prod-desc mt-1 fs-6">${item.description}</p>
              </div>
              <div class="d-flex justify-content-start gap-2 align-items-center">
                <button class="btn btn-outline-secondary btn-sm px-3 py-1 fw-bold decrement" data-id="${id}">-</button>
                <span class="fs-6 fw-bold">${item.quantity}</span>
                <button class="btn btn-outline-secondary btn-sm px-3 py-1 fw-bold increment" data-id="${id}">+</button>
              </div>
            </div>
          </div>
          <div class="delete-amount d-flex justify-content-between flex-column align-items-center gap-3">
            <i style="cursor: pointer;" class="fa-solid fa-trash text-danger cursor-pointer fs-4 delete" data-id="${id}"></i>
            <p class="fw-bold fs-6 mt-2 text-black-50">₦${itemPrice.toLocaleString()}</p>
          </div>
        `;

      cartList.appendChild(li);
    }

    totalItemsEl.textContent = `${itemCount} item${itemCount !== 1 ? "s" : ""}`;
    totalOrdersEl.textContent = `₦${totalPrice.toLocaleString()}`;
    totalCostEl.textContent = `₦${(
      totalPrice + DELIVERY_FEE
    ).toLocaleString()}`;
    if (cartCountElement) {
      cartCountElement.textContent = Object.keys(cart).length;
    }

    // New Code for current balance
    const groFundBalText = GroFundBal.textContent;
    const cleanedText = groFundBalText.replace(/[^\d.]/g, "");
    const groFundBalValue = parseFloat(cleanedText) || 0;
    // const groFundBalValue = Math.floor(parseFloat(groFundBalText.replace(/[₦,]/g, ""))) || 0;

    const totalCost = totalPrice + DELIVERY_FEE;

    // console.log(groFundBalValue);
    
    const currentBalance = groFundBalValue - totalCost;

    const currentBalanceEl = document.getElementById("current-balance");
    currentBalanceEl.textContent = `₦${currentBalance.toLocaleString()}`;

    attachCartEvents();
  }

  function attachCartEvents() {
    document.querySelectorAll(".increment").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        cart[id].quantity++;
        saveCart();
      })
    );

    document.querySelectorAll(".decrement").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (cart[id].quantity > 1) {
          cart[id].quantity--;
          saveCart();
        } else {
          alertify.set("notifier", "position", "top-right");
          alertify.error("Minimum quantity is 1.", "warning", 4);
        }
      })
    );

    document.querySelectorAll(".delete").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        delete cart[id];
        saveCart();
      })
    );
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();

    // Dispatch event to update other parts (like mini cart)
    window.dispatchEvent(
      new CustomEvent("cartUpdated", {
        detail: { cart },
      })
    );
  }

  // Listen for external updates to cart (e.g. from product.js)
  window.addEventListener("cartUpdated", (e) => {
    cart = e.detail.cart;
    renderCart();
  });

  renderCart();
  
  // Checkout functionality
  checkoutBtn.addEventListener('click', ()=>{
    if (Object.keys(cart).length === 0) {
      alertify.set("notifier", "position", "top-right");
      alertify.error("Your cart is empty.");
      return;
    }
    const cartItems = Object.entries(cart).map(([id, item])=>({
      product_id: id,
      quantity: item.quantity,
      name: item.name,
      price: item.price,
    }))

    fetch("/store/check-out/", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        // "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({items: cartItems})
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alertify.set("notifier", "position", "top-right");
        alertify.error(data.error);
      }
      else{
         // Success: clear localStorage cart and show a success message
         localStorage.removeItem('cart');
         cart = {};  // Reset the in-memory cart too
         renderCart();  // Refresh the cart UI immediately
         alertify.set("notifier", "position", "top-right");
         alertify.success("Checkout successful! Thank you for your purchase.");
      }
    })
  
  })
});



