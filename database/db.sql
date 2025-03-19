CREATE DATABASE webcursos;
use webcursos;
CREATE TABLE users (
 userID VARCHAR(100) PRIMARY KEY NOT NULL, 
 username VARCHAR(60) NOT NULL UNIQUE,
 email VARCHAR(70) NOT NULL UNIQUE UNIQUE,
 password VARCHAR(40) NOT NULL,
 rol ENUM ('alumno', 'instructor', 'admin') NOT NULL, /* Podrian ser otros roles */
 profilePicture TEXT /* Opcional */
 );
CREATE TABLE categorias (
id_Categoria INT PRIMARY KEY NOT NULL,
descripcion_Categoria VARCHAR(25)
);
select * from users;
CREATE TABLE cursos (
id_Curso INT PRIMARY KEY NOT NULL, 
nombre_Curso VARCHAR(50) NOT NULL,
descripcion__Curso TEXT,
fecha_Curso DATETIME NOT NULL,
duracion_Curso DATE,
id_Instructor VARCHAR(100) NOT NULL,
id_Categoria INT NOT NULL,
material TEXT, /* Opcional */
foreign key (id_Instructor) references users (userId) on delete cascade,
foreign key (id_Categoria) references categorias (id_Categoria) on delete cascade
);
 
 CREATE TABLE contenidos (
 id_Contenidos INT PRIMARY KEY NOT NULL, 
 id_Curso INT NOT NULL,
 descripcion_Contenido TEXT,
 ruta_Docuemnto TEXT, /* RUTA DONDE SE ENCUENTRA ALOJADO EL DOCUMENTO */
 puntuacion_Contenido DECIMAL(5,2),
 foreign key (id_Curso) references cursos (id_Curso) on delete cascade
 );
 
 CREATE TABLE mensajes ( 
 id_Mensajes INT PRIMARY KEY NOT NULL, 
 id_UReceptor VARCHAR(100) NOT NULL, 
 id_UEmisor VARCHAR(100) NOT NULL, 
 marca_Tiempo DATETIME NOT NULL,
 contenido_Mensaje TEXT,
 foreign key (id_UReceptor) references users (userId) on delete cascade,
 foreign key (id_UEmisor) references users (userId) on delete cascade
 );
 
 CREATE TABLE ticket_Soporte (
 id_ticket INT PRIMARY KEY NOT NULL,
 id_RUsuario VARCHAR(100) NOT NULL,
 categoria_Problema ENUM ('tecnico', 'funcional', 'bug', 'otra categoria'), /*Podrian ser otros */
 archivos_Puebras TEXT,
 estado_Ticket ENUM ('abierto', 'cerrado', ' en proceso', 'deconocido'),
 resolucion_Ticket TEXT,
 foreign key (id_RUsuario) references users (userId) on delete cascade
 );

DROP DATABASE webcursos;