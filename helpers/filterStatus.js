module.exports = (query) => {
  let filterBtn = [
    {
      title: "Tất cả",
      active: "",
      status: "",
    },
    {
      title: "Đang hoạt động",
      active: "",
      status: "active",
    },
    {
      title: "Dừng hoạt động",
      active: "",
      status: "inactive",
    },
  ];

  if (query.status) {
    const index = filterBtn.findIndex((btn) => btn.status === query.status);
    filterBtn[index].active = "active";
  } else {
    filterBtn[0].active = "active";
  }

  return filterBtn;
};
