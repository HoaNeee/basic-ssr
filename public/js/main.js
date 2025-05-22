// //get ip
// document.addEventListener("DOMContentLoaded", function () {
//   // Fetch the IP address from the API
//   fetch("https://api.ipify.org?format=json")
//     .then((response) => response.json())
//     .then((data) => {
//       // Display the IP address on the screen
//       const div = document.getElementById("ip-address");
//       div.setAttribute("data-ip", data.ip);
//     })
//     .catch((error) => {
//       console.error("Error fetching IP address:", error);
//     });
// });

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
}
