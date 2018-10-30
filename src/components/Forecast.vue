<template lang="html">
  <div class="container">
    <div v-if="!loading" class="mt-4 row forecast flex-nowrap">
      <forecast-item v-for="day, index in dailyForecast" class="col" :day="day" :key="index" :date="index">
      </forecast-item>
    </div>
    <forecast-hours
      v-if="hoursForecast.length"
      :hours="hoursForecast"
      >
    </forecast-hours>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ForecastItem from './ForecastItem.vue';
import ForecastHours from './ForecastHours.vue';

export default {
  name: "Forecast",
  components: {
    ForecastItem,
    ForecastHours,
  },
  computed: {
    ...mapGetters([
      'forecast',
      'loading',
      'dailyForecast',
      'hoursForecast',
    ]),
  },
}
</script>

<style lang="css">
.container{
  background: inherit;
  padding: 0;
  max-width: 900px;
}
.wx-cols{
  position: relative;
}
.forecast{
  background: inherit;
  overflow: hidden;
}
.forecast::before{
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
</style>
