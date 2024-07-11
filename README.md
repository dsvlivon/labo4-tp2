

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
  
Barra de opciones del administrador
![image](https://github.com/dsvlivon/imagenes/blob/main/clinica/barra-admion.png?raw=true)
**Desde esta barra de navegación los administradores podrán**
- ver su perfil
- solicitar turnos para otros pacientes
- ver todos los turnos de la clinica
- administrar los usuarios
- cerrar sesión

