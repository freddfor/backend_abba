## CODIGOS REFERENCIALES DE ERRORES GENERALES

100	Continue	
101	Switching Protocols	
102	Processing	
103	Early Hints	
104-199	-> sin asignar	
200	OK	
201	Created	
202	Accepted	
203	Non-Authoritative Information	
204	No Content	
205	Reset Content	
206	Partial Content	
207	Multi-Status	
208	Already Reported	
209-225	-> sin asignar	
226	IM Used	
227-299	-> sin asignar	
300	Multiple Choices	
301	Moved Permanently	
302	Found	
303	See Other	
304	Not Modified	
305	Use Proxy	
306	(Unused)	
307	Temporary Redirect	
308	Permanent Redirect	
309-399	-> sin asignar
400 – Bad Request -> cuando lo que navegador envia no cumple las normas protocolos http
401 – Authorization Required -> error se activa cuando la pagina se encuentra protegida con una contraseña 
403 – Forbidden -> cuando el servidor no puede completar la peticion realizada por el usuario
404 – Not Found -> (Del mas usado) Este código indica que el servidor no ha encontrado nada en la ubicación especificada por el cliente, ya sea porque la URL no se ha ingresado correctamente o la estructura de URLs.
405 – Method Not Allowed -> no se permite el uso de ese método.
406 – Not Acceptable -> la petición solo puede generar un tipo de contenido distinto al que se especificó como aceptable.
407 – Proxy Authentication Required -> se requiere al cliente que se identifique mediante un proxy.
408 – Request Time-Out -> Cuando la solicitud del servidor está tomando demasiado tiempo.
409 – Conflict -> la petición no se pudo completar porque hubo un problema con ella.
410 – Gone -> Ambos indican que el servidor no encuentra el archivo solicitado, la diferencia es que el código 404 implica que el archivo puede estar ubicado en otro directorio del servidor, mientras que el 410 indica que el archivo ya no se encuentra disponible.
411 – Length Required -> el cliente debía indicar la longitud del contenido, pero no lo hizo.
412 – Precondition Failed -> el servidor no cumple las condiciones previas que se indicaban en la petición.
413 – Payload Too Large -> la petición es demasiado larga y el servidor se niega a procesarla.
414 – URI Too Long -> la dirección web es demasiado larga. Si recibes este error, difícilmente podrás solucionarlo pues no es problema tuyo, sino de la página que generó dicho enlace.
415 – Unsupported Media Type -> el tipo de archivo que se ha recibido es distinto al que se esperaba.
416 – Range Not Satisfiable -> el cliente ha pedido una porción de un recurso que es incorrecta.
417 – Expectation Failed -> el servidor no puede cumplir con las expectaciones de la cabecera.
418 – I'm a teapot -> es un código de estado que nació como una broma de April's Fools. Puedes recibir uno visitando esta web.
421 – Misdirected Request -> el servidor es incapaz de producir una respuesta.
422 – Unprocessable Entity -> la petición era correcta pero tenía algún error semántico.
423 – Locked -> este recurso está bloqueado.
424 – Failed Dependency -> este recurso depende de otra respuesta, que falló.
426 – Upgrade Required -> el cliente debe usar un protocolo distinto.
428 – Precondition Required -> el servidor requiere que la petición sea condicional.
429 – Too Many Requests -> se han enviado demasiadas peticiones en un corto período de tiempo.
431 – Request Header Fields Too Large -> la cabecera o algunos de los campos de la cabecera son demeasiado grandes.
452 – Unavailable for Legal reasons -> el servidor deniega el accceso a este recurso por motivos legales.
500 – Internal Server Error -> errores por parte del servidor. Se emplea cada vez que el servidor se encuentra con algún tipo de fallo que no le permite completar la solicitud del cliente.
501 – Not Implemented -> el servidor aun no ha implementado el método que se ha pedido, aunque es probable que se añada en un futuro.
502 – Bad Gateway -> indica un error de comunicación entre dos servidores. Sucede cuando el cliente se conecta a un servidor que actúa como un proxy o un portal que necesita acceder a un servidor ascendente, el cual proporciona un servicio adicional al servidor inicial. 
503 – Service Unavailable -> Este error puede aparecer cada vez que se da una sobrecarga en el servidor o cuando se está realizando algún mantenimiento programado.
504 – Gateway Time-Out -> también incida un error de comunicación entre dos servidores al igual que el error 502. En este caso particular se reconoce que el servidor de menor nivel no ha recibido una respuesta en el tiempo permitido por el servidor ascendente al cual ha accedido.
505 – HTTP Version Not Supported -> el servidor no soporta la versión del protocolo HTTP que se le pidió.
506 – Variant Also Negotiates -> la petición resulta en una petición con referencias circulares.
507 – Insufficient Storage -> el servidor no tiene espacio suficiente para completar la petición.
508 – Loop Detected -> el servidor ha detectado un bucle infinito.
510 – Not Extended -> el servidor requiere de extensiones para completar la petición.
511 – Network Authentication Required -> el cliente necesita identificarse.
512 – 599  -> sin asignar


