//update quantity;
const formChangeQuantity = document.querySelector("[form-change-quantity]");
if (formChangeQuantity) {
  const inputChanges = document.querySelectorAll("[input-change-quantity]");
  if (inputChanges && inputChanges.length > 0) {
    for (const input of inputChanges) {
      input.addEventListener("change", (e) => {
        const value = e.target.value;
        const inputForm = formChangeQuantity.querySelector(
          'input[name="quantity"]'
        );
        inputForm.value = value;
        const productId = input.getAttribute("data-id");
        const path = formChangeQuantity.getAttribute("data-path");
        const action = `${path}${productId}?_method=PATCH`;
        formChangeQuantity.action = action;
        formChangeQuantity.submit();
      });
    }
  }
}

//delete
const formDeleteProductCart = document.querySelector(
  "[form-delete-productCart]"
);

if (formDeleteProductCart) {
  const btnsDelete = document.querySelectorAll("[btn-delete-productCart]");
  if (btnsDelete && btnsDelete.length > 0) {
    for (const btn of btnsDelete) {
      btn.addEventListener("click", () => {
        const productId = btn.getAttribute("data-id");
        const path = formDeleteProductCart.getAttribute("data-path");
        const action = `${path}${productId}?_method=DELETE`;
        formDeleteProductCart.action = action;
        formDeleteProductCart.submit();
      });
    }
  }
}
