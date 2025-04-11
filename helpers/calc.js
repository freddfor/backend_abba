const Enumerators = require('../enumerators')
const moment = require('moment')
const dateFormat = "YYYY-MM-DD"
const calculateNextMaitenanceDate = (date, frequency, periodicity) => {
  
  if (periodicity == Enumerators.periodicity.days) {
    return moment(date, dateFormat).add(frequency, 'days').toISOString()
  }
  if (periodicity == Enumerators.periodicity.weeks) {
    return moment(date, dateFormat).add(frequency, 'weeks').toISOString()
  }
  if (periodicity == Enumerators.periodicity.months) {
    return moment(date, dateFormat).add(frequency, 'months').toISOString()
  }
  if (periodicity == Enumerators.periodicity.years) {
    return moment(date, dateFormat).add(frequency, 'years').toISOString()
  }
  if (periodicity == Enumerators.periodicity.monday) {
    console.log("cada n lunes")
    return nextWeekDay(date, Enumerators.isoWeekDay.monday, frequency) 
  }
  if (periodicity == Enumerators.periodicity.tuesday) {
    console.log("cada n martes")
    return nextWeekDay(date, Enumerators.isoWeekDay.tuesday, frequency) 
  }
  if (periodicity == Enumerators.periodicity.wednesday) {
    console.log("cada n miercoles")
    return nextWeekDay(date, Enumerators.isoWeekDay.wednesday, frequency) 
  }
  if (periodicity == Enumerators.periodicity.thursday) {
    console.log("cada n jueves")
    return nextWeekDay(date, Enumerators.isoWeekDay.thursday, frequency) 
  }
  if (periodicity == Enumerators.periodicity.friday) {
    console.log("cada n viernes")
    return nextWeekDay(date, Enumerators.isoWeekDay.friday, frequency) 
  }
  if (periodicity == Enumerators.periodicity.saturday) {
    return nextWeekDay(date, Enumerators.isoWeekDay, frequency) 
  }
  if (periodicity == Enumerators.periodicity.sunday) {
    return nextWeekDay(date, Enumerators.isoWeekDay, frequency) 
  }
}

const nextWeekDay = (date, dayOfWeek, frequency) => {
  const totalDays = 7 * frequency
  let count = 0
  for (let i = 1; i < totalDays; i++) {
    
    const isoWeekDay = moment(date, dateFormat).add(i, 'days').isoWeekday()
    
    if (dayOfWeek == isoWeekDay) {
      count ++
      if (count == frequency) {
        return moment(date, dateFormat).add(i, 'days').toISOString()
      }
    }
  }

  return date

}

const calculateNextMaintenanceReading = (currentReading, frequency) => {
  
  if (currentReading == null || frequency == null) return null

  return parseFloat(currentReading) + parseFloat(frequency)
}

module.exports = {
  calculateNextMaitenanceDate,
  calculateNextMaintenanceReading
}