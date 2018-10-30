export default {
  pressure(hpa){
    return (hpa / 1.333).toFixed(0);
  },
  toDate(date){
    let newDate = new Date(date*1000);
    return [newDate.getHours(), newDate.getMinutes()].map((item) => item > 9 ? item : '0'+item).join(':');
  },
};
