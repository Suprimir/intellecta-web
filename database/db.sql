CREATE DATABASE webcursos;
use webcursos;

CREATE TABLE usuarios (
 id_Usuario INT PRIMARY KEY NOT NULL, 
 nombre_Usuario VARCHAR(60) NOT NULL UNIQUE,
 apellidos_Usuario VARCHAR(70) NOT NULL,
 correo_Usuario VARCHAR(70) NOT NULL UNIQUE UNIQUE,
 contraseña_Usuario VARCHAR(40) NOT NULL,
 rol_Usuario ENUM ('alumno', 'instructor', 'admin') NOT NULL, /* Podrian ser otros roles */
 foto_Usuario TEXT /* Opcional */
 );
 
CREATE TABLE categorias (
id_Categoria INT PRIMARY KEY NOT NULL,
descripcion_Categoria VARCHAR(25)
);

CREATE TABLE cursos (
id_Curso INT PRIMARY KEY NOT NULL, 
nombre_Curso VARCHAR(50) NOT NULL,
descripcion__Curso TEXT,
fecha_Curso DATETIME NOT NULL,
duracion_Curso DATE,
id_Instructor INT NOT NULL,
id_Categoria INT NOT NULL,
material TEXT, /* Opcional */
foreign key (id_Instructor) references usuarios (id_Usuario) on delete cascade,
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
 id_UReceptor INT NOT NULL, 
 id_UEmisor INT NOT NULL, 
 marca_Tiempo DATETIME NOT NULL,
 contenido_Mensaje TEXT,
 foreign key (id_UReceptor) references usuarios (id_Usuario) on delete cascade,
 foreign key (id_UEmisor) references usuarios (id_Usuario) on delete cascade
 );
 
 CREATE TABLE ticket_Soporte (
 id_ticket INT PRIMARY KEY NOT NULL,
 id_RUsuario INT NOT NULL,
 categoria_Problema ENUM ('tecnico', 'funcional', 'bug', 'otra categoria'), /*Podrian ser otros */
 archivos_Puebras TEXT,
 estado_Ticket ENUM ('abierto', 'cerrado', ' en proceso', 'deconocido'),
 resolucion_Ticket TEXT,
 foreign key (id_RUsuario) references usuarios (id_Usuario) on delete cascade
 );

DROP DATABASE webcursos;