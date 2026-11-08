// ALMACENAMIENTO DE LIBROS
// Administra los datos de los libros en el navegador.

// Importa los libros iniciales.
import librosIniciales from '../datos/librosIniciales.jsx';

// ==================================================
// CARGAR LIBROS
// Recupera los libros guardados en localStorage.
// Si no existen, utiliza la lista inicial.
// ==================================================

export function cargarLibros() {
  try {
    const guardados = localStorage.getItem('biblioteca-libros');

    return guardados === null
      ? librosIniciales
      : JSON.parse(guardados);

  } catch {
    return librosIniciales;
  }
}

// ==================================================
// GUARDAR LIBROS
// Guarda la lista actualizada en localStorage.
// ==================================================

export function guardarLibros(libros) {
  localStorage.setItem(
    'biblioteca-libros',
    JSON.stringify(libros)
  );
}
