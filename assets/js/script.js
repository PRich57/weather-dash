$(function () {
  // VARIABLE DECLARATIONS
  var fetchBtn = $("button");
  var city = $(".city");
  var date = $('.date');
  var currentTemp = $('.temp');
  var currentWind = $('.wind');
  var currentHumidity = $('.humidity');
  var history = $(".search-history");
  var userCity;
  var apiKey = "&appid=9217e4926ac9dcff03755cdfef766696";
  var initialCurrent = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=Denver" + apiKey;
  var initialForecast = "https://api.openweathermap.org/data/2.5/forecast/daily?units=imperial&cnt=5&q=Denver" + apiKey;

  var today = dayjs();
  var cards = [$('#1'), $('#2'), $('#3'), $('#4'), $('#5')];
  var icon = $('#icons');
  console.log(cards);
  

  
  
  // // FUNCTIONS
  function getCurrent(requestUrlArg) {
    fetch(requestUrlArg)
    .then(function (response) {
      // console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      city.text(data.name);
      date.text(today.format('[Today] - dddd, MMMM D, YYYY'));
      currentTemp.text('Temp: ' + Math.round(data.main.temp) + "°F");
      currentWind.text('Wind Speed: ' + Math.round(data.wind.speed) + " mph");
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
    userCity = $('input').val();
    console.log(userCity);

    var userCurrent = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + userCity + apiKey;
    var userForecast = "https://api.openweathermap.org/data/2.5/forecast/daily?units=imperial&cnt=5&q=" + userCity + apiKey;
    
    getCurrent(userCurrent);
    getForecast(userForecast);
  });

  // FUNCTION CALLS FOR INITIAL CONTENT
  getCurrent(initialCurrent);
  getForecast(initialForecast);
});