import Vue from 'vue'
import dateFns from 'date-fns'


export default () => {
  Vue.filter('date', (date: string, format: string = 'MMMM D, YYYY') => {
    if (!date) return ''
    return dateFns.format(date, format)
  })
}
