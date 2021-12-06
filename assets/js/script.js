
var searchForm = document.querySelector("#search-form");

var cityInput = document.querySelector("input[name='city-name'");

var cityBtnHolder = document.querySelector("#city-btn-holder");

// div at top right showing current weather of the city
var currWeatherDiv = document.querySelector("#current-weather-div");

// div at bottom right showing the 5 day forecast
var forecastDiv = document.querySelector("#forecast-div");

// used to save searched cities to localStorage
var weatherHistory = [];



// gets city name that user typed into the input
function getCityName(event) {

    event.preventDefault();

    var city = cityInput.value.trim().toLowerCase();

    getCityCoordinates(city);
}


// sends request for the city's latitude and longitude.
// which we then send to the next function to get weather
// because to get the weather from an api call, we needed
// the city's coordinates.
function getCityCoordinates(city) {

    // first request searches the city for its latitude and longitude.
    // which we then send to the next request
    var locationUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=25a0a3853c98f0959d63fd8d044d8527";


    fetch(locationUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                // store latitude and longitude of city in a variable
                getCityWeather(data.coord.lat, data.coord.lon, city);
                // push city name to array
                weatherHistory.push(city);
                // display button in sidebar
                // this function also calls the function
                // that saves the city to history.
                displayHistory(city);
            });
        }
        else{
            alert("Please enter a valid city");
        }
    });


}


// after getting the city's coordinates, we pass it to this api request
// that gives us all the weather info we need
function getCityWeather(lat, lon, cityName){
    

    var getWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&exclude=alerts&units=imperial&appid=25a0a3853c98f0959d63fd8d044d8527";

    fetch(getWeatherUrl).then(function(wResponse){
        if(wResponse.ok){
            wResponse.json().then(function(wData){
                // pass weather data object to displayWeather()
                // function
                console.log(wData);
                displayWeather(wData, cityName);
            });
        }
        else {
            alert("Something went wrong");
        }
    });

}



function displayHistory(city) {

    var cityBtn = document.createElement("button");
    cityBtn.classList = "w-100 btn cityBtn mt-4";
    // capitalizes city name string
    var cityName = city[0].toUpperCase() + city.slice(1);

    // checking if the city has more than one word
    // like san luis obispo. if it does, this
    // capitalizes each individual word
    if(cityName.indexOf(" ") >= 0){
        var otherWords = city.split(" ");

        for(var i = 0; i < otherWords.length; i++){
            // change current word, to the current word's first letter 
            // capitalized, plus the rest of the word after the first letter
            otherWords[i] = otherWords[i][0].toUpperCase() + otherWords[i].slice(1);
        }

        cityName = otherWords.join(" ");
    }

    cityBtn.textContent = cityName;

    // if array is above 8 items in history, shifts out the oldest
    // weather search and the button in the sidebar as well gets removed
    if(weatherHistory.length > 8){
        weatherHistory.shift();
        // had to specifically use lastChildElement
        // instead of lastChild to remove the element.
        cityBtnHolder.removeChild(cityBtnHolder.lastElementChild);
    }
    saveHistory();

    // appends child but above the other children already
    // in the container
    cityBtnHolder.prepend(cityBtn);

}


