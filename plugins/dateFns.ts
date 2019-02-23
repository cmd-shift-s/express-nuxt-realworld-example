import Vue from 'vue'
import dateFns from 'date-fns'


export default () => {
  Vue.filter('date', (date: string) => {
    if (!date) return ''
    return dateFns.format(date, 'MMMM D, YYYY')
  })
}
