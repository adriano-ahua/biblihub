
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Lectores from './Lectores.jsx';

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

const formularioVacio = {
  titulo: '',
  autor: '',
  isbn: '',
  categoria: 'Novela',
  cantidad: '1',
}

function cargarLibros() {
  try {
    const guardados = localStorage.getItem('biblioteca-libros')
    return guardados === null
      ? librosIniciales
      : JSON.parse(guardados)
  } catch {
    return librosIniciales
  }
}

function App() {
  const [seccion, setSeccion] = useState('libros')
  const [libros, setLibros] = useState(cargarLibros)
  const [busqueda, setBusqueda] = useState('')
  const [formulario, setFormulario] = useState(formularioVacio)
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    localStorage.setItem('biblioteca-libros', JSON.stringify(libros))
  }, [libros])

  const librosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()

    return libros.filter((libro) =>
      [
        libro.titulo,
        libro.autor,
        libro.isbn,
        libro.categoria,
      ].some((valor) => valor.toLowerCase().includes(termino))
    )
  }, [libros, busqueda])

  const totalEjemplares = libros.reduce(
    (total, libro) => total + libro.cantidad,
    0
  )

  const totalPrestados = libros.reduce(
    (total, libro) => total + libro.prestados,
    0
  )

  const totalDisponibles = totalEjemplares - totalPrestados

  function abrirNuevoFormulario() {
    setFormulario(formularioVacio)
    setEditandoId(null)
    setMensaje('')
    setMostrarFormulario(true)
  }

  function editarLibro(libro) {
    setFormulario({
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
      categoria: libro.categoria,
      cantidad: String(libro.cantidad),
    })
    setEditandoId(libro.id)
    setMensaje('')
    setMostrarFormulario(true)
  }

  function guardarLibro(event) {
    event.preventDefault()

    const titulo = formulario.titulo.trim()
    const autor = formulario.autor.trim()
    const isbn = formulario.isbn.trim()
    const cantidad = Number(formulario.cantidad)

    if (!titulo || !autor) {
      setMensaje('Completa todos los campos obligatorios.')
      return
    }

    if (!Number.isInteger(cantidad) || cantidad < 1) {
      setMensaje('La cantidad debe ser un número entero mayor que cero.')
      return
    }

    const isbnDuplicado = isbn !== '' && libros.some(
      (libro) =>
      libro.isbn &&
      libro.isbn.toLowerCase() === isbn.toLowerCase() &&
      libro.id !== editandoId
      )

      if (isbnDuplicado) {
        setMensaje('Ya existe un libro registrado con ese ISBN.')
        return
      }

    const libroExistente = libros.find(
      (libro) => libro.id === editandoId
    )

    if (libroExistente && cantidad < libroExistente.prestados) {
      setMensaje(
        'La cantidad no puede ser menor que los ejemplares prestados.'
      )
      return
    }

    if (editandoId !== null) {
      setLibros((actuales) =>
        actuales.map((libro) =>
          libro.id === editandoId
            ? {
                ...libro,
                titulo,
                autor,
                isbn,
                categoria: formulario.categoria,
                cantidad,
              }
            : libro
        )
      )
      setMensaje('Libro actualizado correctamente.')
    } else {
      setLibros((actuales) => [
        ...actuales,
        {
          id: Date.now(),
          titulo,
          autor,
          isbn,
          categoria: formulario.categoria,
          cantidad,
          prestados: 0,
        },
      ])
      setMensaje('Libro registrado correctamente.')
    }

    setMostrarFormulario(false)
    setFormulario(formularioVacio)
    setEditandoId(null)
  }

  function eliminarLibro(id) {
    const confirmado = window.confirm(
      '¿Estás seguro de que deseas eliminar este libro?'
    )

    if (!confirmado) return

    setLibros((actuales) => actuales.filter((libro) => libro.id !== id))
  }

  function cambiarPrestamo(libro, operacion) {
    if (
    operacion === 'prestar' &&
    libro.cantidad <= libro.prestados
  ) {
    alert('No hay ejemplares disponibles.');
    return;
  }

  if (operacion === 'devolver' && libro.prestados <= 0) {
    alert('No hay préstamos pendientes de devolución.');
    return;
  }

  setLibros((actuales) =>
    actuales.map((actual) => {
      if (actual.id !== libro.id) return actual;

      return {
        ...actual,
        prestados:
          operacion === 'prestar'
            ? actual.prestados + 1
            : actual.prestados - 1,
      };
    })
  );
  }
  return (
    <div className="sistema">
      <aside className="sidebar">
        <div className="marca">
          <span className="marca-icono">B</span>
          <div>
            <strong>Biblioteca</strong>
            <small>Sistema de gestión</small>
          </div>
        </div>

        <p className="menu-titulo">MENÚ PRINCIPAL</p>

        <nav className="menu">
           <a
            href="#inicio"
            className="menu-link"
            onClick={() => setSeccion('dashboard')}
          >
            <span>▦</span> Dashboard
          </a>

          <a
            href="#libros"
            className={`menu-link ${seccion === 'libros' ? 'activo' : ''}`}
            onClick={() => setSeccion('libros')}
          >
          <span>▤</span> Gestión de libros
          </a>

          <a
            href="#lectores"
            className={`menu-link ${seccion === 'lectores' ? 'activo' : ''}`}
            onClick={() => setSeccion('lectores')}
          >
            <span>👥</span> Gestión de lectores
          </a>
        </nav>

        <div className="sidebar-pie">
          <span className="estado-punto" />
          Sistema en funcionamiento
        </div>
      </aside>

      
<main className="contenido" id="inicio">
  {seccion === 'lectores' ? (
    <Lectores />
  ) : seccion === 'dashboard' ? (
    <>
      <header className="encabezado">
        <div>
          <p className="sobretitulo">ADMINISTRACIÓN</p>
          <h1>Dashboard</h1>
          <p className="subtitulo">
            Resumen general de tu biblioteca.
          </p>
        </div>
      </header>

      <section className="tarjetas">
        <article className="tarjeta">
          <div className="tarjeta-superior">
            <span>Total de títulos</span>
            <span className="tarjeta-icono azul">▤</span>
          </div>
          <h2>{libros.length}</h2>
          <p>Libros diferentes registrados</p>
        </article>

        <article className="tarjeta">
          <div className="tarjeta-superior">
            <span>Ejemplares disponibles</span>
            <span className="tarjeta-icono verde">✓</span>
          </div>
          <h2>{totalDisponibles}</h2>
          <p>Listos para préstamo</p>
        </article>

        <article className="tarjeta">
          <div className="tarjeta-superior">
            <span>Ejemplares prestados</span>
            <span className="tarjeta-icono naranja">↗</span>
          </div>
          <h2>{totalPrestados}</h2>
          <p>Actualmente fuera de biblioteca</p>
        </article>
      </section>

      <footer className="pie-pagina">
        Sistema de Gestión de Biblioteca · Proyecto académico
      </footer>
    </>
  ) : (
    <>
      <header className="encabezado">
        <div>
          <p className="sobretitulo">ADMINISTRACIÓN</p>
          <h1>Gestión de libros</h1>
          <p className="subtitulo">
            Administra el catálogo de tu biblioteca.
          </p>
        </div>

        <div className="perfil">
          <div className="avatar">A</div>
          <div>
            <strong>Administrador</strong>
            <small>Panel principal</small>
          </div>
        </div>
      </header>

      {/* AQUÍ CONSERVA TODO TU CÓDIGO DEL CATÁLOGO */}
      <main className="contenido" id="inicio">
        {seccion === 'lectores' ? (
          <Lectores />
        ) : seccion === 'dashboard' ? (
          <> 
           

        <section className="tarjetas">
          <article className="tarjeta">
            <div className="tarjeta-superior">
              <span>Total de títulos</span>
              <span className="tarjeta-icono azul">▤</span>
            </div>
            <h2>{libros.length}</h2>
            <p>Libros diferentes registrados</p>
          </article>

          <article className="tarjeta">
            <div className="tarjeta-superior">
              <span>Ejemplares disponibles</span>
              <span className="tarjeta-icono verde">✓</span>
            </div>
            <h2>{totalDisponibles}</h2>
            <p>Listos para préstamo</p>
          </article>

          <article className="tarjeta">
            <div className="tarjeta-superior">
              <span>Ejemplares prestados</span>
              <span className="tarjeta-icono naranja">↗</span>
            </div>
            <h2>{totalPrestados}</h2>
            <p>Actualmente fuera de biblioteca</p>
          </article>
        </section>
                </>
    ) : (
      <>
       
        <section className="panel" id="libros">
          <div className="panel-encabezado">
            <div>
              <h2>Catálogo de libros</h2>
              <p>Registra y administra los ejemplares de tu biblioteca.</p>
            </div>

            <button
              className="boton-principal"
              onClick={abrirNuevoFormulario}
            >
              + Nuevo libro
            </button>
          </div>

          {mostrarFormulario && (
            <form className="formulario" onSubmit={guardarLibro}>
              <h3>
                {editandoId !== null ? 'Editar libro' : 'Registrar libro'}
              </h3>

              <div className="campos">
                <label>
                  Título *
                  <input
                    value={formulario.titulo}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        titulo: e.target.value,
                      })
                    }
                    placeholder="Título del libro"
                    required
                  />
                </label>

                <label>
                  Autor *
                  <input
                    value={formulario.autor}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        autor: e.target.value,
                      })
                    }
                    placeholder="Nombre del autor"
                    required
                  />
                </label>

                <label>
                  ISBN (opcional)
                  <input
                  value={formulario.isbn}
                  onChange={(e) =>
                    setFormulario({
                    ...formulario,
                    isbn: e.target.value,
                  })
                 }
                 placeholder="Código ISBN (si lo conoces)"
                />
                </label>

                <label>
                  Categoría
                  <select
                    value={formulario.categoria}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        categoria: e.target.value,
                      })
                    }
                  >
                    <option>Novela</option>
                    <option>Fábula</option>
                    <option>Clásico</option>
                    <option>Historia</option>
                    <option>Ciencia</option>
                    <option>Educación</option>
                    <option>Tecnología</option>
                    <option>Otro</option>
                  </select>
                </label>

                <label>
                  Cantidad de ejemplares *
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formulario.cantidad}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        cantidad: e.target.value,
                      })
                    }
                    required
                  />
                </label>
              </div>

              {mensaje && <p className="mensaje">{mensaje}</p>}

              <div className="acciones-formulario">
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => {
                    setMostrarFormulario(false)
                    setMensaje('')
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="boton-principal">
                  Guardar libro
                </button>
              </div>
            </form>
          )}

          <div className="barra-busqueda">
            <span>⌕</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por título, autor, ISBN o categoría..."
              aria-label="Buscar libros"
            />
          </div>

          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>LIBRO</th>
                  <th>ISBN</th>
                  <th>CATEGORÍA</th>
                  <th>DISPONIBLES</th>
                  <th>ESTADO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {librosFiltrados.map((libro) => {
                  const disponibles = libro.cantidad - libro.prestados

                  return (
                    <tr key={libro.id}>
                      <td>
                        <strong>{libro.titulo}</strong>
                        <small className="autor">{libro.autor}</small>
                      </td>
                      <td>{libro.isbn}</td>
                      <td>
                        <span className="categoria">
                          {libro.categoria}
                        </span>
                      </td>
                      <td>
                        {disponibles} / {libro.cantidad}
                      </td>
                      <td>
                        <span
                          className={
                            disponibles > 0
                              ? 'estado disponible'
                              : 'estado agotado'
                          }
                        >
                          {disponibles > 0 ? 'Disponible' : 'Agotado'}
                        </span>
                      </td>
                      <td>
                        <div className="acciones-tabla">
                          <button
                            className="boton-accion editar"
                            onClick={() => editarLibro(libro)}
                            title="Editar libro"
                          >
                            Editar
                          </button>
                          <button
                            className="boton-accion prestar"
                            onClick={() =>
                              cambiarPrestamo(libro, 'prestar')
                            }
                            disabled={disponibles === 0}
                            title="Registrar un préstamo"
                          >
                            Prestar
                          </button>
                          <button
                            className="boton-accion devolver"
                            onClick={() =>
                              cambiarPrestamo(libro, 'devolver')
                            }
                            disabled={libro.prestados === 0}
                            title="Registrar una devolución"
                          >
                            Devolver
                          </button>
                          <button
                            className="boton-accion eliminar"
                            onClick={() => eliminarLibro(libro.id)}
                            title="Eliminar libro"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {librosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="sin-resultados">
                      No se encontraron libros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="pie-tabla">
            Mostrando {librosFiltrados.length} de {libros.length} títulos.
            Total de ejemplares: {totalEjemplares}.
          </p>
        </section>

        <footer className="pie-pagina">
          Sistema de Gestión de Biblioteca · Proyecto académico
        </footer>
        </>
         )}
      </main>


      {/* Desde <section className="panel" id="libros"> */}
      {/* Hasta el cierre de </section> del catálogo */}

      {/* Pega aquí el código del formulario, búsqueda y tabla
          que tenías anteriormente. */}

      
    </>
  )}
</main>

    </div>
  )
}

export default App

