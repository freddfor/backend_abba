const dayjs = require("dayjs");

const AdicionarDias = async (fecha, dias, feriados = []) => {
  const Sunday = 0;
  const Saturday = 6;
  let daysRemaining = dias ;

  while (daysRemaining > 0) {
    fecha = fecha.add(1, "days");
    // console.log(dayjs(fecha).format('YYYY-MM-DD'), normalize.some(f => f === dayjs(fecha).format('YYYY-MM-DD')), 'encontrado');
    if (
      fecha.day() !== Sunday &&
      fecha.day() !== Saturday &&
      !feriados.some((f) => f === dayjs(fecha).format("YYYY-MM-DD"))
    ) {
      daysRemaining--;
    }
  }

  return fecha.format("YYYY-MM-DD");
};

module.exports = { AdicionarDias };
