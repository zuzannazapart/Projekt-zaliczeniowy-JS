document.addEventListener("DOMContentLoaded", () => {
  const carCards = document.querySelectorAll(".carCard");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  carCards.forEach((card) => {
    card.addEventListener("click", () => {
      const carTitle = card.querySelector(".carTitle").textContent;
      const carImage = card.querySelector("img").src;
      const carPrice = card.querySelector(".carPrice").textContent.replace(/\D/g, '');

      localStorage.setItem("selectedCar", carTitle);
      localStorage.setItem("selectedCarImage", carImage);
      localStorage.setItem("selectedCarPrice", carPrice);
      window.location.href = "formularz.html";
    });
  });
});


function searchCars() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const allCards = document.querySelectorAll(".carCard");

  allCards.forEach(card => {
    const title = card.querySelector(".carTitle").textContent.toLowerCase();
    if (searchTerm === "" || title.includes(searchTerm)) {
      card.classList.remove("hiddenCard");
    } else {
      card.classList.add("hiddenCard");
    }
  });
}


searchButton.addEventListener("click", searchCars);


searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchCars();
  }
});