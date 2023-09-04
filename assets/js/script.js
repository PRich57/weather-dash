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
  // Declare a variable to set a max length of displayed search history
  var maxHistory = 8;
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
  // Declare array of cards for forecast
  var cards = [$("#1"), $("#2"), $("#3"), $("#4"), $("#5")];
  // Declare icon variable for weather icons
  var icon = $("#icons");

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
        // Update text node of the city element
        city.text(data.name);
        // Update text node of the date element to desired date format
        date.text(today.format("[Today] - dddd, MMMM D, YYYY"));
        // Update text node of current temp, rounded for appearance
        currentTemp.text("Temp: " + Math.round(data.main.temp) + "°F");
        // Update text node of current wind speed, rounded for appearance
        currentWind.text("Wind Speed: " + Math.round(data.wind.speed) + " mph");
        // Update text node of current humidity, rounded for appearance
        currentHumidity.text(
          "Humidity: " + Math.round(data.main.humidity) + "%"
        );
        // Set src attribute with data icon code to load in the corresponding png
        icon.attr("src", "./assets/images/" + data.weather[0].icon + ".png");
      });
  }

  // Create function for fetching forecast data
  function getForecast(requestUrlArg) {
    fetch(requestUrlArg)
      .then(function (response) {
        return response.json();
      })
      // Use json response in next then function
      .then(function (data) {
        console.log(data);
        // for each card in the cards array
        for (var i = 0; i < cards.length; i++) {
          // Update the date header for cards[i] in cards array
          cards[i]
            .children()
            .children("h4")
            .text(today.add(i + 1, "day").format("MMM D, YYYY"));
          // Update the temp for cards[i] in cards array
          // cards[i].children('ul').children().eq(0).text('Temp: ' +  + '°F');
          // Update wind speed for cards[i] in cards array
          // cards[i].children('ul').children.eq(1).text('Wind Speed: ' +  + ' mph');
          // Update humidity for cards[i] in cards array
          // cards[i].children('ul').children.eq(2).text('Humidity: ' +  + '%');
        } // May need to average out the daily temp, wind speed, humidity
      });
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
    storedHistory.push(searchItem);
    // Save the updated searchHistory back to local storage
    localStorage.setItem("searchHistory", JSON.stringify(storedHistory));

    // Clear the input field
    $('input').val("");

    // Call function to update the search history list
    listHistory();
  }

  // Create function to list the search history for the user to see and use
  function listHistory() {
    // Use the history reference variable and clear any existing list items

      
    // Get items from local storage
    var listHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    console.log(listHistory);

    // Create buttons for each stored item
    for (var i = 0; i < maxHistory; i++) {
      historyUl.text("");
      var historyLi = $('<li>');
      historyUl.append(historyLi);
      var historyBtn = $('<button>');
      historyBtn.text(listHistory[i]);
      console.log(listHistory[i]);
      historyLi.append(historyBtn);
      console.log(historyBtn);

    }
  }  
    
    
    
    // for (const searchItem in listHistory) {
    //   var historyBtn = $("<button>");
    //   historyBtn.textContent = searchItem;
    //   history.append(historyBtn);

  

  // NEED TO MAKE INPUT TO GETCURRRENT AND GETFORECAST FUNCTIONS BE THE CITY NAME ONLY TO MAKE THE HISTORY BUTTONS WORK CORRECTLY

  // EVENT LISTENERS
  fetchBtn.on("click", function (event) {
    var userCity = $("input").val();
    console.log(userCity);
    if (userCity === "") {
      alert("You must enter a city name");
      return;
    }

    var userCurrent = currentUrl + userCity + apiKey;
    var userForecast = forecastUrl + userCity + apiKey;

    getCurrent(userCurrent);
    getForecast(userForecast);
    searchHistory();
  });

  // historyBtn.on("click", function (event) {
  //   getCurrent()
  // })

  // FUNCTION CALLS FOR FIRST LOAD CONTENT
  getCurrent(currentUrl + "Denver" + apiKey);
  getForecast(forecastUrl + "Denver" + apiKey);
  listHistory();
});
