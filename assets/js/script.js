// Do everything inside jquery function to make sure DOM loads first
$(function () {
  // VARIABLE DECLARATIONS

  // Declare button variable
  var fetchBtn = $("button");
  // Declare city variable
  var city = $(".city");
  // Declare date variable
  var date = $(".date");
  // Declare current temp variable
  var currentTemp = $(".temp");
  // Declare current wind variable
  var currentWind = $(".wind");
  // Declare current humidity variable
  var currentHumidity = $(".humidity");
  // Declare search history variable
  var historyUl = $("#historyUl");
  // Declare API Key variable
  var apiKey = "&appid=9217e4926ac9dcff03755cdfef766696";
  // Declare variable for current weather url
  var currentUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=";
  // Declare variable for forecast url
  var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=";
  // Declare dayjs variable
  var today = dayjs();
  // Declare icon variable for current weather icon
  var icon = $("#icon");
  // Declare array of cards for forecast
  var cards = [$("#1"), $("#2"), $("#3"), $("#4"), $("#5")];

  // FUNCTIONS

  // Create function for fetching current weather data
  function getCurrent(requestUrlArg) {
    fetch(requestUrlArg)
      .then(function (response) {
        return response.json();
      })
      // Use json response in next then function
      .then(function (data) {
        console.log(data);
        // Validation
        if (data.cod === "404") {
          city.text(data.message);
          date.text("Please try your search again");
          currentTemp.text("");
          currentWind.text("");
          currentHumidity.text("");
          icon.attr("src", "./assets/images/unknown.png");
          $("input").val("");
          return;
        }
        // Update text node of the city element
        city.text(data.name);
        // Update text node of current temp, rounded for appearance
        currentTemp.text("Current Temp: " + Math.round(data.main.temp) + "°F");
        // Update text node of current wind speed, rounded for appearance
        currentWind.text("Wind Speed: " + Math.round(data.wind.speed) + " mph");
        // Update text node of current humidity, rounded for appearance
        currentHumidity.text(
          "Humidity: " + Math.round(data.main.humidity) + "%"
        );
        // Set src attribute with data icon code to load in the corresponding png
        icon.attr("src", "./assets/images/" + data.weather[0].icon + ".png");
        searchHistory();
      });
  }

  // Create function for fetching forecast data
  function getForecast(requestUrlArg) {
    fetch(requestUrlArg)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        
        // Validation
        if (data.cod === '404') {
          return;
        }

        // Declare array of divided out days from 5 day 3 hour forecast
        var days = [
          // Each day has 8 3-hour segments
          data.list.slice(0, 8),
          data.list.slice(8, 16),
          data.list.slice(16, 24),
          data.list.slice(24, 32),
          data.list.slice(32),
        ];
        
        // Iterate through cards
        for (var i = 0; i < cards.length; i++) {
          // Declare variables for sum and average temp, wind speed, and humidity
          var sumT, avgT, sumW, avgW, sumH, avgH, tempMax;
          
          // Set all equal to 0
          sumT = avgT = sumW = avgW = sumH = avgH = tempMax = 0;
          
          // Declare variable to store icon IDs
          var iconId;

          // For each day, get the sum of temps, wind speeds, and humidity from all segments
          days[i].forEach((element) => {
            sumT += element.main.temp;
            sumW += element.wind.speed;
            sumH += element.main.humidity;

            // Get high temp from each day
            if (tempMax < element.main.temp_max) {
              tempMax = element.main.temp_max;
            }
            // Get icon for each day using the pod object due to time being relative to UTC
            if (element.sys.pod.includes("d")) {
              iconId = element.weather[0].icon;
              console.log(iconId);
            }
          });
          
          console.log(tempMax);
          tempMax = Math.round(tempMax);
          
          // Use the sums to get each day's average and round them for appearance
          avgT = Math.round(sumT / days[i].length);
          avgW = Math.round(sumW / days[i].length);
          avgH = Math.round(sumH / days[i].length);
          
          // Update the temp for cards[i] in cards array
          cards[i]
          .children("ul")
          .children()
          .eq(0)
          .text("Avg Temp: " + avgT + "°F");
          // Update wind speed for cards[i] in cards array
          cards[i]
          .children("ul")
          .children()
          .eq(1)
          .text("High: " + tempMax + "°F");
          // Update wind speed for cards[i] in cards array
          cards[i]
          .children("ul")
          .children()
          .eq(2)
          .text("Wind Speed: " + avgW + " mph");
          // Update humidity for cards[i] in cards array
          cards[i]
          .children("ul")
          .children()
          .eq(3)
          .text("Humidity: " + avgH + "%");
          cards[i].children(".card-header").children().eq(0).attr("src", "./assets/images/" + iconId + ".png");
        }
          
      });
  }

  // Create function to use dayjs for dates
  function dateDisplay() {
    // Update text node of the date element to desired date format
    date.text(today.format("[Today] - dddd, MMMM D, YYYY"));

    // for each card in cards array
    for (var i = 0; i < cards.length; i++) {
      // Update the date for cards[i] with dayjs
      cards[i]
        .children()
        .children("h4")
        .text(today.add(i + 1, "day").format("MM/DD/YY"));
    }
  }

  // Create function to store search history in local memory
  function searchHistory() {
    // Save query to local storage
    var userSearch = $("input").val().toUpperCase();
    // Trim any potential whitespace from user's input
    var searchItem = userSearch.trim();

    // Exit condition
    if (searchItem === "") {
      return;
    }

    // Get existing history from local storage
    var storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    // Add new search to the existing search history
    storedHistory.unshift(searchItem);
    // Remove duplicates
    storedHistory = [...new Set(storedHistory)];
    // Save the updated searchHistory back to local storage
    localStorage.setItem("searchHistory", JSON.stringify(storedHistory));

    // Clear the input field
    $("input").val("");

    // Clear displayed search history to prevent doubling
    historyUl.empty();

    // Call function to update the search history list
    listHistory();
  }

  // Create function to list the search history for the user to see and use
  function listHistory() {
    // Get items from local storage
    var completeHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Use slice method first to store shallow copy of original array then reverse the copy
    var reversedHistory = completeHistory.slice();

    // Limit the reversed array copy to the 8 most recent elements
    var listHistory = reversedHistory.slice(0, 10);

    // Create buttons for each stored item starting from most recent entry
    for (var i = 0; i < listHistory.length; i++) {
      var historyLi = $("<li>");
      historyUl.append(historyLi);
      var historyBtn = $("<button>");
      historyBtn.text(listHistory[i]);
      historyBtn.attr("class", "historyBtn");
      historyLi.append(historyBtn);
    }
  }

  // EVENT LISTENERS

  // Listen for keyup event on enter key to do the same as clicking the search button
  fetchBtn.on("keyup", function (event) {
    // Prevent default button behavior for form elements
    event.preventDefault();
    // Set condition of pressing the enter key (keyCode 13)
    if (event.keyCode === 13) {
      // Declare variable to hold user input
      var userCity = $("input").val();
      // Validation
      if (userCity === "") {
        alert("You must enter a city name");
        return;
      }

      // Declare variable for input to getCurrent() with user's chosen city
      var userCurrent = currentUrl + userCity + apiKey;
      // Declare variable for input to getForecast() with user's chosen city
      var userForecast = forecastUrl + userCity + apiKey;

      // Call functions to get current weather and 5 day forecast
      getCurrent(userCurrent);
      getForecast(userForecast);
    }
  });

  // Listen for click on fetchBtn
  fetchBtn.on("click", function (event) {
    // Prevent default button behavior for form elements
    event.preventDefault();
    // Declare variable to hold user input
    var userCity = $("input").val();
    // Validation
    if (userCity === "") {
      alert("You must enter a city name");
      return;
    }

    // Declare variable for input to getCurrent() with user's chosen city
    var userCurrent = currentUrl + userCity + apiKey;
    // Declare variable for input to getForecast() with user's chosen city
    var userForecast = forecastUrl + userCity + apiKey;

    // Call functions to get current weather and 5 day forecast
    getCurrent(userCurrent);
    getForecast(userForecast);
  });

  // Listen for click on search history buttons
  historyUl.on("click", function (event) {
    // Declare variable to store the text content of the button clicked
    var searchAgain = event.target.textContent;
    // Declare variable for search history input to getCurrent function
    var currentSearchHistory = currentUrl + searchAgain + apiKey;
    // Declare variable for search history input to getForecast function
    var forecastSearchHistory = forecastUrl + searchAgain + apiKey;

    // Call the getCurrent and getForecast functions with search history input
    getCurrent(currentSearchHistory);
    getForecast(forecastSearchHistory);
  });

  // FUNCTION CALLS FOR FIRST LOAD CONTENT
  dateDisplay();
  getCurrent(currentUrl + "Denver" + apiKey);
  getForecast(forecastUrl + "Denver" + apiKey);
  listHistory();
});
