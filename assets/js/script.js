// Do everything inside jquery function to make sure DOM loads first
$(function () {
  // VARIABLE DECLARATIONS
  // Declare button variable
  var fetchBtn = $("button");
  // Declare city variable
  var city = $(".city");
  // Declare date variable
  var date = $('.date');
  // Declare current temp variable
  var currentTemp = $('.temp');
  // Declare current wind variable
  var currentWind = $('.wind');
  // Declare current humidity variable
  var currentHumidity = $('.humidity');
  // Declare search history variable
  var history = $(".search-history");
  // Declare API Key variable
  var apiKey = "&appid=9217e4926ac9dcff03755cdfef766696";
  // Declare variable for initial current weather upon loading the app
  var initialCurrent = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=Denver" + apiKey;
  // Declare variable for initial forecast upon loading the app
  var initialForecast = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=Denver" + apiKey;
  // Declare dayjs variable
  var today = dayjs();
  // Declare array of cards for forecast
  var cards = [$('#1'), $('#2'), $('#3'), $('#4'), $('#5')];
  // Declare icon variable for weather icons
  var icon = $('#icons');
  
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
      date.text(today.format('[Today] - dddd, MMMM D, YYYY'));
      // Update text node of current temp, rounded for appearance
      currentTemp.text('Temp: ' + Math.round(data.main.temp) + "°F");
      // Update text node of current wind speed, rounded for appearance
      currentWind.text('Wind Speed: ' + Math.round(data.wind.speed) + " mph");
      // Update 
      currentHumidity.text('Humidity: ' + Math.round(data.main.humidity) + "%");
      icon.attr('src', './assets/images/' + data.weather[0].icon + '.png');
    });
  }

  function getForecast(requestUrlArg) {
    fetch(requestUrlArg)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < cards.length; i++) {
        cards[i].children().children('h4').text(today.add(i + 1, 'day').format('MMM D, YYYY'));
        // cards[i].children('ul').children().eq(0).text('Temp: ' + )
        
      }
    })
  }
  

  
  // EVENT LISTENERS
  fetchBtn.on("click", function (event) {
    var userCity = $('input').val();
    console.log(userCity);
    if (userCity === "") {
      alert("You must enter a city name");
      return;
    }
    
    var userCurrent = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + userCity + apiKey;
    var userForecast = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + userCity + apiKey;
    
    getCurrent(userCurrent);
    getForecast(userForecast);
    $('input').val("");
  });

  // FUNCTION CALLS FOR INITIAL CONTENT
  getCurrent(initialCurrent);
  getForecast(initialForecast);
});