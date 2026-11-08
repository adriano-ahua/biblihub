// LIBROS INICIALES
// Lista de libros que aparecerán en el catálogo
// cuando todavía no existan registros guardados.

const librosIniciales = [
  {
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    isbn: '978-0307474728',
    categoria: 'Novela',
    cantidad: 4,
    prestados: 1,
  },
  {
    id: 2,
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    isbn: '978-0156012195',
    categoria: 'Fábula',
    cantidad: 6,
    prestados: 2,
  },
  {
    id: 3,
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    isbn: '978-8420412146',
    categoria: 'Clásico',
    cantidad: 3,
    prestados: 0,
  },
]
export default librosIniciales;
