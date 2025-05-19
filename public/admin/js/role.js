//permission
const tablePermission = document.querySelector("[table-permission]");
if (tablePermission) {
  const btnSubmit = document.querySelector("[btn-submit]");

  //set data
  const dataPermissions = JSON.parse(
    document.querySelector("[data-permission]").getAttribute("data-permission")
  );
  const tRows = document.querySelectorAll("tr[name]");

  const permissions = dataPermissions.map((item) => item.permissions);

  for (let i = 0; i < tRows.length; i++) {
    const tr = tRows[i];
    const name = tr.getAttribute("name");
    const checkboxs = tr.querySelectorAll("input");

    for (let j = 0; j < checkboxs.length; j++) {
      const cb = checkboxs[j];
      for (let k = 0; k < permissions[j].length; k++) {
        if (name === permissions[j][k]) {
          cb.checked = true;
        }
      }
    }
  }

  //end set data
  let res = [];
  if (btnSubmit) {
    btnSubmit.addEventListener("click", () => {
      res = [];
      const ids = tablePermission.querySelectorAll("input[name='id']");
      for (let i = 0; i < ids.length; i++) {
        res.push({
          id: ids[i].value,
          permissions: [],
        });
      }
      const tRows = tablePermission.querySelectorAll("tr[name]");

      for (let i = 0; i < tRows.length; i++) {
        const tr = tRows[i];
        const inputCheck = tr.querySelectorAll("input");
        const name = tr.getAttribute("name");

        for (let j = 0; j < inputCheck.length; j++) {
          const checked = inputCheck[j].checked;
          if (checked) {
            res[j].permissions.push(name);
          }
        }
      }
      console.log(res);
      //submit;
      const formPermission = document.querySelector("#form-permission");
      const input = formPermission[0];
      input.value = JSON.stringify(res);
      formPermission.submit();
    });
  }
}

//role delete
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
