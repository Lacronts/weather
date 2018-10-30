import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  weather: {},
  forecast: {},
  loading: false,
  selectedCity: {},
  cities: [
    {value: 'Irkutsk', ru: 'Иркутск'},
    {value: 'Chita', ru: 'Чита'},
    {value: 'Novosibirsk', ru: 'Новосибирск'}
  ],
  backgroundClass:'',
  activeDay: '',
  dailyForecast: {},
};

const getters = {
  weather: state => state.weather,
  forecast: state => state.forecast,
  loading: state => state.loading,
  cities: state => state.cities,
  selectedCity: state => state.selectedCity,
  activeDay: state => state.activeDay,
  dailyForecast: state => state.dailyForecast,
  hoursForecast: state => {
    let hoursForecast = [];
    Object.keys(state.dailyForecast).map((day) => {
        if (day === state.activeDay) {
          Object.keys(state.dailyForecast[day]).map((item) => {
            hoursForecast.push(state.dailyForecast[day][item])
          })
        };
    })
    return hoursForecast;
  }
};

const mutations = {
  SET_LOADING(state, payload) {
    state.loading = payload;
  },
  UPDATE_WEATHER(state, payload) {
    state.weather = payload;
  },
  UPDATE_FORECAST(state, payload) {
    state.forecast = payload;
  },
  SET_ACTIVE_CITY(state, payload) {
    state.selectedCity = payload;
  },
  SET_BACKGROUND(state, payload) {
    state.backgroundClass = payload;
  },
  SET_ACTIVE_DAY(state, payload) {
    state.activeDay = payload;
  },
  UPDATE_DAILY_FORECAST(state, payload) {
    state.dailyForecast = payload;
  }
};

const actions = {
  async fetchData({commit, dispatch, state}, city){
    commit('SET_ACTIVE_DAY', '');
    commit('SET_LOADING', true);
    const weather = dispatch('getWeather', city);
    await dispatch('getForecast', city);
    await weather;
    commit('SET_LOADING', false);
  },
  getWeather({commit, dispatch, state}, city){
    city = city || state.selectedCity;
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&APPID=dc36d8a3f83a8df61146aa8e85746991&units=metric`)
      .then((response) => {
        commit('UPDATE_WEATHER', response.data);
        dispatch('setBackground');
    });
  },
  getForecast({commit, dispatch, state}, city){
    city = city || state.selectedCity;
    return axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city.value}&APPID=dc36d8a3f83a8df61146aa8e85746991&units=metric`)
      .then((response) => {
        commit('UPDATE_FORECAST', response.data);
        dispatch('getDailyForecast');
    })
  },
  selectCity({commit, dispatch}, city){
    commit('SET_ACTIVE_CITY', city);
    localStorage.setItem('city', JSON.stringify(city));
    dispatch('fetchData', city);
  },
  setBackground({commit, state}){
    let page = document.querySelector('.content');
    if (state.backgroundClass !== '') page.classList.remove(state.backgroundClass);
    if (+((new Date().valueOf())/1000) < state.weather.sys.sunset){
      if (state.weather.weather[0].main === 'Clear') commit('SET_BACKGROUND', 'clearSky');
      else if (state.weather.weather[0].main === 'Clouds') commit('SET_BACKGROUND', 'cloud');
      else if (state.weather.weather[0].main === 'Rain') commit('SET_BACKGROUND', 'rain');
      else if (state.weather.weather[0].main === 'Snow') commit('SET_BACKGROUND', 'snow');
  } else{
      if (state.weather.weather[0].main === 'Clear') commit('SET_BACKGROUND', 'clearSkyNight');
      else if (state.weather.weather[0].main === 'Clouds') commit('SET_BACKGROUND', 'cloudNight');
      else if (state.weather.weather[0].main === 'Rain') commit('SET_BACKGROUND', 'rainNight');
      else if (state.weather.weather[0].main === 'Snow') commit('SET_BACKGROUND', 'snowNight');
  }
    page.classList.add(state.backgroundClass);
  },
  setInitCity({commit}){
    const city = JSON.parse(localStorage.getItem('city')) || {value: 'Chita', ru: 'Чита'};
    commit('SET_ACTIVE_CITY', city);
  },
  setActiveDay({commit}, day){
    commit('SET_ACTIVE_DAY', day);
  },
  getDailyForecast({commit}){
      let dailyForecast = {};
      if (Object.keys(state.forecast).length) {state.forecast.list.map(item => {
        const date = `${(new Date(item.dt*1000)).getFullYear()}-${(new Date(item.dt*1000)).getMonth()}-${(new Date(item.dt*1000)).getDate()}`;
        if (!(date in dailyForecast)) {
          dailyForecast[date] = {};
          dailyForecast[date][item.dt] = item;
        }
        else {
          dailyForecast[date][item.dt] = item;
          }
        });
      }
      commit('UPDATE_DAILY_FORECAST',dailyForecast);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
