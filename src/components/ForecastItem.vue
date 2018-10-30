<template lang="html">
    <div :class="'items item'+date" v-if="Object.keys(day).length > 2" @click="selectDay">
      <div class="date text-center">
        <span class="d-block">{{date_parse.toLocaleString("ru", {weekday: 'long'})}}</span>
        <strong>{{date_parse.toLocaleString("ru", {day: 'numeric', month: 'long'})}}</strong>
      </div>
      <img class="wx-icon d-block mx-auto" :src="`http://openweathermap.org/img/w/${temp.icon}.png`" alt="forecast-item">
      <div class="row">
        <div class="col-6 p-0 d-block text-center">
          <span class="d-block pb-1">мин.</span>
          <strong>{{temp.temp_min}}<sup>0</sup></strong>
        </div>
        <div class="col-6 p-0 d-block text-center">
          <span class="d-block pb-1">макс.</span>
          <strong>{{temp.temp_max}}<sup>0</sup></strong>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'ForecastItem',
  props: {
    day: Object,
    date: String,
  },
  methods: {
    selectDay(){
      this.$store.dispatch('setActiveDay', this.date);
    }
  },
  created(){
    this.$store.watch(
      (state) => {
        return this.activeDay
      },
      (day) => {
        let item;
        if (day === this.date) {
          item = document.querySelector(`.item${this.date}`);
          item.classList.add('active');
        } else {
          item = document.querySelector(`.item${this.date}`);
          if (item && item.classList.contains('active')) item.classList.remove('active');
        }
      },
    );
  },
  computed: {
    ...mapGetters([
      'activeDay',
    ]),
    temp(){
      let temp_min = 60;
      let temp_max = -60;
      let icon = '';
      Object.values(this.day).map((item) => {
        if (item.main.temp_max > temp_max) {temp_max = item.main.temp_max; icon = item.weather[0].icon};
        if (item.main.temp_min < temp_min) temp_min = item.main.temp_min;
      });
      return {
        temp_min: Math.round(temp_min),
        temp_max: Math.round(temp_max),
        icon: icon,
      };
    },
    date_parse(){
      const date = this.date.split('-').map((item) => {
        return parseInt(item);
      });
      return new Date(date[0], date[1], date[2]);
    }
  }
}
</script>

<style lang="css">
.date{
  font-size: 1.1rem;
}
.wx-icon{
  margin-top: -0.3em;
  margin-bottom: -0.5em;
  transform: scale(1.3);
}
.items{
    cursor: pointer;
    transition: .3s;
    padding-bottom: 1em;
}
.items:hover{
  background-color: rgba(255,255,255,.5);
  color: rgba(0,0,0,.9);
}
.items div{
  background-color: transparent!important;
}
.items div:hover{
  background-color: transparent;
}
.items .row .col-6{
  line-height: 1;
}
.items.active {
    background-color: rgba(255,255,255,.4);
}
</style>
