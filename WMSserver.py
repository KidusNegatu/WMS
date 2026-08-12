from appwrite.client import Client
from appwrite.id import ID
from appwrite.services.tables_db import TablesDB
from requests import get
from datetime import datetime
import time
import json
import sys
from requests import get
from serial import Serial
from serial import SerialException

class WMSDataProcess():
    def __init__(self,latitude, longitude):
        self.latitude = latitude
        self.longitude = longitude
        self.wholeData = {}
        self.failed = False
        self.currentUrl = f"https://api.weatherapi.com/v1/current.json?key=e24ce09a5d8846b2b3c190302260508&q={latitude},{longitude}"
        self.forecastUrl = f"https://api.weatherapi.com/v1/forecast.json?key=e24ce09a5d8846b2b3c190302260508&q={latitude},{longitude}"
        self.user = Client()
        self.user.set_endpoint("https://nyc.cloud.appwrite.io/v1")
        self.user.set_key("standard_8d89de02649192f6fe73af233f026cdf01d2ff32c0988756d068937bda334fa477c6c887460eebff4bb6a85753a8761ff8865d43444da4021ba7f96ea5a7496d835d9a715631838c37cb2e32f8db05a0711eec55ca0cc59d42de7cd002568556883635518bd17e7232e782b1df5e673f82d140f9d9171d9cff3836e2cc469a99")
        self.user.set_project("42914291")
        self.wmsTable = TablesDB(self.user)
        try:
            self.com = Serial("COM6", 9600, timeout=2)
        except SerialException:
            print("WMS IS NOT CONNECTED!!")
            self.failed = True
            print("Exiting program...")
            sys.exit()
        time.sleep(2)
    def serialCom(self):
        try:
            self.com.reset_input_buffer()
            print("Serial communicating...")
            maxSerialAttempt = 10
            for attempt in range(maxSerialAttempt):
                self.serialData = self.com.readline().decode('utf-8', errors='ignore').strip()
                self.now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                self.wholeData.update({"WMSLastUpdate": str(self.now)})
                if not self.serialData:
                    continue
                try:
                    self.parsedSerialData = json.loads(self.serialData)
                    if isinstance(self.parsedSerialData, dict):
                        self.wholeData.update(self.parsedSerialData)
                        print("Got serial data.")
                        print(self.parsedSerialData)
                        return
                except json.JSONDecodeError as jsonErr:
                    print(f"Serial communication attempt: {attempt+1} outof {maxSerialAttempt}")
                    continue
            print("WMS IS NOT VALID AFTER MULTIPLE ATTEMPTS!!")
            self.failed = True
        except SerialException as serialErr:
            print("WMS IS NOT CONNECTED!!", serialErr)
            self.failed = True
        except KeyboardInterrupt:
            print("Leaving program...")
            self.failed = True
        except Exception as err:
            print("SOMETHING WENT WRONG!!", err)
            self.failed = True

    def currentWeatherAPI(self):
        print("Getting data from WeatherAPI current...")
        try:
            apiRes = get(self.currentUrl)
            parsedApiRes = apiRes.json()
            currentData = {}
            lastUpdate = parsedApiRes["current"]["last_updated"]
            currentData.update({"APILastUpdated": str(lastUpdate)})
            dayOrNight = parsedApiRes["current"]["is_day"]
            diurnalCycle = None
            if dayOrNight == 0:
                diurnalCycle = "Night time"
            else:
                diurnalCycle = "Day time"
            currentData.update({"dayOrNight": diurnalCycle})
            cloudCover = parsedApiRes["current"]["cloud"]
            currentData.update({"cloudCover": cloudCover})
            feelsLikeTemp = parsedApiRes["current"]["feelslike_c"]
            currentData.update({"feelsLikeTemp": feelsLikeTemp})
            windkph = parsedApiRes["current"]["wind_kph"]
            currentData.update({"windKPH": windkph})
            windDirection = parsedApiRes["current"]["wind_dir"]
            currentData.update({"windDirection": windDirection})
            condition = parsedApiRes["current"]["condition"]["text"]
            currentData.update({"currentCondition": condition})
            uv = parsedApiRes["current"]["uv"]
            currentData.update({"SunIntensity": round((uv/11)*100.0, 1)})
            icon = parsedApiRes["current"]["condition"]["icon"]
            currentData.update({"currentIcon": icon})
            self.wholeData.update(currentData)
            print(self.wholeData)
        except Exception as err:
            print("SOMETHING WENT WRONG WHILE GETTING DATA FROM WEATHERAPI CURRENT!!", err)
            self.failed = True

    def forecastWeatherAPI(self):
        print("Reading weatherAPI forecast...")
        forecastRespond = get(self.forecastUrl)
        forecastData = forecastRespond.json()
        forecastDay = forecastData["forecast"]["forecastday"]
        for data in forecastDay:
            self.forecast = {
                "maxTemp": data["day"]["maxtemp_c"],
                "minTemp": data["day"]["mintemp_c"],
                "avgTemp": data["day"]["avgtemp_c"],
                "ForecatCondition": data["day"]["condition"]["text"],
                "ForecastConditionIcon": data["day"]["condition"]["icon"],
                "chanceOfRain": data["day"]["daily_chance_of_rain"],
                "avgHumidity": data["day"]["avghumidity"],
                "maxWindKph": data["day"]["maxwind_kph"],
                "sunrise": data["astro"]["sunrise"],
                "sunset": data["astro"]["sunset"],
                "moonrise": data["astro"]["moonrise"],
                "moonset": data["astro"]["moonset"],
                "moonIllumination": data["astro"]["moon_illumination"]
            }
        self.wholeData.update(self.forecast)
        self.hours = forecastData["forecast"]["forecastday"][0]["hour"]
        hourlyTime = []
        hourlyTemps = []
        hourlyDayOrNight = []
        hourlywindKPH = []
        hourlyDirection = []
        hourlyhumidity = []
        hourlycloud = []
        hourlyfeelslikeTemp = []
        hourlyChanceOfRain = []
        hourlyCondition = []
        hourlyConditionIcon = []
        for hour in self.hours:
            hourlyTime.append(hour["time"])
            hourlyTemps.append(hour["temp_c"])
            hourlyDayOrNight.append(hour["is_day"])
            hourlywindKPH.append(hour["wind_kph"])
            hourlyDirection.append(hour["wind_dir"])
            hourlyhumidity.append(hour["humidity"])
            hourlycloud.append(hour["cloud"])
            hourlyfeelslikeTemp.append(hour["feelslike_c"])
            hourlyChanceOfRain.append(hour["chance_of_rain"])
            hourlyCondition.append(hour["condition"]["text"])
            hourlyConditionIcon.append(hour["condition"]["icon"])
        self.hourlyForecast = {
                        "hourlyTime": hourlyTime,
                        "hourlyTemps": hourlyTemps,
                        "hourlyDayOrNight": hourlyDayOrNight,
                        "hourlywindKPH": hourlywindKPH,
                        "hourlyDirection": hourlyDirection,
                        "hourlyhumidity": hourlyhumidity,
                        "hourlycloud": hourlycloud,
                        "hourlyfeelslikeTemp": hourlyfeelslikeTemp,
                        "hourlyChanceOfRain": hourlyChanceOfRain,
                        "hourlyCondition": hourlyCondition,
                        "hourlyConditionIcon": hourlyConditionIcon
                    }
        self.wholeData.update(self.hourlyForecast)
        print("Done reading weatherAPI forcast.")
    def saveDataToServer(self):
        print("Saving data to AppWrite...")
        try:
            rowData = dict(self.wholeData)
            self.wmsTable.create_row(
                database_id="6a73a050001026525006",
                table_id="wms_server_database",
                row_id=ID.unique(),
                data=rowData
            )
        except Exception as err:
            print("SOMETHING WENT WRONG WHILE UPLOADING DATA TO APPWRITE!!", err)
            self.failed = True
        print("Done saving data to AppWrite.")

if __name__ == "__main__":
    try:
        lat = float(input("Latitude: "))
    except Exception:
        print("INVALID INPUT!! INPUT MUST BE FLOAT.")
        print("Exiting program...")
        sys.exit(1)
    try:
        lon = float(input("Longitude: "))
    except Exception:
        print("INVALID INPUT!! INPUT MUST BE FLOAT.")
        print("Exiting program...")
        sys.exit(1)
    wms = WMSDataProcess(lat, lon)
    while True:
        wms.wholeData = {}
        wms.failed = False
        wms.serialCom()
        if wms.failed:
            sys.exit(1)
        wms.currentWeatherAPI()
        if wms.failed:
            sys.exit(1)
        wms.forecastWeatherAPI()
        if wms.failed:
            sys.exit(1)
        wms.saveDataToServer()
        if wms.failed:
            sys.exit(1)
        time.sleep(2)
else:
    print("WMSscript.py MUST RUN AS THE MAIN FILE!!")
