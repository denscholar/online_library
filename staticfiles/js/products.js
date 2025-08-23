const addToCartButtons = document.querySelectorAll(".add-to-cart-overlay");
const cartCountElement = document.getElementById("cart-count");

let cart = JSON.parse(localStorage.getItem("cart")) || {};
let cartCount = Object.keys(cart).length;
if (cartCountElement) {
  cartCountElement.textContent = cartCount;
}

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || {};
    
    const productId = button.getAttribute("data-product-id");
    const wrapper = button.closest(".product-wrapper");

    alertify.set("notifier", "position", "top-right");

    const name = wrapper.querySelector(".name")?.textContent.trim();
    const priceText = wrapper
      .querySelector(".new-price")
      ?.textContent.replace(/₦|,/g, "")
      .trim();
    const price = parseFloat(priceText);
    const image = wrapper.querySelector("img")?.getAttribute("src");
    const description =
      wrapper.querySelector(".prod-desc")?.textContent?.trim() || "";    

    if (cart[productId]) {
      alertify.error("Product already in cart.", "error", 6);
      return;
    }

    cart[productId] = {
      id: productId,
      name,
      price,
      image,
      quantity: 1,
      description,
    };

    localStorage.setItem("cart", JSON.stringify(cart));
    cartCount = Object.keys(cart).length;
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }

    alertify.success("Product added to cart.", "success", 6);

    //Dispatch event to notify cart.js to update UI
    window.dispatchEvent(new CustomEvent("cartUpdated", {
      detail: { cart }
    }));
  });
});
