import { Client, TablesDB, Query } from "https://cdn.jsdelivr.net/npm/appwrite@21.0.0/+esm";

const dashboardSection = document.getElementById("dashboardSection");
const historySection = document.getElementById("historySection");
const forecastSection = document.getElementById("forecastSection");
const statisticsSection = document.getElementById("statisticsSection");
const aboutSection = document.getElementById("aboutSection");
const sideBar = document.getElementById("sideBar");
const dBtn = document.getElementById("dBtn");
const sBtn = document.getElementById("sBtn")
const fBtn = document.getElementById("fBtn")
const hBtn = document.getElementById("hBtn");
const aBtn = document.getElementById("aBtn");
dBtn.addEventListener("click", () => {
    dashboardSection.style.display = "block";
    historySection.style.display = "none";
    forecastSection.style.display = "none";
    aboutSection.style.display = "none";
    statisticsSection.style.display = "none";
});
fBtn.addEventListener("click", () => {
    forecastSection.style.display = "flex";
    dashboardSection.style.display = "none";
    historySection.style.display = "none";
    aboutSection.style.display = "none";
    statisticsSection.style.display = "none";
});
sBtn.addEventListener("click", () => {
    dashboardSection.style.display = "none";
    statisticsSection.style.display = "block";
    forecastSection.style.display = "none";
    historySection.style.display = "none";
    aboutSection.style.display = "none";
});

hBtn.addEventListener("click", () => {
    historySection.style.display = "block";
    dashboardSection.style.display = "none";
    forecastSection.style.display = "none";
    aboutSection.style.display = "none";
    statisticsSection.style.display = "none";
});
aBtn.addEventListener("click", () => {
    aboutSection.style.display = "block";
    dashboardSection.style.display = "none";
    forecastSection.style.display = "none";
    historySection.style.display = "none";
    statisticsSection.style.display = "none";
});

const menu = document.getElementById("menus");
let menuBool = false;
menu.addEventListener("click", () => {
    if(menuBool) {
        sideBar.style.display = "block";
        sideBar.style.position = "fixed";
        sideBar.style.zIndex = 3000;
        sideBar.style.height = "100vh";
        menu.innerHTML = '<ion-icon name="close-outline"></ion-icon>';
        menuBool = !menuBool;
    }
    else {
        sideBar.style.display = "none";
        menu.innerHTML = '<ion-icon name="menu-outline"></ion-icon>';
        menuBool = true;
    };
});

const tempData = document.getElementById("tempData");
const humidityData = document.getElementById("humidityData");
const rainData = document.getElementById("rainData");
const lightData = document.getElementById("lightData");
const airPresData = document.getElementById("airPresData");
const altitudeData = document.getElementById("altitudeData");
const windData = document.getElementById("windData");
const iconBox = document.getElementById("iconBox");
const conditionText = document.getElementById("conditionText");

const loader = document.getElementById("loading");

