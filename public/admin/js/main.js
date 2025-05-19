//change status filter
const buttonStatus = document.querySelectorAll("[button-status]");

for (let i = 0; i < buttonStatus.length; i++) {
  const btn = buttonStatus[i];
  btn.addEventListener("click", () => {
    const url = new URL(window.location.href);
    const status = btn.getAttribute("button-status");

    if (status) {
      url.searchParams.set("status", status);
    } else {
      url.searchParams.delete("status");
    }

    window.location.href = url;
  });
}

//search
const formSearch = document.querySelector("#form-search");

if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    const url = new URL(window.location.href);
    const q = e.target.elements.q.value;
    if (q) {
      url.searchParams.set("q", q);
    } else {
      url.searchParams.delete("q");
    }
    window.location.href = url;
  });
}

//pagination
const btnPaginations = document.querySelectorAll("[btn-pagination]");

for (let i = 0; i < btnPaginations.length; i++) {
  const btn = btnPaginations[i];
  const url = new URL(window.location.href);

  btn.addEventListener("click", () => {
    const page = btn.getAttribute("btn-pagination");

    url.searchParams.set("page", page);
    window.location.href = url;
  });
}

//form change multi
const formChangeMulti = document.querySelector("#form-change-multi");

if (formChangeMulti) {
  const btnCheckAll = document.querySelector('input[name="checkAll"]');

  const btnsChangeMulti = document.querySelectorAll(
    "tbody:not([style*='display: none']) input[name='id-change']"
  );

  if (btnCheckAll) {
    btnCheckAll.addEventListener("click", () => {
      let checked = false;
      if (btnCheckAll.checked) {
        checked = true;
      } else checked = false;

      for (let i = 0; i < btnsChangeMulti.length; i++) {
        const btn = btnsChangeMulti[i];
        btn.checked = checked;
      }
    });
  }

  for (let i = 0; i < btnsChangeMulti.length; i++) {
    const btn = btnsChangeMulti[i];
    btn.addEventListener("click", () => {
      const btnsChecked = document.querySelectorAll(
        'input[name="id-change"]:checked'
      );
      if (btnsChecked.length === btnsChangeMulti.length) {
        btnCheckAll.checked = true;
      } else {
        btnCheckAll.checked = false;
      }
    });
  }

  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const typeChange = formChangeMulti.querySelector(
      'select[name="type"]'
    ).value;

    const btnsChecked = document.querySelectorAll(
      'input[name="id-change"]:checked'
    );

    let arr = [];
    for (let i = 0; i < btnsChecked.length; i++) {
      const btn = btnsChecked[i];
      const id = btn.value;

      if (btn.checked) {
        if (typeChange === "change-position") {
          let position = btn
            .closest("tr")
            .querySelector('input[name="position"]').value;

          position = Number(position);
          const idPos = `${id}-${position}`;
          arr.push(idPos);
        } else arr.push(id);
      }
    }
    e.target.elements.ids.value = arr.join(", ");

    if (arr.length > 0) {
      const currentUrl = window.location.pathname + window.location.search;
      const redirect = encodeURIComponent(currentUrl);
      const inputDataChange =
        formChangeMulti.querySelector('input[name="ids"]');

      const actionForm = formChangeMulti.action;
      const path = `${actionForm}&redirect=${redirect}`;

      if (typeChange === "delete-all") {
        const isConfirm = confirm("Are you sure want to delete these?");
        if (isConfirm) {
          formChangeMulti.action = path;
          formChangeMulti.submit();
        } else {
          //nothing here...
        }
      } else {
        formChangeMulti.action = path;
        formChangeMulti.submit();
      }
    } else {
      alert("Vui lòng chọn ít nhất 1!");
    }
  });
}

//alert for basic
const alertElement = document.querySelector(".alert-custom");
if (alertElement) {
  let time = alertElement.getAttribute("time");
  time = Number(time);
  setTimeout(() => {
    alertElement.classList.add("alert-hidden");
  }, time);
}

//preview image
const inputImgaePreview = document.querySelector("[input-preview-image]");

if (inputImgaePreview) {
  const imagePreview = document.querySelector("[image-preview]");
  const imgContainer = document.querySelector(".img-container");

  if (!imagePreview.getAttribute("src")) {
    imgContainer.classList.add("hidden");
    console.log("khong co anhr");
  } else {
    console.log("dang co anh");
  }

  inputImgaePreview.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (file) {
      imgContainer.classList.remove("hidden");
      imagePreview.src = URL.createObjectURL(file);
    }
  });

  imgContainer.addEventListener("click", () => {
    imagePreview.src = "";
    imgContainer.classList.add("hidden");
    inputImgaePreview.value = "";
  });

  // const formEdit = document.querySelector("[form-edit-product]");
  // formEdit.addEventListener("submit", (e) => {
  //   e.preventDefault();
  //   console.log([e.target]);
  // });
}

//sort
const sortElement = document.querySelector("[sort]");
if (sortElement) {
  const url = new URL(window.location.href);
  const sortSelect = sortElement.querySelector("[sort-select]");
  const sortKeyQuery = url.searchParams.get("sortKey");
  const sortValueQuery = url.searchParams.get("sortValue");
  const btnClear = sortElement.querySelector("[sort-clear]");

  if (sortKeyQuery && sortValueQuery) {
    const option = sortSelect.querySelector(
      `option[value="${sortKeyQuery}-${sortValueQuery}"]`
    );
    option.selected = true;
  }
  sortSelect.addEventListener("change", () => {
    const stringSort = sortSelect.value;
    const [sortKey, sortValue] = stringSort.split("-");
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });

  btnClear.addEventListener("click", () => {
    if (sortKeyQuery && sortValueQuery) {
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
      window.location.href = url.href;
    }
  });
}
