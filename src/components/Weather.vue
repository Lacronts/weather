<template lang="html">
  <section class="content">
    <div class="row wx-now">
      <div class="col-6 now mt-2">
        <div v-if="!loading" class="wx-info text-center">
          <span class="city">{{selectedCity.ru}}</span>
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
                 <span class="d-block">{{pressure(forecastPressure)}} мм рт.ст</span>
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
            <div class="spinner-16"></div>
          </div>
        </div>
      </div>
      <Forecast />
      <div class="cities">
        <ul class="wx-ul">
          <li v-for="(city, index) in cities" :key="index" class="wx-li" @click="selectCity(city)">
            <span class="wx-city">{{city.ru}}</span>
          </li>
        </ul>
      </div>
  </section>
</template>

<script>
import Forecast from './Forecast.vue';
import { mapGetters } from 'vuex';
import utils from '../utils';

export default {
  name: 'Weather',
  components: {
    Forecast,
  },
  created(){
    this.$store.dispatch('setInitCity');
    this.$store.dispatch('fetchData');
    this.pressure = utils.pressure;
    this.toDate = utils.toDate;
  },
  computed: {
    ...mapGetters([
      'loading',
      'weather',
      'forecast',
      'cities',
      'selectedCity',
    ]),
    forecastPressure(){
      const day = Object.keys(this.$store.state.dailyForecast)[0];
      const hour = Object.keys(this.$store.state.dailyForecast[day])[0];
      return this.$store.state.dailyForecast[day][hour].main.pressure;
    }
  },
  methods: {
    selectCity(city){
      this.$store.dispatch('selectCity', city);
    },
  }
}
</script>

<style lang="css">
.content{
  height: 100vh;
  min-width: 490px;
  margin: 0;
}
.content .wx-now{
  background: inherit;
}
.content .row{
  margin: 0;
  position: relative;
  justify-content: center;
  align-items: center;
}
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
  min-width: 490px;
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 40px;
  background: inherit;
  overflow: hidden;
  box-shadow: 5px 5px 40px 10px rgba(0,0,0,0.5);
}
.cities::before{
  content: '';
  width: 100vw;
  height: 60px;
  background: inherit;
  position: absolute;
  top: -10px;
  box-shadow: inset 0 0 0 100px rgba(200,255,255,0.3);
  filter: blur(8px);
}
.cities .wx-ul{
  margin: 0;
  padding: 0;
  display: flex;
  position: relative;
  justify-content: space-around;

}
.cities .wx-ul .wx-li{
  cursor: pointer;
  list-style: none;
  font-size: 1.5em;
}
.wx-city{
  padding: 1em;
  cursor: pointer;
  transition: all .7s;
  color: rgba(10,10,10,.5);
}
.wx-city:hover{
  background-color: rgba(255,255,255,.3);
  border-radius: 80px;
  color: rgba(0,0,0,.9);
}
.now{
   min-width: 360px;
   max-width: 500px;
   padding: 1em 0 1em 0;
   background: inherit;
   overflow: hidden;
   border-radius: 15px;
   box-shadow: 5px 5px 40px 10px rgba(0,0,0,0.5);
  }
.now:before {
   content: '';
   width: 105%;
   height: 105%;
   background: inherit;
   position: absolute;
   left: -2.5%;
   top: -2.5%;
   box-shadow: inset 0 0 0 1000px rgba(200,255,255,0.3);
   filter: blur(10px);
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
  .spinner-16 {
      font-size: 10px;
      width: 10em;
      height: 10em;
      position: relative;
  }
  .spinner-16::before,
  .spinner-16::after {
      content: "";
      background-color: transparent;
      position: absolute;
      left: 4.5em;
      top: 4.5em;
      width: 1em;
      height: 1em;
      border-radius: 50%;
      box-sizing: border-box;
      border: .2em solid black;
      animation: spinner-16 1s infinite cubic-bezier(0, 0.25, 0.75, 1);
  }
  .spinner-16::before {
      animation-delay: 0s;
  }
  .spinner-16::after {
      animation-delay: -.5s;
  }
  @keyframes spinner-16 {
      0% {
          opacity: 1;
          transform: scale(0);
      }
      100% {
          opacity: 0;
          transform: scale(10);
      }
  }
</style>
