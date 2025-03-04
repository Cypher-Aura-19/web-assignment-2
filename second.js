const hamburgerIcon = document.getElementById("hamburger-icon");
const closeIcon = document.getElementById("close-icon");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

hamburgerIcon.addEventListener("click", () => {
  sidebar.classList.add("active");
  overlay.classList.add("active");
  closeIcon.classList.remove("hidden");
  hamburgerIcon.classList.add("hidden");
});

closeIcon.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  closeIcon.classList.add("hidden");
  hamburgerIcon.classList.remove("hidden");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  closeIcon.classList.add("hidden");
  hamburgerIcon.classList.remove("hidden");
});

document.addEventListener("DOMContentLoaded", function () {
  const API_KEY = "676f4215bc2bf7b925dd7dbea02fa498";
  const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

  const forecastTable = document.querySelector("#weather-data");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const unitToggle = document.getElementById("unit-toggle");
  const cityInput = document.getElementById("city-input");
  const searchBtn = document.getElementById("search-btn");
  const loadingSpinner = document.getElementById("loading-spinner");
  const resetFilterBtn = document.getElementById("reset-btn");
  const filtersModal = document.getElementById("filters-modal");
  const errorMessage = document.getElementById("error-message");

  let originalData = [];
  let forecastData = [];
  let currentPage = 1;
  const itemsPerPage = 10;
  let isCelsius = true;

  let cityName = "";

  async function fetchWeather(city) {
    try {
      loadingSpinner.style.display = "flex";
      const response = await fetch(
        `${API_URL}?q=${city}&units=metric&appid=${API_KEY}`
      );
      const data = await response.json();

      if (data.cod !== "200") {
        throw new Error(data.message);
      }

      cityName = data.city.name;

      const filteredData = data.list.filter((entry) => {
        const entryDate = new Date(entry.dt_txt);
        return entryDate > new Date();
      });

      originalData = [...filteredData];
      forecastData = filteredData;
      displayForecast(1);
      updatePagination();
      errorMessage.innerText = "";
    } catch (error) {
      forecastData = [];
      displayForecast(1);
      errorMessage.innerHTML = `
  <div id="error-message" class="flex items-center justify-center bg-red-200 border border-red-600 p-4 rounded shadow-md transition-all duration-300 ease-in-out transform hover:scale-105">
  <svg class="error-icon w-6 h-6 mr-2 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z" />
  </svg>
  <span class="text-red-600 font-semibold">Error: ${error.message}</span>
  </div>
  `;
    } finally {
      loadingSpinner.style.display = "none";
    }
  }

  function displayForecast(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    forecastTable.innerHTML = "";

    const slicedData = forecastData.slice(start, end);

    slicedData.forEach((entry) => {
      const date = new Date(entry.dt_txt).toLocaleDateString();
      let temp = entry.main.temp;
      if (!isCelsius) {
        temp = (temp * 9) / 5 + 32;
      }
      const temperature = `${temp.toFixed(1)} °${isCelsius ? "C" : "F"}`;
      const condition = entry.weather[0].description;

      const row = `
                <tr>
                    <td class="px-5 py-3 border-b border-gray-700">${date}</td>
                    <td class="px-5 py-3 border-b border-gray-700">${temperature}</td>
                    <td class="px-5 py-3 border-b border-gray-700 capitalize">${condition}</td>
                    <td class="px-5 py-3 border-b border-gray-700 capitalize">${cityName}</td>
                </tr>
            `;
      forecastTable.innerHTML += row;
    });
  }

  function updatePagination() {
    const totalPages = Math.ceil(forecastData.length / itemsPerPage);
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      loadingSpinner.style.display = "flex";
      setTimeout(() => {
        displayForecast(--currentPage);
        updatePagination();
        loadingSpinner.style.display = "none";
      }, 500);
    }
  }

  function handleNextPage() {
    const totalPages = Math.ceil(forecastData.length / itemsPerPage);
    if (currentPage < totalPages) {
      loadingSpinner.style.display = "flex";
      setTimeout(() => {
        displayForecast(++currentPage);
        updatePagination();
        loadingSpinner.style.display = "none";
      }, 500);
    }
  }

  unitToggle.addEventListener("change", () => {
    loadingSpinner.style.display = "flex";
    setTimeout(() => {
      isCelsius = !unitToggle.checked;
      displayForecast(currentPage);
      loadingSpinner.style.display = "none";
    }, 500);
  });

  const filterCheckboxes = document.querySelectorAll(".form-checkbox");

  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      loadingSpinner.style.display = "flex";
      setTimeout(() => {
        forecastData = [...originalData];

        filterCheckboxes.forEach((cb) => {
          if (cb !== checkbox) cb.checked = false;
        });

        if (checkbox.checked) {
          const filterType = checkbox.nextElementSibling.innerText;
          applyFilter(filterType);
        }

        displayForecast(1);
        updatePagination();
        loadingSpinner.style.display = "none";
      }, 500);
    });
  });

  function applyFilter(filterType) {
    switch (filterType) {
      case "Ascending Temperatures":
        forecastData.sort((a, b) => a.main.temp - b.main.temp);
        break;
      case "Descending Temperatures":
        forecastData.sort((a, b) => b.main.temp - a.main.temp);
        break;
      case "Show Rainy Days":
        forecastData = forecastData.filter((entry) =>
          entry.weather.some((weather) =>
            weather.description.toLowerCase().includes("rain")
          )
        );
        if (forecastData.length === 0) {
          alert("No rainy days found!");
        }
        break;
      case "Highest Temperature":
        const highestTempDay = forecastData.reduce((max, entry) =>
          entry.main.temp > max.main.temp ? entry : max
        );
        forecastData = [highestTempDay];
        break;
      default:
        break;
    }
  }

  resetFilterBtn.addEventListener("click", () => {
    loadingSpinner.style.display = "flex";
    setTimeout(() => {
      forecastData = [...originalData];
      filterCheckboxes.forEach((cb) => (cb.checked = false));
      displayForecast(1);
      updatePagination();
      errorMessage.innerText = "";
      loadingSpinner.style.display = "none";
    }, 500);
  });

  prevBtn.addEventListener("click", handlePrevPage);
  nextBtn.addEventListener("click", handleNextPage);

  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
      fetchWeather(city);
    } else {
      alert("Please enter a city name.");
    }
  });

  fetchWeather("Islamabad");

  document
    .getElementById("open-filters")
    .addEventListener("click", function () {
      filtersModal.classList.remove("hidden");
    });

  document
    .getElementById("close-filters")
    .addEventListener("click", function () {
      filtersModal.classList.add("hidden");
    });
});
