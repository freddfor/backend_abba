

const hasRegimen = ( req, res, next ) => {

  const hasReadingRegimen = req.body.reading_frequency && req.body.fk_reading_measurement_unit
  const hasPeriodicityRegimen = req.body.periodicity_frequency && req.body.fk_periodicity

  if ( !hasReadingRegimen && !hasPeriodicityRegimen ) {
         
    return res.status(400).json({
        msg: 'Debe tener al menos un régimen de lecturas o fechas'
      })
    }

    next()  
}

module.exports = {
  hasRegimen
}