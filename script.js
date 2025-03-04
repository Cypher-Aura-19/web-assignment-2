document.addEventListener("DOMContentLoaded", function () {
  let weatherDoughnutChart;
  let tempBarChart;
  let tempLineChart;

  const apiKey = "676f4215bc2bf7b925dd7dbea02fa498";
  const loadingSpinner = document.getElementById("loading-spinner");
  const cityInput = document.getElementById("city-input");
  const unitToggle = document.getElementById("unit-toggle");
  const weatherCard = document.querySelector(".weather-card");

  function fetchCurrentWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${
      unitToggle.value === "Fahrenheit" ? "imperial" : "metric"
    }`;

    toggleLoading(true);
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        toggleLoading(false);
        if (data.cod === 200) {
          displayCurrentWeather(data);
        } else {
          showError(data.message);
        }
      })
      .catch((error) => {
        toggleLoading(false);
        console.error(error);
        showError("API limit reached or request failed");
      });
  }

  function displayCurrentWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const unit = unitToggle.value;

    let displayedTemp;
    if (unit === "Fahrenheit") {
      displayedTemp = `${temperature.toFixed(1)} °F`;
    } else {
      displayedTemp = `${temperature.toFixed(1)} °C`;
    }

    const humidity = `${data.main.humidity} %`;
    const windSpeed = `${data.wind.speed.toFixed(1)} ${
      unit === "Fahrenheit" ? "mph" : "m/s"
    }`;
    const pressure = `${data.main.pressure} hPa`;
    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    const condition = data.weather[0].main;

    document.getElementById("city-name").innerText = cityName;
    document.getElementById("temperature").innerText = `Temp: ${displayedTemp}`;
    document.getElementById("humidity").innerText = `Humidity: ${humidity}`;
    document.getElementById(
      "wind-speed"
    ).innerText = `Wind Speed: ${windSpeed}`;
    document.getElementById("pressure").innerText = `Pressure: ${pressure}`;
    document.getElementById("weather-icon").src = weatherIcon;

    changeBackgroundGradient(condition);

    fetchWeatherData(cityName);
  }

  function fetchWeatherDataForCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const units =
            unitToggle.value === "Fahrenheit" ? "imperial" : "metric";
          const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

          toggleLoading(true);
          fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
              toggleLoading(false);
              if (data.cod === 200) {
                displayCurrentWeather(data);
              } else {
                showError(data.message);
              }
            })
            .catch((error) => {
              toggleLoading(false);
              console.error(error);
              showError("API limit reached or request failed");
            });
        },
        (error) => {
          console.error(error);
          showError(
            "Unable to retrieve your location. Please allow location access."
          );
        }
      );
    } else {
      showError("Geolocation is not supported by this browser.");
    }
  }

  function fetchWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${
      unitToggle.value === "Fahrenheit" ? "imperial" : "metric"
    }`;

    toggleLoading(true);
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        toggleLoading(false);
        if (data.cod === "200") {
          processForecastData(data);
        } else {
          showError(data.message);
        }
      })
      .catch((error) => {
        toggleLoading(false);
        console.error(error);
        showError("API limit reached or request failed");
      });
  }

  function changeBackgroundGradient(condition) {
    let gradient;
    let isLightBg = false;

    switch (condition) {
      case "Clear":
        gradient = "linear-gradient(to right, #FFB300, #FFEFBA)";
        isLightBg = true;
        break;
      case "Clouds":
        gradient = "linear-gradient(to right, #BDC3C7, #2C3E50)";
        break;
      case "Rain":
      case "Drizzle":
        gradient = "linear-gradient(to right, #3498DB, #8E44AD)";
        break;
      case "Thunderstorm":
        gradient = "linear-gradient(to right, #7F8C8D, #34495E)";
        break;
      case "Snow":
        gradient = "linear-gradient(to right, #D5DBDB, #FFFFFF)";
        isLightBg = true;
        break;
      default:
        gradient = "linear-gradient(to right, #2c3e50, #4ca1af)"; 
    }

    weatherCard.style.background = gradient;

    if (isLightBg) {
      weatherCard.style.color = "black";
    } else {
      weatherCard.style.color = "white";
    }
  }

  function processForecastData(data) {
    const dailyData = {};
    const conditionCount = {};

    data.list.forEach((forecast) => {
      const date = new Date(forecast.dt_txt).toLocaleDateString();
      const temp = forecast.main.temp;
      const condition = forecast.weather[0].description;

      if (!dailyData[date]) {
        dailyData[date] = { temps: [], conditions: {} };
      }
      dailyData[date].temps.push(temp);

      if (!dailyData[date].conditions[condition]) {
        dailyData[date].conditions[condition] = 1;
      } else {
        dailyData[date].conditions[condition]++;
      }
    });

    const tempData = [];
    const conditions = [];
    const dates = [];

    for (const date in dailyData) {
      const avgTemp = (
        dailyData[date].temps.reduce((a, b) => a + b, 0) /
        dailyData[date].temps.length
      ).toFixed(2);
      tempData.push(avgTemp);
      dates.push(date);
      const maxCondition = Object.entries(dailyData[date].conditions).reduce(
        (a, b) => (a[1] > b[1] ? a : b)
      );
      conditions.push(maxCondition[0]);
    }

    updateCharts(tempData, conditions, dates);
  }

  function updateCharts(tempData, conditions, dates) {
    if (weatherDoughnutChart) {
      weatherDoughnutChart.destroy();
    }
    const weatherDoughnutChartElement = document
      .getElementById("weather-doughnut-chart")
      .getContext("2d");
    const conditionCount = {};

    conditions.forEach((condition) => {
      conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });

    weatherDoughnutChart = new Chart(weatherDoughnutChartElement, {
      type: "doughnut",
      data: {
        labels: Object.keys(conditionCount),
        datasets: [
          {
            data: Object.values(conditionCount),
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) {
                return null;
              }
              const index = context.dataIndex;
              const condition = context.chart.data.labels[index];
              return generateGradientForCondition(ctx, chartArea, condition);
            },
            hoverOffset: 8,
            borderColor: "rgba(255, 255, 255, 0.6)",
            borderWidth: 2,
            hoverBorderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#fff",
              font: {
                family: "Arial",
                size: 14,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            bodyColor: "#fff",
            borderColor: "#fff",
            borderWidth: 1,
          },
        },
        layout: {
          padding: 30,
        },
        elements: {
          arc: {
            borderWidth: 2,
            borderColor: "rgba(255, 255, 255, 0.6)",
            shadowColor: "rgba(0, 0, 0, 0.3)",
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 4,
          },
        },
      },
    });

    function generateGradientForCondition(ctx, chartArea, condition) {
      const gradient = ctx.createLinearGradient(
        0,
        chartArea.top,
        0,
        chartArea.bottom
      );

      switch (condition) {
        case "clear sky":
          gradient.addColorStop(0, "rgba(135,206,235, 0.8)");
          gradient.addColorStop(1, "rgba(255,255,255, 0.8)");
          break;
        case "few clouds":
          gradient.addColorStop(0, "rgba(189,195,199, 0.8)");
          gradient.addColorStop(1, "rgba(52,73,94, 0.8)");
          break;
        case "scattered clouds":
          gradient.addColorStop(0, "rgba(204,214,221, 0.8)");
          gradient.addColorStop(1, "rgba(127,140,141, 0.8)");
          break;
        case "overcast clouds":
          gradient.addColorStop(0, "rgba(108,122,137, 0.8)");
          gradient.addColorStop(1, "rgba(44,62,80, 0.8)");
          break;
        case "light rain":
          gradient.addColorStop(0, "rgba(52,152,219, 0.8)");
          gradient.addColorStop(1, "rgba(41,128,185, 0.8)");
          break;
        case "moderate rain":
          gradient.addColorStop(0, "rgba(93,173,226, 0.8)");
          gradient.addColorStop(1, "rgba(52,152,219, 0.8)");
          break;
        case "heavy intensity rain":
          gradient.addColorStop(0, "rgba(52,73,94, 0.8)");
          gradient.addColorStop(1, "rgba(44,62,80, 0.8)");
          break;
        case "thunderstorm":
          gradient.addColorStop(0, "rgba(47,54,64, 0.8)");
          gradient.addColorStop(1, "rgba(149,165,166, 0.8)");
          break;
        case "snow":
        case "light snow":
          gradient.addColorStop(0, "rgba(236,240,241, 0.8)");
          gradient.addColorStop(1, "rgba(189,195,199, 0.8)");
          break;
        case "mist":
        case "fog":
          gradient.addColorStop(0, "rgba(236,240,241, 0.8)");
          gradient.addColorStop(1, "rgba(189,195,199, 0.8)");
          break;
        default:
          gradient.addColorStop(0, "rgba(44,62,80, 0.8)");
          gradient.addColorStop(1, "rgba(34,49,63, 0.8)");
          break;
      }

      return gradient;
    }

    if (tempBarChart) {
      tempBarChart.destroy();
    }
    const tempBarChartElement = document
      .getElementById("temp-bar-chart")
      .getContext("2d");
    tempBarChart = new Chart(tempBarChartElement, {
      type: "bar",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Avg Temp (°C)",
            data: tempData,
            backgroundColor: "rgba(22, 160, 133, 0.8)",
            borderColor: "rgba(26, 188, 156, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.3)",
            },
            ticks: {
              color: "#ffffff",
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.3)",
            },
            ticks: {
              color: "#ffffff",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },
      },
    });

    if (tempLineChart) {
      tempLineChart.destroy();
    }
    const tempLineChartElement = document
      .getElementById("temp-line-chart")
      .getContext("2d");
    tempLineChart = new Chart(tempLineChartElement, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Avg Temp (°C)",
            data: tempData,
            fill: false,
            borderColor: "rgba(241, 196, 15, 1)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.3)",
            },
            ticks: {
              color: "#ffffff",
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.3)",
            },
            ticks: {
              color: "#ffffff",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
        },
      },
    });
  }

  function toggleLoading(show) {
    loadingSpinner.style.display = show ? "flex" : "none";
  }

  document
    .getElementById("current-location-btn")
    .addEventListener("click", function () {
      fetchWeatherDataForCurrentLocation();
    });

  function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = `
        <div id="error-message" class="flex items-center justify-center bg-red-200 border border-red-600 p-4 rounded shadow-md transition-all duration-300 ease-in-out transform hover:scale-105">
            <svg class="error-icon w-6 h-6 mr-2 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 4a8 8 0 100 16 8 8 0 000-16z" />
            </svg>
            <span class="text-red-600 font-semibold">Error: ${message}</span>
        </div>
    `;

    setTimeout(() => {
      errorMessage.innerHTML = "";
    }, 1000);
  }

  cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const city = cityInput.value.trim();
      if (city) {
        fetchCurrentWeatherData(city);
      }
    }
  });

  document.getElementById("search-btn").addEventListener("click", function () {
    const city = cityInput.value.trim();
    if (city) {
      fetchCurrentWeatherData(city);
    } else {
      alert("Please enter a city name.");
    }
  });

  unitToggle.addEventListener("change", function () {
    const city = cityInput.value.trim();
    if (city) {
      fetchCurrentWeatherData(city);
    }
  });

  fetchWeatherDataForCurrentLocation();
});
