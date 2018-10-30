<template lang="html">
  <div class="forecast_hours row flex-nowrap">
    <div class="col hours designation">
      <p>Время</p>
      <img class="icons"></img>
      <p class="darkness">Температура, °C</p>
      <p>Давление, мм</p>
      <p class="darkness">Влажность, %</p>
      <p>Ветер, м/сек</p>
    </div>
    <div class="col hours" v-for="hour in hours">
      <p>{{toDate(hour.dt)}}</p>
      <img class="icons mx-auto" :src="`http://openweathermap.org/img/w/${hour.weather[0].icon}.png`" alt="">
      <p class="darkness">{{Math.round(hour.main.temp)}}<sup>0</sup></p>
      <p>{{pressure(hour.main.pressure)}}</p>
      <p class="darkness">{{hour.main.humidity}}</p>
      <p>{{Math.round(hour.wind.speed)}}</p>
    </div>
  </div>
</template>

<script>
import utils from '../utils';

export default {
  name: 'ForecastHours',
  props: {
    hours: Array
  },
  created(){
    this.pressure = utils.pressure;
    this.toDate = utils.toDate;
  },
}
</script>

<style lang="css">
.forecast_hours p{
  margin: 0;
  white-space: nowrap;
}
.icons{
  display: block;
  margin-top: -0.6rem;
  margin-bottom: -0.6rem;
  min-height: 50px;
}
.row.forecast_hours{
  background: inherit;
  box-shadow: 5px 5px 40px 10px rgba(0,0,0,0.5);
  overflow: hidden;
}
.forecast_hours::before{
  content: '';
  width: 105%;
  height: 105%;
  background: inherit;
  position: absolute;
  left: -2.5%;
  top: -2.5%;
  box-shadow: inset 0 0 0 1000px rgba(200,255,255,0.3);
  filter: blur(5px);
}
.col.hours{
  padding: 0;
  text-align: center;
  font-size:11px;
  border: .4px solid rgba(0, 0, 0, 0.5);
  border-right: none;
  border-top: none;
  background: rgba(255,255,255,0.4);
  transition: .4s;
}
.col.hours.designation{
  padding: 0 .2em;
}
.darkness{
  background-color: rgba(0,0,0,0.08);
}
</style>