// displays weather info to right column
function displayWeather(cityObj, cityName){

    // clear content from parent containers
    currWeatherDiv.textContent = "";
    forecastDiv.textContent = "";

    // div going inside of the curr weather div,
    // this div will hold all the details
    var weatherDiv = document.createElement("div")
    weatherDiv.classList = "right-div p-2 border border-dark";

    // current date string
    // you convert unix time values by multiplying them
    // by 1000.
    var date = moment(cityObj.current.dt * 1000).format("M/DD/YYYY");
    
    // h2 for city title with date
    var cityTitle = document.createElement("h2")
    cityTitle.classList = "w-100 m-0 city-title font-weight-bolder";

    // capitalizes city name string
    var capName = cityName[0].toUpperCase() + cityName.slice(1);

    // checking if the city has more than one word
    // like san luis obispo. if it does, this
    // capitalizes each individual word
    if(capName.indexOf(" ") >= 0){
        var otherWords = cityName.split(" ");

        for(var i = 0; i < otherWords.length; i++){
            // change current word, to the current word's first letter 
            // capitalized, plus the rest of the word after the first letter
            otherWords[i] = otherWords[i][0].toUpperCase() + otherWords[i].slice(1);
        }

        capName = otherWords.join(" ");
    }

    cityTitle.textContent = capName + " " + date + " ";


    // weather icon
    var currIcon = document.createElement("img");
    // make it inline so it shows next to h2
    currIcon.className = "d-inline-block"
    currIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + cityObj.current.weather[0].icon + "@2x.png");

    cityTitle.appendChild(currIcon)

    weatherDiv.appendChild(cityTitle);


    // make temperature <p> element
    var tempP = document.createElement("p");
    tempP.classList = "mb-4 city-p";
    tempP.textContent = "Temp: " + cityObj.current.temp + "\u00B0F";

    weatherDiv.appendChild(tempP);

    // make wind <p> element
    var windP = document.createElement("p");
    windP.classList = "mb-4 city-p";
    windP.textContent = "Wind: " + cityObj.current.wind_speed + " MPH";

    weatherDiv.appendChild(windP);

    // make humidity <p> element
    var humidP = document.createElement("p");
    humidP.classList = "mb-4 city-p";
    humidP.textContent = "Humidity: " + cityObj.current.humidity + " %";

    weatherDiv.appendChild(humidP);

    // make UV <p> element
    var uvP = document.createElement("p");
    uvP.classList = "mb-4 city-p";
    var uvBgColor = "";

    // adds a bootstrap background color class
    // depending on the uv index being safe, moderate
    // or dangerous.
    // the daily[0] returns today's uv index. had to use this
    // instead of current because current's uv index was always
    // 0 from the api call, so I subsituted for the daily uv index
    // for today of the city
    if(cityObj.daily[0].uvi < 3){
        uvBgColor = "bg-success";
    }
    else if(cityObj.daily[0].uvi < 6){
        uvBgColor = "bg-warning";
    }
    else{
        uvBgColor = "bg-danger";
    }

    uvP.innerHTML = "UV Index: <span class='pr-3 pl-3 bg-uv-index " + uvBgColor + " text-white'>" + cityObj.daily[0].uvi + "</span> %";

    weatherDiv.appendChild(uvP);




    // 5 day forecast


    // title that says 5-day forecast
    var forecastTitle = document.createElement("h2");
    forecastTitle.classList = "w-100 font-weight-bold mb-4";
    forecastTitle.textContent = "5-Day Forecast:";

    forecastDiv.appendChild(forecastTitle);



    // create div to go inside of forecastDiv
    var weekDiv = document.createElement("div");
    weekDiv.className = "d-flex right-div week-div";

    

    // loop through the daily objects in the response,
    // skip index 0 because that is the first day.
    // stop loop after 5 days of cards have been made.
    for(var i = 1; i < 6; i++){

        var currDay = cityObj.daily[i];

        // create card
        var cardEl = document.createElement("div");
        cardEl.classList = "p-3 mb-4 card card-bg card-day text-white";

        // get current date
        var day = moment(currDay.dt * 1000).format("M/DD/YYYY");

        // put date as header of card
        var dayHeader = document.createElement("h3");
        dayHeader.classList = "card-title font-weight-bold";
        dayHeader.textContent = day;

        cardEl.appendChild(dayHeader);


        var weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + currDay.weather[0].icon + "@2x.png");
        // makes image smaller
        weatherIcon.classList = "w-50";

        cardEl.appendChild(weatherIcon);


        // make temperature <p> element in card
        var tempP = document.createElement("p");
        tempP.classList = "mb-2 card-p";
        tempP.textContent = "Temp: " + currDay.temp.day + "\u00B0F";

        cardEl.appendChild(tempP);


        // make wind <p> element in card
        var windP = document.createElement("p");
        windP.classList = "mb-2 card-p";
        windP.textContent = "Wind: " + currDay.wind_speed + " MPH";

        cardEl.appendChild(windP);


        // make wind <p> element in card
        var humidP = document.createElement("p");
        humidP.classList = "mb-2 card-p";
        humidP.textContent = "Humidity: " + currDay.humidity + " %";

        cardEl.appendChild(humidP);



        // append new card to container
        weekDiv.appendChild(cardEl);
    }



    // append both of the divs to the DOM at the same time
    forecastDiv.appendChild(weekDiv);
    currWeatherDiv.appendChild(weatherDiv);
}



function rePickCity(event){
    // if the target clicked within the button holder
    // has the class "btn" (meaning its a button).
    // send the text of the button (city name) into the
    // function to start getting the weather.
    if(event.target.classList.contains("btn")){
        var city = event.target.textContent.toLowerCase().trim();
        getCityCoordinates(city);
    }
    else{
        console.log("nope");
        return;
    }
}




// on load, loads in city user was looking at before
// if applicable.




// save and load
function saveHistory() {
    localStorage.setItem("history", JSON.stringify(weatherHistory));
}




function loadHistory() {
    weatherHistory = JSON.parse(localStorage.getItem("history"));

    if(!weatherHistory){
        weatherHistory = [];
        console.log(weatherHistory);
        return;
    }

    // on load, loads in city user was looking at before.
    currWeatherDiv.innerHTML = "";
    getCityCoordinates(weatherHistory[weatherHistory.length-1]);

    // loop through saved array and display the buttons on sidebar.
    for(var i = 0; i < weatherHistory.length; i++){
        displayHistory(weatherHistory[i]);
    }
    
}


// events and listeners

loadHistory();

searchForm.addEventListener("submit", getCityName);
// event delegation for when a user clicks a button on 
// the sidebar
cityBtnHolder.addEventListener("click", rePickCity);