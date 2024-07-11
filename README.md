

# ***Pantallas***

### **Pantalla Bienvenido: ** 
Dos botones de accion para Iniciar sesión o registrarse. Información de contacto y links de redes
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/bienvenid.png?raw=true)

### **Pantalla inicio de sesión: ** 
6 botones con la imagen de usuarios. 3 pacientes, 2 especialistas y un admin.
El menu ademas ofrece la posibilidad de iniciar sesión con la cuenta de google y mediante un link se puede ir a registro de usuarios
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/login.png?raw=true)
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/login%20google.png?raw=true)

Cuando iniciamos sesión, veremos un spinner-loader por pantalla
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/loader.png?raw=true)

### **Pantalla regustro de usuarios: ** 
2 botones con una imagen representativa por tipo de suario. Inicialmente solo podemos crear usuarios de tipo paciente o especialista
El menu ademas ofrece un link para ir a inicio de sesión de vuelta
 **Registro de paciente**
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/registro.png?raw=true)

**Registro de especialista**
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/registro%20esp.png?raw=true)
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/registro%20esp-nueva%20esp.png?raw=true)

- Las nuevas especialidades se cargarán con una imagen por default
**Registro de amdini**
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/registro%20como%20admin.png?raw=true)
Solo un admin logueado puede crear otro admin

**Pantalla home y barra de navegación**
El home construye la barra de navegacion y por medio de pipes personalizados, emplea distintos saludos dependiendo el tipo de usuario
Una vez iniciada sesión, dependiendo de nuestro perfil, podremos hacer diferentes cosas. 
Barra de opciones del paciente
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/barra-paciente.png?raw=true)
**Desde esta barra de navegación los pacientes podrán**
- ver su perfil
- solicitar turnos
- ver sus turnos
- cerrar sesión

**Mi perfil** 
Cuando un paciente ingresa a Mi Perfil, si algun especialista ya cargó su historia clínica, podrá verla desde aquí
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/mi%20perfil.png?raw=true)
En cambio, si el usuario es un especialista, además de ver la iformación de su cuenta, también podrá gestionar sus horarios disponibles 
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/mis%20horarios.png?raw=true)
  
Barra de opciones del administrador
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/barra-admion.png?raw=true)
**Desde esta barra de navegación los administradores podrán**
- ver su perfil
- solicitar turnos para otros pacientes
- ver todos los turnos de la clinica
- administrar los usuarios
- cerrar sesión

### **Turnos - Admin: ** 
Los admins pueden ver todos los turnos de todos los pacientes y especialistas. Pero ademas cuentan con filtros por categoria al accionar los botones correspondientes en la barra superior
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/mis%20turnos%20-%20admin.png?raw=true)
### **Turnos - Especialistas/Pacientes: ** 
Tanto pacientes como especialistas veran solo los turnos que los involucren a si mismos. Además ellós cuentan con un filtro dinámico por texto.
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/mis%20turnos%20-%20esp.png?raw=true)
- Los especialistas, veran el turno que fué solicitado y podrán aceptarlo, cancelarlo o rechazarlo, debiendo dejar una **reseña** sobre ello
- ![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/mis%20turnos%20-%20rechazar.png?raw=true)
- Los pacientes podrán cancelarlo, debiendo dejar un **comentario** sobre ello
- ![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/mis%20turnos%20-%20cancelar.png?raw=true)
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/mis%20turnos%20-%20detalle.png?raw=true)

**solo si un turno fue ACEPTADO, podrá ser REALIZADO y asi mismo, sólo si fué REALIZADO se podrá cargar una HISTORIA CLINICA**
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/historia%20clinica.png?raw=true)


### **Soliciar Turnos / Todos ** 
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/turnos%20-%20seleccion%20de%20especialista.png?raw=true)
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/turnos%20-%20seleccion%20de%20especialidad.png?raw=true)
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/turnos%20-%20seleccion%20de%20dia.png?raw=true)
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/turnos%20-%20seleccion%20de%20horarios.png?raw=true)

Los admins además deberán elegir para que paciente es el turno
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/turnos%20-%20seleccion%20de%20paciente.png?raw=true)

Al confirmarse el turno saldrá un mensaje por pantalla con una animación
![image]([https://github.com/dsvlivon/imagenes/blob/main/clinica/turnos%20-%20seleccion%20de%20paciente.png?raw=true](https://github.com/dsvlivon/imagenes/blob/main/clinica/msg%20confirmacion%20-%20animacion.png?raw=true))
