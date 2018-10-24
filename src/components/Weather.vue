<template lang="html">
  <section class="content" style="height:100%">
    <div class="now">
      <div v-if="!loading" class="wx-info text-center">
        <span class="city">{{activeCity.toUpperCase()}}</span>
        <span class="lower">Погода по состоянию на {{toDate((new Date())/1000)}}</span>
        <div class="temp">
          <img :src="'//openweathermap.org/img/w/'+weather.weather[0].icon+'.png'" alt="">
          <span>{{weather.main.temp}}<sup>0</sup>C</span>
        </div>
        <div class="wx-row">
          <div class="wx-col">
              <img class="icon" src="/icons/wind.svg" alt="">
              <span>Ветер</span>
              <span class="d-block">{{weather.wind.speed}} м/с</span>
          </div>
          <div class="wx-col">
              <img class="icon" src="/icons/pressure.png" alt="">
               <span>Давление</span>
               <span class="d-block">{{pressure(weather.main.pressure)}} мм рт.ст</span>
          </div>
          <div class="wx-col">
              <img class="icon" src="/icons/humidity.png" alt="">
               <span class="wx-label">Влажность</span>
               <span class="d-block">{{weather.main.humidity}} %</span>
          </div>
        </div>
        <div class="wx-row mt-3">
            <div class="wx-col">
              <img class="icon" src="/icons/sunrise.png" alt="">
              <span>Восход</span>
              <span class="d-block">{{toDate(weather.sys.sunrise)}}</span>
            </div>
            <div class="wx-col">
              <img class="icon" src="/icons/sunset.png" alt="">
              <span>Закат</span>
              <span class="d-block">{{toDate(weather.sys.sunset)}}</span>
            </div>
            <div class="wx-col">
              <img class="icon" src="/icons/map.png" alt="">
              <a :href="'https://www.windy.com/ru/-%D0%9E%D0%B1%D0%BB%D0%B0%D0%BA%D0%B0-clouds?clouds,'+weather.coord.lat+','+weather.coord.lon" target="_blank" rel="noreferrer noopener">
                <span>На карте?</span>
                <span class="d-block">{{[weather.coord.lat, weather.coord.lon]}}</span>
               </a>
             </div>
          </div>
        </div>
        <div v-else class="notLoading">
          <i class="spinner fas fa-spinner fa-5x"></i>
        </div>
      </div>
      <div class="cities">
        <ul class="wx-ul">
          <li v-for="(city, index) in cities" :key="index" class="wx-li" @click="selectCity(city)">
            {{city}}
          </li>
        </ul>
      </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Weather',
  data(){
    return {
      cities: ['Irkutsk','Chita','Novosibirsk'],
      activeCity:'',
      weather:'',
      backgroundClass:'',
      loading:false,
    }
  },
  created(){
    this.activeCity = localStorage.getItem('city') || 'Chita';
    this.getWeather(this.activeCity);
  },
  methods:{
    pressure(hpa){
      return (hpa / 1.333).toFixed(0);
    },
    toDate(date){
      let newDate = new Date(date*1000);
      return [newDate.getHours(), newDate.getMinutes()].map((item) => item > 9 ? item : '0'+item).join(':');
    },
    setBackground(){
      let page = document.querySelector('.content');
      if (this.backgroundClass !== '') page.classList.remove(this.backgroundClass);
      if (+((new Date().valueOf())/1000) < this.weather.sys.sunset){
        if (this.weather.weather[0].main === 'Clear') this.backgroundClass = 'clearSky';
        else if (this.weather.weather[0].main === 'Clouds') this.backgroundClass = 'cloud';
        else if (this.weather.weather[0].main === 'Rain') this.backgroundClass = 'rain';
        else if (this.weather.weather[0].main === 'Snow') this.backgroundClass = 'snow';
    } else{
        if (this.weather.weather[0].main === 'Clear') this.backgroundClass = 'clearSkyNight';
        else if (this.weather.weather[0].main === 'Clouds') this.backgroundClass = 'cloudNight';
        else if (this.weather.weather[0].main === 'Rain') this.backgroundClass = 'rainNight';
        else if (this.weather.weather[0].main === 'Snow') this.backgroundClass = 'snowNight';
    }
      page.classList.add(this.backgroundClass);
    },
    selectCity(city){
      this.activeCity = city;
      localStorage.setItem('city', city);
      this.getWeather(city)
    },
    getWeather(city){
      city = city || 'Chita';
      this.loading = true;
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=dc36d8a3f83a8df61146aa8e85746991&units=metric`)
        .then((response) => {
          console.log(response.data)
          this.weather = response.data
          this.loading = false;
          this.setBackground();
      });
    },
    getForecast(city){
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=dc36d8a3f83a8df61146aa8e85746991`)
        .then((response) => {
          console.log(response)
      })
    }
  },
}
</script>

<style lang="css">
.city{
  position: relative;
  display: block;
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
}
.lower{
  display: block;
  margin-top: -5px;
  margin-bottom: 20px;
  position: relative;
  font-size: 0.7rem;
}
.wx-row{
  display: flex;
  position: relative;
}
.wx-col{
  flex: 0 1 33.3333%;
}
.wx-col a{
  color: #212529;
}
.wx-col a:hover{
  color: green;
}
.icon{
  padding-right: 5px;
  width: 25px;
}
.temp{
  margin-left: -1.6em;
  margin-bottom: 1em;
  font-family: 'Roboto', sans-serif;
  font-size: 1.6em;
  transform: scale(1.4);
}
.cities{
  position: absolute;
  bottom: 20px;
  width: 100%;
  background: inherit;
  overflow: hidden;
  box-shadow: 5px 5px 40px 10px rgba(0,0,0,0.5);
}
.cities::before{
  content: '';
  width: 100%;
  height: 200%;
  background: inherit;
  position: absolute;
  left: -25px;
  top: -25px;
  box-shadow: inset 0 0 0 1000px rgba(200,255,255,0.3);
  filter: blur(15px);
}
.cities .wx-ul{
  margin: 0;
  display: flex;
  position: relative;
  justify-content: space-around;

}
.cities .wx-ul .wx-li{
  cursor: pointer;
  list-style: none;
  font-size: 2em;
}
.now{
   background: inherit;
   width: 400px;
   height: 350px;
   top:10px;
   left:50%;
   margin-left: -200px;
   position: relative;
   overflow: hidden;
   border-radius: 8%;
   box-shadow: 5px 5px 40px 10px rgba(0,0,0,0.5);
  }
.now:before{
   content: '';
   width: 450px;
   height: 400px;
   background: inherit;
   position: absolute;
   left: -25px;
   top: -25px;
   box-shadow: inset 0 0 0 1000px rgba(200,255,255,0.3);
   filter: blur(15px);
  }
  .now .notLoading{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .now .notLoading .spinner{
    animation: spinner 2s infinite;
  }
  .rain{
    background: url('/images/rain.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  .snow{
    background: url('/images/snow.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  .clearSky{
    background: url('/images/clearSky.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  .cloud{
    background: url('/images/clouds.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  .rainNight{
    background: url('/images/rainNight.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  .snowNight{
    background: url('/images/snowNight.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  .clearSkyNight{
    background: url('/images/clearSkyNight.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  .cloudNight{
    background: url('/images/cloudNight.jpg');
    background-position: center center;
    background-size: cover;
    background-attachment: fixed;
  }
  @keyframes spinner {
      from{
        transform: rotate(0);
      }
      to{
        transform: rotate(360deg);
      }
  }
</style>