async function appWriteDataProcess() {
  const user = new Client();
  user.setEndpoint("https://nyc.cloud.appwrite.io/v1").setProject("42914291");
  const appWriteTable = new TablesDB(user);
  let res = await appWriteTable.listRows({
    databaseId: "6a73a050001026525006",
    tableId: "wms_server_database",
    queries: [
        Query.orderDesc("$createdAt"),
        Query.limit(100)
    ]
  });
  console.log(res);
  let wholeData = res.rows
  const latestRow = res.rows[4];
  const {
    WMSLastUpdate,
    APILastUpdated,
    dayOrNight,
    cloudCover,
    feelsLikeTemp,
    windKPH,
    windDirection,
    currentCondition,
    currentIcon,
    SunIntensity,
    maxTemp,
    minTemp,
    avgTemp,
    ForecatCondition,
    ForecastConditionIcon,
    chanceOfRain,
    avgHumidity,
    maxWindKph,
    sunrise,
    sunset,
    moonrise,
    moonset,
    moonIllumination,
    Temp,
    Humidity,
    LDRValue, 
    RainValue, 
    AirPressure, 
    Altitude, 
    Alert,
    hourlyTime,
    hourlyTemps,
    hourlyDayOrNight,
    hourlywindKPH,
    hourlyDirection,
    hourlyhumidity,
    hourlycloud,
    hourlyfeelslikeTemp,
    hourlyChanceOfRain,
    hourlyCondition
  } = latestRow;
  console.log(hourlyTime);
  tempData.innerText = String(Temp) + "°C" ?? "N/A";
  humidityData.innerText = String(Humidity) + "%" ?? "N/A";
  rainData.innerText = String(RainValue) + "%" ?? "N/A";
  lightData.innerText = String(LDRValue) + "%" ?? "N/A";
  airPresData.innerText = String(AirPressure) + "hpa" ?? "N/A";
  altitudeData.innerText = String(Altitude) ?? "N/A";
  windData.innerText = String(windKPH) + "kph"?? "N/A";
  if (currentIcon) {
    iconBox.innerHTML = `<img src="https:${currentIcon}" alt="Weather icon" style="width: 40px;">`;
  } else {
    iconBox.innerHTML = '<ion-icon name="ban-outline" style="width: 40px;"></ion-icon>';
  }
  conditionText.innerText = currentCondition ?? "N/A"
  const feelTemp2 = document.getElementById("feelTemp2");
  feelTemp2.innerText = String(feelsLikeTemp) + "°C";
  const avgHumid2 = document.getElementById("avgHumid2");
  avgHumid2.innerText = String(avgHumidity) + "%";
  const chanceRain = document.getElementById("chanceRain");
  chanceRain.innerText = String(chanceOfRain) + "%";
  const cloud2 = document.getElementById("cloud2");
  cloud2.innerText = String(cloudCover) + "%";
  const pascal = document.getElementById("pascal");
  pascal.innerText =  AirPressure * 100.0;
  const windDir2 = document.getElementById("windDir2");
  windDir2.innerText =  windDirection ?? "Null";
  if(dayOrNight == "Day time") {
    sideBar.style.background = "  radial-gradient(ellipse 140% 85% at 8% 82%,#ffb52e 0%,#d95b16 8%,#7a2d12 18%,#3b1710 30%,#1b0b09 45%,#09090b 65%,#020509 100%),linear-gradient(  to bottom,  #01040a 0%,  #020812 45%,  #030609 100%)";
  } else {
    sideBar.style.background = "radial-gradient(ellipse 140% 85% at 8% 82%,#8b91a0 0%,#555b68 7%,#303641 16%,#171c25 28%,#0b1018 43%,#04080e 65%,#010308 100%),linear-gradient(  to bottom,  #010207 0%,  #020611 45%,  #03070d 100%)";
  }
  const API_KEY = "e798e2ccd8608c3cc1004054bd36de81";
  const latitude = 9.02497;
  const longitude = 38.74689;
  const map = L.map("map").setView(
      [
          latitude,
          longitude
      ],
      6
  );
  const baseMap = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
        attribution:
        '&copy; OpenStreetMap &copy; CARTO'
    }
  );
  baseMap.addTo(map);
  const rainLayer = L.tileLayer(
  
      `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  
      {
          opacity: 0.6
      }
  
  );
  const temperatureLayer = L.tileLayer(
  
      `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  
      {
          opacity: 0.6
      }
  
  );
  const cloudLayer = L.tileLayer(
  
      `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  
      {
          opacity: 0.6
      }
  
  );
  const windLayer = L.tileLayer(
  
      `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
  
      {
          opacity: 0.6
      }
  
  );
  rainLayer.addTo(map);
  const marker = L.marker(
      [
          latitude,
          longitude
      ]
  )
  .addTo(map);
  marker.bindPopup(
    `
    <div class="weather-popup">
    
        <h3>WMS Station</h3>
    
        <div class="data">
            Temperature:
            <span>${Temp}°C</span>
        </div>
    
        <div class="data">
            Humidity:
            <span>${Humidity}%</span>
        </div>
    
        <div class="data">
            Pressure:
            <span>${AirPressure} hPa</span>
        </div>
        <div class="data">
            Wind:
            <span>${windKPH} KPH</span>
        </div>
    </div>
    `
);
  marker.openPopup();
  const weatherLayers = {
      "Rain": rainLayer,
      "Temperature": temperatureLayer,
      "Cloud": cloudLayer,
      "Wind": windLayer
  };
  L.control.layers(
      null,
      weatherLayers
  ).addTo(map);
  map.on(
      "click",
      function(e){
  
          console.log(
              "Latitude:",
              e.latlng.lat
          );
          console.log(
              "Longitude:",
              e.latlng.lng
          );
      }
  );
  const dayTimeOrNightTime = document.getElementById("dayTimeOrNightTime");
  const dayOrNightIcon = document.getElementById("dayOrNightIcon");
  dayTimeOrNightTime.innerText = dayOrNight ?? "N/A"
  dayTimeOrNightTime.style.fontWeight = 300;
  dayTimeOrNightTime.style.fontSize = "14px";
  if(dayOrNight == "Day time") {
    dayOrNightIcon.innerHTML = '<ion-icon name="sunny-outline"></ion-icon>';
  }
  else {
    dayOrNightIcon.innerHTML = '<ion-icon name="moon-outline"></ion-icon>';
  }
  const cloudCoverBox = document.getElementById("cloudCoverBox");
  cloudCoverBox.innerText = String(cloudCover) + "%" ?? "N/A";
  cloudCoverBox.style.fontWeight = 300;
  cloudCoverBox.style.fontSize = "14px";
  const feelsLikeTempBox = document.getElementById("feelsLikeTempBox");
  feelsLikeTempBox.innerText = String(feelsLikeTemp) + "°C" ?? "N/A";
  feelsLikeTempBox.style.fontWeight = 300;
  feelsLikeTempBox.style.fontSize = "14px";
  const windSpeedBox = document.getElementById("windSpeedBox");
  windSpeedBox.innerText = String(windKPH) + "KPH" ?? "N/A";
  windSpeedBox.style.fontWeight = 300;
  windSpeedBox.style.fontSize = "14px";
  const windDirectionBox = document.getElementById("windDirectionBox");
  windDirectionBox.innerText = String(windDirection) ?? "N/A";
  windDirectionBox.style.fontWeight = 300;
  windSpeedBox.style.fontSize = "14px";
  const currentConditionBox = document.getElementById("currentConditionBox");
  currentConditionBox.innerText = String(currentCondition) ?? "N/A";
  currentConditionBox.style.fontWeight = 300;
  currentConditionBox.style.fontSize = "14px";
  const sunIntensityBox = document.getElementById("sunIntensityBox");
  sunIntensityBox.innerText = String(SunIntensity) + "lux" ?? "N/A";
  sunIntensityBox.style.fontWeight = 300;
  sunIntensityBox.style.fontSize = "14px";
  const maxTempBox = document.getElementById("maxTempBox");
  maxTempBox.innerText = String(maxTemp) + "°C" ?? "N/A";
  maxTempBox.style.fontWeight = 300;
  maxTempBox.style.fontSize = "14px";
  const minTempBox = document.getElementById("minTempBox");
  minTempBox.innerText = String(minTemp) + "°C" ?? "N/A";
  minTempBox.style.fontWeight = 300;
  minTempBox.style.fontSize = "14px";
  const avgTempBox = document.getElementById("avgTempBox");
  avgTempBox.innerText = String(avgTemp) + "°C" ?? "N/A";
  avgTempBox.style.fontWeight = 300;
  avgTempBox.style.fontSize = "14px";
  const forecastConditionBox = document.getElementById("forecastConditionBox");
  forecastConditionBox.innerText = String(ForecatCondition) ?? "N/A";
  forecastConditionBox.style.fontWeight = 300;
  forecastConditionBox.style.fontSize = "14px";
  const chanceOfRainIcon = document.getElementById("chanceOfRainIcon");
  chanceOfRainIcon.innerText = String(chanceOfRain) + "%" ?? "N/A";
  chanceOfRainIcon.style.fontWeight = 300;
  chanceOfRainIcon.style.fontSize = "14px";
  const avgHumidityBox = document.getElementById("avgHumidityBox");
  avgHumidityBox.innerText = String(avgHumidity) + "%" ?? "N/A";
  avgHumidityBox.style.fontWeight = 300;
  avgHumidityBox.style.fontSize = "14px";
  const maxWindBox = document.getElementById("maxWindBox");
  maxWindBox.innerText = String(maxWindKph) + "KPH" ?? "N/A";
  maxWindBox.style.fontWeight = 300;
  maxWindBox.style.fontSize = "14px";
  const sunriseBox = document.getElementById("sunriseBox");
  sunriseBox.innerText = String(sunrise) ?? "N/A";
  sunriseBox.style.fontWeight = 300;
  sunriseBox.style.fontSize = "14px";
  const sunsetBox = document.getElementById("sunsetBox");
  sunsetBox.innerText = String(sunset) ?? "N/A";
  sunsetBox.style.fontWeight = 300;
  sunsetBox.style.fontSize = "14px";
  const moonriseBox = document.getElementById("moonriseBox");
  moonriseBox.innerText = String(moonrise) ?? "N/A";
  moonriseBox.style.fontWeight = 300;
  moonriseBox.style.fontSize = "14px";
  const moonsetBox = document.getElementById("moonsetBox");
  moonsetBox.innerText = String(moonset) ?? "N/A";
  moonsetBox.style.fontWeight = 300;
  moonsetBox.style.fontSize = "14px";
  const moonIlluminationBox = document.getElementById("moonIlluminationBox");
  moonIlluminationBox.innerText = String(moonIllumination) + "%" ?? "N/A";
  moonIlluminationBox.style.fontWeight = 300;
  moonIlluminationBox.style.fontSize = "14px";
  const tempBox = document.getElementById("tempBox");
  tempBox.innerText = String(Temp) + "°C" ?? "N/A";
  tempBox.style.fontWeight = 300;
  tempBox.style.fontSize = "14px";
  const humidityBox = document.getElementById("humidityBox");
  humidityBox.innerText = String(Humidity) + "%" ?? "N/A";
  humidityBox.style.fontWeight = 300;
  humidityBox.style.fontSize = "14px";
  const ldrBox = document.getElementById("ldrBox");
  ldrBox.innerText = String(LDRValue) + "%" ?? "N/A";
  ldrBox.style.fontWeight = 300;
  ldrBox.style.fontSize = "14px";
  const rainBox = document.getElementById("rainBox");
  rainBox.innerText = String(RainValue) + "%" ?? "N/A";
  rainBox.style.fontWeight = 300;
  rainBox.style.fontSize = "14px";
  const airPressureBox = document.getElementById("airPressureBox");
  airPressureBox.innerText = String(AirPressure) + "HPA" ?? "N/A";
  airPressureBox.style.fontWeight = 300;
  airPressureBox.style.fontSize = "14px";

  const altitudeBox = document.getElementById("altitudeBox");
  altitudeBox.innerText = String(Altitude) ?? "N/A";
  altitudeBox.style.fontWeight = 300;
  altitudeBox.style.fontSize = "14px";
  const alertBox = document.getElementById("alertBox");
  alertBox.innerText = String(Alert) ?? "N/A";
  alertBox.style.fontWeight = 300;
  alertBox.style.fontSize = "14px";
  const tbody = document.getElementById("historyTableBody");
  tbody.innerHTML = "";

  res.rows.forEach(row => {
    const tr = document.createElement("tr");

    const fields = [
      { label: "WMS Last Update", value: row.WMSLastUpdate },
      { label: "API Last Updated", value: row.APILastUpdated },
      { label: "Day/Night", value: row.dayOrNight },
      { label: "Cloud Cover", value: row.cloudCover },
      { label: "Feels Like Temp", value: row.feelsLikeTemp },
      { label: "Wind (KPH)", value: row.windKPH },
      { label: "Wind Direction", value: row.windDirection },
      { label: "Condition", value: row.currentCondition },
      { label: "Sun Intensity", value: row.SunIntensity },
      { label: "Max Temp", value: row.maxTemp },
      { label: "Min Temp", value: row.minTemp },
      { label: "Avg Temp", value: row.avgTemp },
      { label: "Forecast Condition", value: row.ForecatCondition },
      { label: "Chance of Rain", value: row.chanceOfRain },
      { label: "Avg Humidity", value: row.avgHumidity },
      { label: "Max Wind (KPH)", value: row.maxWindKph },
      { label: "Sunrise", value: row.sunrise },
      { label: "Sunset", value: row.sunset },
      { label: "Moonrise", value: row.moonrise },
      { label: "Moonset", value: row.moonset },
      { label: "Moon Illumination", value: row.moonIllumination },
      { label: "Temp", value: row.Temp },
      { label: "Humidity", value: row.Humidity },
      { label: "LDR Value", value: row.LDRValue },
      { label: "Rain Value", value: row.RainValue },
      { label: "Air Pressure", value: row.AirPressure },
      { label: "Altitude", value: row.Altitude },
      { label: "Alert", value: row.Alert }
    ];
    
    fields.forEach(field => {
      const td = document.createElement("td");
      td.textContent = field.value ?? "N/A";
      td.setAttribute("data-label", field.label);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
  const forecastTableBody = document.getElementById("weatherTableBody");
    forecastTableBody.innerHTML = "";
    
    const columns = [
      { key: "time",        label: "Time",              class: "timeCell" },
      { key: "dayOrNight",  label: "Day/Night",         class: "" },
      { key: "condition",   label: "Condition",         class: "" },
      { key: "temp",        label: "Temperature (°C)",  class: "numeric temp" },
      { key: "feels",       label: "Feels Like (°C)",   class: "numeric feels" },
      { key: "humidity",    label: "Humidity (%)",      class: "numeric humidity" },
      { key: "rainChance",  label: "Chance of Rain (%)",class: "numeric rainChance" },
      { key: "cloud",       label: "Cloud (%)",         class: "numeric cloud" },
      { key: "wind",        label: "Wind (kph)",        class: "numeric wind" },
      { key: "direction",   label: "Direction",         class: "" }
    ];
    
    hourlyTime.forEach((time, i) => {
      const tr = document.createElement("tr");
    
      const rowData = {
        time: time,
        dayOrNight: hourlyDayOrNight[i] === 1 ? "Day" : hourlyDayOrNight[i] === 0 ? "Night" : "N/A",
        condition: hourlyCondition[i],
        temp: hourlyTemps[i],
        feels: hourlyfeelslikeTemp[i],
        humidity: hourlyhumidity[i],
        rainChance: hourlyChanceOfRain[i],
        cloud: hourlycloud[i],
        wind: hourlywindKPH[i],
        direction: hourlyDirection[i]
      };
    
      columns.forEach(col => {
        const td = document.createElement("td");
        td.textContent = rowData[col.key] ?? "N/A";
        td.setAttribute("data-label", col.label); // fixes mobile card labels
        if (col.class) td.className = col.class;  // fixes color/alignment styling
        tr.appendChild(td);
      });
    
      forecastTableBody.appendChild(tr);
    });
    loader.style.display = "none";
    
};
appWriteDataProcess();
