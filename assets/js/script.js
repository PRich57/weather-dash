$(function () {
  // VARIABLE DECLARATIONS
  var fetchBtn = $("button");
  var userCity;
  var city = $(".city");
  var currentTemp = $('.temp');
  var currentWind = $('.wind');
  var currentHumidity = $('.humidity');
  var history = $(".search-history");
  var apiKey = "&appid=9217e4926ac9dcff03755cdfef766696";

  

  
  
  // // FUNCTIONS
  function getApi(requestUrlArg) {
    fetch(requestUrlArg)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      city.text(data.name);
      currentTemp.text('Temp: ' + Math.round(data.main.temp) + "°F");
      currentWind.text('Wind Speed: ' + Math.round(data.wind.speed) + " mph");
      currentHumidity.text('Humidity: ' + data.main.humidity + "%");
    });
  }
  
  
  // function appendResults(userInfo) {

    
  // }
  
  
  
  // EVENT LISTENERS
  fetchBtn.on("click", function (event) {
    var userCity = $('input').val();
    var currentWeatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + userCity + apiKey;
    var forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + userCity + apiKey;
    
    
    console.log(userCity);
    
    getApi(currentWeatherUrl);
    // appendResults(userCity);
    // getApi(forecastUrl);
  });
  
});