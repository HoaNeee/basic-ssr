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

//change status
const btnChangeStatus = document.querySelectorAll("[btn-change-status]");

const formChangeStatus = document.querySelector("#form-change-status");

if (formChangeStatus) {
  const pathForm = formChangeStatus.getAttribute("data-path");

  for (let i = 0; i < btnChangeStatus.length; i++) {
    const btnChange = btnChangeStatus[i];
    btnChange.addEventListener("click", () => {
      let status = btnChange.getAttribute("data-status");
      const id = btnChange.getAttribute("data-id");
      if (status === "active") {
        status = "inactive";
      } else {
        status = "active";
      }

      const currentUrl = window.location.pathname + window.location.search;

      const redirect = encodeURIComponent(currentUrl);

      const action =
        pathForm + `/${status}/${id}?redirect=${redirect}&_method=PATCH`;
      formChangeStatus.action = action;
      // console.log(formChangeStatus);
      formChangeStatus.submit();
    });
  }
}
