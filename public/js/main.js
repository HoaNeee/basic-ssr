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