## CODIGOS INTERNOS DE ERRORES 

errores: 
  # 10XX: Errores de la aplicación principal 
    '1000' (500): 'Error del servidor de la aplicación, comuníquese con el administrador' # Error global 
    '1001' (417): 'Encabezados faltantes' 
    '1002' (412): 'Parámetros faltantes' 
    '1003' (507): 'Límite o desplazamiento no válido ' 
    '1004' (500):' Configuración regional no válida ' 
    '1005' (500):' Zona horaria no válida ' 
    '1006' (429):' Excedió el límite de solicitudes por minuto. Vuelva a intentarlo después de un tiempo. '
  # 11XX (400): Errores Http 
    '1101' (401): 'No autorizado' 
    '1102' (401): 'No autorizado para acceder' 
    '1103' (416): 'Entidad no procesable' 
    '1104' (511): 'Autenticación fallida' 
    '1105' (410): 'Archivo o recurso No encontrado'
  # 12XX: Auth Erorrs 
    '1201' (511): 'Su sesión ha caducado, inicie sesión de nuevo' # Token caducado 
    '1202' (511): 'Sus sesiones no son válidas' # Error de verificación de JWT 
    '1203' (511): 'Sus sesiones no son válidas' # Error encontrado mientras decoding JWT token 
    '1204' (511): 'Su token de sesiones no es válido' # Token no válido 
    '1205' (401): 'No está autorizado, inicie sesión' # No está autorizado, inicie sesión 
    '1206' (401): 'Error de autenticación, usuario no encontrado' # Autenticación Error, usuario no encontrado
  # 13XX Errores de sesión 
    '1301' (511): 'Credenciales no válidas' 
    '1302' (511): 'Tipo de inicio de sesión no válido' 
    '1303' (511): 'Tipo social no válido' 
    '1304' (511): 'Error de inicio de sesión' 
    '1305' (401): 'Su cuenta está deshabilitada por el administrador . 
    ---'1306' (303): 'Número de móvil no válido'. 
    '1307' (401): '¡Código de confirmación incorrecto! Intentar otra vez.' 
    '1308' (511): 'Correo electrónico o contraseña no válidos' 
    '1309' (511): 'Su cuenta ya existe en la aplicación, intente iniciar sesión'. 
    '1310' (511): 'Su solicitud no es válida o su tiempo de solicitud ha terminado. Vuelva a intentarlo'. 
    '1311' (511): 'No está autorizado para acceder a esta aplicación' 
    '1313' (511): 'Su correo electrónico aún no está confirmado, confirme su correo electrónico' 
    '1314' (511): 'El enlace de correo electrónico ha caducado' 
    '1315' (511): 'Su cuenta no está activada Verifique su correo electrónico para activar la cuenta' 
    '1316' (511): 'No puede eliminar al usuario hasta que sus solicitudes hayan sido completadas o canceladas' 
    '1317' (511): 'Este número ya se ha registrado' 
    '1318' (511): 'Por favor, antes de iniciar sesión con la cuenta de Google, primero regístrese' 
    '1319' (303): 'Sus datos son incorrectos' 
    '1320' (401):' ¡el código de confirmación ha expirado! Vuelva a intentarlo ' 
    '1321' (303):' No puede eliminar el proveedor hasta que haya completado o cancelado sus solicitudes ' 
    '1322' (503): 'Su cuenta fue bloqueada por el administrador. Póngase en contacto con el administrador en @miteleferico.bo '

  data_found: 'Datos encontrados' 
  no_data_found: 'No se han encontrado datos' 
  not_found: 'No encontrado' 
  x_not_found: '% {name} no encontrado!' 
  update_successfully: 'Actualizado exitosamente' 
  x_update_successfully: '% {name} actualizado exitosamente' 
  created_successfully: 'Creado exitosamente' 
  x_created_successfully: '% {name} creado exitosamente' 
  deleted_successfully: 'Eliminado exitosamente' 
  x_deleted_successfully: '% {name} eliminado exitosamente' 
  request_submitted: 'El código del pedido% {code} se ha enviado correctamente' 
  orders_not_found: 'Aún no hay pedidos'


  ## Códigos de Respuesta de los Servicios HTTP
Código	Descripción
200	Respuesta exitosa
400	El request está mal formado. La información para crear el recurso no existe o es inválida
401	Error en la autenticación. La autenticación falló o no se encontró la información necesaria para autenticar el request.
403	El usuario no tiene permisos para realizar la acción.
404	No se encontró en la aplicación el item al que se le desea realizar la acción
405	Operación no permitida. Ocurre cuando el método del request es inválido para el endpoint requerido.
406	Ocurre cuando el número de request por minuto fue excedido
407	El tiempo está fuera del rango. Cuando el ts (timestamp) está fuera del rango del servidor de FRACTTAL API.
408	El item ya existe. Ocurre cuando se intenta insertar un item ya existente
500	Ocurrió un error en la aplicación.