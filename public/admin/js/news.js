//delete item
const btnsDelete = document.querySelectorAll("[btn-delete]");
const formDelete = document.querySelector("#form-delete-item");

if (formDelete) {
  for (let i = 0; i < btnsDelete.length; i++) {
    const btn = btnsDelete[i];
    btn.addEventListener("click", () => {
      const isConfirm = confirm("Are you sure?");
      if (isConfirm) {
        const id = btn.value;
        const path = formDelete.getAttribute("data-path");
        const action = `${path}/${id}?_method=DELETE`;
        formDelete.action = action;
        formDelete.submit();
      }
    });
  }
}
