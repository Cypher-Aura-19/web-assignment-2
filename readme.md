# Weather Dashboard with Chatbot Integration

This project is a weather dashboard that displays real-time weather information for a chosen city using the [OpenWeather API](https://openweathermap.org/). It also integrates a chatbot powered by the [Gemini API](https://aistudio.google.com/app/prompts/1c-b9cAkurKOwj4WMnsVuyl34Yf8U398l), which allows users to ask weather-related questions.

## Features

1. **Sidebar with Hamburger Menu**:

   - A responsive sidebar that can be opened and closed with a hamburger and close icon.
   - Overlay effect highlights the sidebar when it's active.

2. **Weather Data Display**:

   - Real-time weather data such as temperature, humidity, and wind speed for a selected city.
   - Pagination to display hourly forecasts for the next 5 days.
   - Toggle functionality to switch between Celsius and Fahrenheit.

3. **Filtering Options**:

   - Filters to sort and display data based on weather conditions, such as ascending/descending temperatures or rainy days.
   - A reset button to clear filters and revert to the original data.

4. **Search Functionality**:

   - A city search feature that lets users retrieve weather data by entering a city name.
   - Error handling for invalid city names with user feedback.

5. **Pagination**:

   - The weather data is paginated to display a limited number of items per page (10 by default). Users can navigate between pages using the next/previous buttons.

6. **Loading Spinner**:

   - A loading spinner appears while the weather data is being fetched, ensuring smooth user experience.

7. **Chatbot Integration**:
   - Integrated chatbot using the Gemini API, allowing users to ask questions and receive answers related to weather information.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Code Breakdown](#code-breakdown)
  - [Hamburger Menu](#hamburger-menu)
  - [Fetching Weather Data](#fetching-weather-data)
  - [Displaying Weather Data](#displaying-weather-data)
  - [Filters](#filters)
  - [Pagination](#pagination)
  - [Chatbot Integration](#chatbot-integration)
  - [Error Handling](#error-handling)
- [APIs](#apis)
- [Styling](#styling)

## Installation

To run this project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. Open `index.html` in your browser to view the weather dashboard.

## Usage

- **Search for Weather**: Enter a city name in the input field and click the "Search" button to fetch weather data.
- **Change Temperature Unit**: Use the toggle to switch between Celsius and Fahrenheit.
- **Navigate Pages**: Use the "Previous" and "Next" buttons to view additional weather data.
- **Apply Filters**: Click the filter icon to open the modal and apply the desired filters.
- **Interact with Chatbot**: Enter weather-related questions in the chatbot and click "Send" for a response.

## Code Breakdown

### Hamburger Menu

The sidebar can be toggled using a hamburger icon to open it and a close icon to hide it. When the sidebar is active, an overlay is applied to the main content to draw attention to the sidebar.

### Fetching Weather Data

Weather data is fetched from the OpenWeather API based on the city entered by the user. The app handles errors like invalid or non-existent cities and displays an error message when necessary.

### Displaying Weather Data

The dashboard displays a table of hourly weather forecasts for the next five days. It shows the date, temperature, and weather conditions. Users can toggle between Celsius and Fahrenheit to display temperature in their preferred unit.

### Filters

Users can apply filters to the weather data. Available filters include sorting temperatures in ascending or descending order, showing rainy days only, or highlighting the day with the highest temperature. A reset button clears all applied filters and restores the original data.

### Pagination

Weather data is paginated to ensure a clean user experience. Only 10 data points are shown per page, and users can navigate through pages using "Next" and "Previous" buttons.

### Chatbot Integration

The chatbot, powered by the Gemini API, allows users to ask questions about the weather data. The chatbot responds based on the data fetched from the OpenWeather API, providing relevant information such as temperatures, conditions, and forecasts.

### Error Handling

If the user enters an invalid city, the application displays an error message informing them that the city could not be found. It also provides feedback when network issues occur or when the data fails to load properly.

## APIs

1. **OpenWeather API**: Used for fetching real-time weather data, including the current temperature, humidity, wind speed, and weather forecasts.
2. **Gemini API**: Integrates chatbot functionality that responds to user queries related to weather data.

## Styling

The dashboard uses a professional black-themed design that adheres to HCI (Human-Computer Interaction) principles, making it visually appealing and easy to use. The UI is responsive, ensuring compatibility across devices and screen sizes.

# my name is talha rizwan