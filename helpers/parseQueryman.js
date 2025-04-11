const { Op } = require('sequelize');

/**
 * 
 * @param {query} query convierte el encabezado de queryman en el operaror para realizar consultas con sequelize
 * @returns 
 */
const parseWhere = function (query) {
	try {
		if (Object.entries(query).length == 0) return null
		var clave = Object.keys(query)[0]
		var op = Object.keys(query[clave])[0]
		var valor = Object.values(query[clave])[0]

		console.log("Keys", clave)
		console.log("Op:", op)
		console.log("Value:", valor)

		var obj = new Object()
		if (op == "$eq") obj[clave] = { [Op.eq]: valor }
		if (op == "$ne") obj[clave] = { [Op.ne]: valor }
		if (op == "$gte") obj[clave] = { [Op.gte]: valor }
		if (op == "$gt") obj[clave] = { [Op.gt]: valor }
		if (op == "$lte") obj[clave] = { [Op.lte]: valor }
		if (op == "$lt") obj[clave] = { [Op.lt]: valor }
		if (op == "$not") obj[clave] = { [Op.not]: valor }
		if (op == "$in") obj[clave] = { [Op.in]: valor }
		if (op == "$notIn") obj[clave] = { [Op.notIn]: valor }
		if (op == "$like") obj[clave] = { [Op.like]: valor }
		if (op == "$notLike") obj[clave] = { [Op.notLike]: valor }
		if (op == "$iLike") obj[clave] = { [Op.iLike]: valor }
		if (op == "$notILike") obj[clave] = { [Op.notILike]: valor }
		if (op == "$regexp") obj[clave] = { [Op.regexp]: valor }
		if (op == "$notRegexp") obj[clave] = { [Op.notRegexp]: valor }
		if (op == "$iRegexp") obj[clave] = { [Op.iRegexp]: valor }
		if (op == "$notIRegexp") obj[clave] = { [Op.notIRegexp]: valor }
		if (op == "$between") obj[clave] = { [Op.between]: valor }
		if (op == "$notBetween") obj[clave] = { [Op.notBetween]: valor }
		if (op == "$overlap") obj[clave] = { [Op.overlap]: valor }
		if (op == "$contains") obj[clave] = { [Op.contains]: valor }
		if (op == "$any") obj[clave] = { [Op.any]: valor }
		if (op == "$all") obj[clave] = { [Op.all]: valor }
		if (op == "$values") obj[clave] = { [Op.values]: valor }
		if (op == "$col") obj[clave] = { [Op.col]: valor }
		return (obj)
	} catch (error) {
		return null
	}
}

/**
 * Realiza el parseo del objeto para cambiar el sentido del orden de las columnas en ASC o DESC
 * @param {*} obj 
 * @returns Array con las columnas y el orden de las columas
 */
const parseOrder = function (obj) {
	if (Object.entries(obj).length == 0) return [['created_at', 'ASC'], ['id', 'ASC']]
	var sort = obj
	for (const property in sort) {
		sort[property] = (sort[property] > 0) ? 'ASC' : 'DESC'
		if (property == 'createdAt') return null
	}
	return Object.entries(sort)
}
/**
 * LA funcion devuelve la lista de Atributos para utilizar en la consulta
 * @param {*} select Objeto que tiene todos los atributos
 * @returns [] Array de campos Atributos
 */
const parseAttributes = select => {
	try {
		return (campos = Object.entries(select).length > 0) ? Object.keys(select) : null
	} catch (error) {
		return null
	}
}

module.exports = {
	parseWhere,
	parseOrder,
	parseAttributes,
}