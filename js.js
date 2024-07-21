const API_key = '081e5c094de6b4f41d621281dd354c19';
let yourweather = document.querySelector(".yourweather");
let searchweather = document.querySelector(".searchweather");
let loading = document.querySelector(".loading");
let content = document.querySelector(".content");
let grant = document.querySelector(".grantaccess");
let searchcity = document.querySelector(".search");
let city = document.querySelector(".searchcity");
city.value = "";

yourweather.classList.add("borderadd");
grant.classList.add("active");

yourweather.addEventListener('click', function () {
    yourweather.classList.add("borderadd");
    searchweather.classList.remove("borderadd");
    searchcity.classList.remove("active");
    content.classList.remove('active');
    message.classList.remove("otheractive");
    choicecases();
});

function choicecases() {
    let local = sessionStorage.getItem("weather_data");
    let data = JSON.parse(local);
    if (!local) {
        grant.classList.add("active");
    }
    else {
        fetchinfo(data);
    }
}

searchweather.addEventListener('click', function () {
    searchcity.classList.add("active");
    grant.classList.remove("active");
    content.classList.remove("active");
    yourweather.classList.remove("borderadd");
    searchweather.classList.add("borderadd");
    searchweathercondition();
});
let message = document.querySelector(".container2");
let searchicon = document.querySelector("#iconsearch");
function searchweathercondition() {
    searchicon.addEventListener('click', function () {
        if (city.value === "") {
            alert('Enter the city name first, my friend');
        }
        else {
            searchcityweather();
        }

    });
}


async function searchcityweather() {
    let cityname = city.value;
    loading.classList.add("active");
    grant.classList.remove("active");
    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API_key}&units=metric`);
        let data = await response.json();
        loading.classList.remove("active");
        content.classList.add("active");
        message.classList.remove("otheractive");
        enterdata(data);
    }
    catch (err) {
        console.log("Error is there",err);
        content.classList.remove("active");
        message.classList.add("otheractive");
        searchcity.classList.remove("active");
    }
}

let grantbutton = document.querySelector(".grantaccesbutton");
grantbutton.addEventListener('click', getlocation);
function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else {
        alert("Can't have the location access!!");
    }
}
function showposition(position) {
    const coordinates_user = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    };
    sessionStorage.setItem("weather_data", JSON.stringify(coordinates_user));
    //for setting up the key and value pair in the browser
    fetchinfo(coordinates_user);
}
async function fetchinfo(coordinate) {
    const lat = coordinate.lat;
    const lon = coordinate.lon;
    // let { lat, lon } = coordinate;
    grant.classList.remove("active");
    loading.classList.add("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loading.classList.remove("active");
        content.classList.add("active");
        enterdata(data);
    }
    catch (err) {
        console.log("Error");
    }

}

function enterdata(data) {
    const cityname = document.querySelector(".cityname");
    const countryicon = document.querySelector(".countryicon");
    const atthattime = document.querySelector(".atthattime");
    const atthattimeimage = document.querySelector(".atthattimeimage");
    const temperature = document.querySelector(".temperature");
    const windspeed = document.querySelector(".windspeed");
    const humiditypercentage = document.querySelector(".humiditypercentage");
    const cloudpercentage = document.querySelector(".cloudpercentage");

    cityname.innerText = data?.name;
    temperature.innerHTML = `${data?.main?.temp}&deg;C`;
    windspeed.innerText = `${data?.wind?.speed}km/h`;
    humiditypercentage.innerText = `${data?.main?.humidity}%`;
    cloudpercentage.innerHTML = `${data?.clouds.all}%`;
    countryicon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    atthattime.innerText = data?.weather?.[0]?.description;
    atthattimeimage.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
}