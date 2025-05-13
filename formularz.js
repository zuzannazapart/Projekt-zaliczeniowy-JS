const carCards = document.querySelectorAll(".carCard");
const carModel = localStorage.getItem("selectedCar");
const modelDisplay = document.getElementById("selectedCarModel");
const $switchPageBtn = document.getElementById("buyCar");

document.addEventListener("DOMContentLoaded", () => {
  carCards.forEach((card) => {
    card.addEventListener("click", () => {
      window.location.href = "formularz.html";
    });
  });

  if (carModel && modelDisplay) {
    modelDisplay.textContent = `Wybrane auto: ${carModel}`;
  }

  createDeliveryDates();
  restoreFormData();
  restoreAccessories();

  document
    .getElementById("deliveryDate")
    .addEventListener("change", function () {
      document.getElementById("carAdress").textContent = this.value;
      localStorage.setItem("formDeliveryDate", this.value);
    });

  document.getElementById("carAdress").textContent =
    document.getElementById("deliveryDate").value;

  const boughtPaymentMethod = localStorage.getItem("selectedPaymentMethod");
  if (boughtPaymentMethod) {
    const paymentText =
      boughtPaymentMethod === "leasing" ? "Leasing" : "Gotówka";
    document.getElementById("paymentMethod").textContent = paymentText;
  }

  const carPrice = parseInt(localStorage.getItem("selectedCarPrice")) || 0;
  let accessoriesTotal = 0;
  let totalPrice = carPrice;

  function updateTotalPrice() {
    const totalElement = document.getElementById("totalPrice");
    if (totalElement) {
      totalPrice = carPrice + accessoriesTotal;
      totalElement.textContent = `${totalPrice} zł`;
      localStorage.setItem("totalCarPrice", totalPrice);

      const selectedAccessories = Array.from(
        document.querySelectorAll(".accessory")
      )
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);
      localStorage.setItem(
        "selectedAccessories",
        JSON.stringify(selectedAccessories)
      );
    }
  }

  document.querySelectorAll(".accessory").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const value = parseInt(this.value);
      this.checked ? (accessoriesTotal += value) : (accessoriesTotal -= value);
      updateTotalPrice();
    });
  });

  updateTotalPrice();
});

function createDeliveryDates() {
  const select = document.getElementById("deliveryDate");
  const today = new Date();

  select.innerHTML = "";

  for (let i = 0; i <= 14; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const option = document.createElement("option");
    option.value = formattedDate;
    option.textContent = formattedDate;

    select.appendChild(option);
  }

  const savedDate = localStorage.getItem("formDeliveryDate");
  if (savedDate) {
    select.value = savedDate;
  } else {
    select.selectedIndex = 14;
    localStorage.setItem("formDeliveryDate", select.value);
  }
}

function restoreFormData() {
  const nameInput = document.getElementById("name");
  const pickupInput = document.getElementById("pickupLocation");
  const deliverySelect = document.getElementById("deliveryDate");
  const financingRadios = document.querySelectorAll(
    'input[name="finansowanie"]'
  );

  nameInput.value = localStorage.getItem("formName") || "";
  pickupInput.value = localStorage.getItem("formPickupLocation") || "";
  const savedDate = localStorage.getItem("formDeliveryDate");
  if (savedDate) deliverySelect.value = savedDate;

  const savedFinancing = localStorage.getItem("formFinancing");
  if (savedFinancing) {
    const selectedRadio = document.querySelector(
      `input[name="finansowanie"][value="${savedFinancing}"]`
    );
    if (selectedRadio) selectedRadio.checked = true;
  }

  nameInput.addEventListener("input", () => {
    localStorage.setItem("formName", nameInput.value);
  });

  pickupInput.addEventListener("input", () => {
    localStorage.setItem("formPickupLocation", pickupInput.value);
  });

  deliverySelect.addEventListener("change", () => {
    localStorage.setItem("formDeliveryDate", deliverySelect.value);
  });

  financingRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        localStorage.setItem("formFinancing", radio.value);
      }
    });
  });
}

function restoreAccessories() {
  const selectedAccessories = JSON.parse(
    localStorage.getItem("selectedAccessories") || "[]"
  );
  document.querySelectorAll(".accessory").forEach((checkbox) => {
    if (selectedAccessories.includes(checkbox.value)) {
      checkbox.checked = true;
    }
  });
}

const goBack = document.getElementById("goBack");
if (goBack) {
  goBack.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

const boughtCarName = localStorage.getItem("selectedCar");
const carNameElement = document.getElementById("carName");
if (carNameElement && boughtCarName) {
  carNameElement.innerText = boughtCarName;
}

const boughtCarImage = localStorage.getItem("selectedCarImage");
const summaryImage = document.getElementById("summaryCarPhoto");
if (summaryImage && boughtCarImage) {
  summaryImage.src = boughtCarImage;
}

const $formError = document.getElementById("formError");

if ($switchPageBtn) {
  $switchPageBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const pickupLocation = document
      .getElementById("pickupLocation")
      .value.trim();
    const financing = document.querySelector(
      'input[name="finansowanie"]:checked'
    );

    $formError.style.display = "none";
    $formError.textContent = "";

    let isValid = true;

    if (!name || !pickupLocation || !financing) {
      $formError.textContent = "Wszystkie pola muszą być wypełnione!";
      isValid = false;
    } else if (!name.includes(" ") || name.split(" ").length < 2) {
      $formError.textContent =
        "Proszę podać imię i nazwisko oddzielone spacją!";
      isValid = false;
    }

    if (isValid) {
      const paymentMethod = financing.value;
      localStorage.setItem("selectedPaymentMethod", paymentMethod);

      const finalPriceValue = parseInt(localStorage.getItem("totalCarPrice"));
      document.getElementById(
        "finalPrice"
      ).textContent = `${finalPriceValue} zł`;
      document.getElementById("formPage").classList.add("hidden");
      document.getElementById("thanksPage").classList.remove("hidden");

      
      const summaryData = {
        selectedCar: localStorage.getItem("selectedCar"),
        selectedCarImage: localStorage.getItem("selectedCarImage"),
        selectedPaymentMethod: paymentMethod,
        totalCarPrice: finalPriceValue,
      };

     
      localStorage.clear();

     
      for (const key in summaryData) {
        localStorage.setItem(key, summaryData[key]);
      }
    } else {
      $formError.style.display = "block";
    }
  });
}
