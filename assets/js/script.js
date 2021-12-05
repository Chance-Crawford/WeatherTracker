
var searchForm = document.querySelector("#search-form");

var cityInput = document.querySelector("input[name='city-name'");

var cityBtnHolder = document.querySelector("#city-btn-holder");

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
                getCityWeather(data.coord.lat, data.coord.lon);
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
function getCityWeather(lat, lon){
    console.log("ran");
    console.log(lat);
    console.log(lon);

    var getWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&exclude=alerts&units=imperial&appid=25a0a3853c98f0959d63fd8d044d8527";

    fetch(getWeatherUrl).then(function(wResponse){
        if(wResponse.ok){
            wResponse.json().then(function(wData){
                console.log(wData);
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
    cityBtn.textContent = city[0].toUpperCase() + city.slice(1);

    // if array is above 8 items in history, shifts out the oldest
    // weather search and the button in the sidebar as well gets removed
    if(weatherHistory.length > 8){
        weatherHistory.shift();
        // had to specifically use lastChildElement
        // instead of lastChild to remove the element.
        cityBtnHolder.removeChild(cityBtnHolder.lastElementChild);
        console.log("removed");
    }
    saveHistory();

    // appends child but above the other children already
    // in the container
    cityBtnHolder.prepend(cityBtn);

    

}


// save and load
function saveHistory() {
    localStorage.setItem("history", JSON.stringify(weatherHistory));
}




function loadHistory() {
    weatherHistory = JSON.parse(localStorage.getItem("history"));

    if(!weatherHistory){
        weatherHistory = [];
        return;
    }

    // loop through saved array and display the buttons on sidebar.
    for(var i = 0; i < weatherHistory.length; i++){
        displayHistory(weatherHistory[i]);
    }
    
}


// events and listeners
loadHistory();
searchForm.addEventListener("submit", getCityName);