
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Lectores from './Lectores.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx';
import CatalogoLibros from './components/CatalogosLibros.jsx';
import {
  cargarLibros,
  guardarLibros
} from './servicios/almacenamiento.jsx';

// FORMULARIO VACÍO
// Define los valores iniciales de los campos utilizados
// para registrar un libro nuevo o limpiar el formulario.

const formularioVacio = {
  titulo: '',
  autor: '',
  isbn: '',
  categoria: 'Novela',
  cantidad: '1',
}

// COMPONENTE PRINCIPAL DE BIBLIOHUB
// Controla la navegación entre Dashboard, Gestión de
// libros y Gestión de lectores, además de administrar
// la información del catálogo.

function App() {

  // ESTADOS DEL SISTEMA
  // Controlan la sección activa, los libros registrados,
  // la búsqueda, el formulario, la edición y los mensajes.

  const [seccion, setSeccion] = useState('libros')
  const [libros, setLibros] = useState(cargarLibros)
  const [busqueda, setBusqueda] = useState('')
  const [formulario, setFormulario] = useState(formularioVacio)
  const [editandoId, setEditandoId] = useState(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mensaje, setMensaje] = useState('')

  // ==================================================
// GUARDAR LIBROS AUTOMÁTICAMENTE
// Cada vez que cambia la lista de libros,
// se actualiza la información en localStorage.
// ==================================================

useEffect(() => {
  guardarLibros(libros);
}, [libros]);

  // BUSCAR Y FILTRAR LIBROS
  // Permite buscar libros por título, autor, ISBN
  // o categoría mediante la barra de búsqueda.

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

  // CALCULAR TOTAL DE EJEMPLARES
  // Suma la cantidad de ejemplares registrados
  // en todos los libros de la biblioteca.

  const totalEjemplares = libros.reduce(
    (total, libro) => total + libro.cantidad,
    0
  )

  // CALCULAR EJEMPLARES PRESTADOS
  // Suma todos los ejemplares que actualmente
  // se encuentran prestados.

  const totalPrestados = libros.reduce(
    (total, libro) => total + libro.prestados,
    0
  )

  // CALCULAR EJEMPLARES DISPONIBLES
  // Resta los ejemplares prestados del total
  // para conocer cuántos están disponibles.

  const totalDisponibles = totalEjemplares - totalPrestados

  // ABRIR FORMULARIO DE NUEVO LIBRO
  // Limpia los campos, desactiva el modo de edición
  // y muestra el formulario para registrar un libro.

  function abrirNuevoFormulario() {
    setFormulario(formularioVacio)
    setEditandoId(null)
    setMensaje('')
    setMostrarFormulario(true)
  }

  // ====================================================
  // EDITAR LIBRO
  // Carga los datos del libro seleccionado dentro
  // del formulario para permitir modificarlo.
  // ====================================================

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

  // ====================================================
  // GUARDAR LIBRO
  // Valida la información del formulario.
  // Permite registrar libros nuevos o actualizar libros
  // existentes y comprueba los campos obligatorios,
  // la cantidad de ejemplares y el ISBN duplicado.
  // ====================================================

  function guardarLibro(event) {
    event.preventDefault()

    const titulo = formulario.titulo.trim()
    const autor = formulario.autor.trim()
    const isbn = formulario.isbn.trim()
    const cantidad = Number(formulario.cantidad)

    // Comprueba que el título y el autor estén completos.
    if (!titulo || !autor) {
      setMensaje('Completa todos los campos obligatorios.')
      return
    }

    // Comprueba que la cantidad sea un número entero mayor que cero.
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      setMensaje('La cantidad debe ser un número entero mayor que cero.')
      return
    }

    // Comprueba que el ISBN no esté registrado en otro libro.
    // El ISBN es opcional, por eso solo se verifica si tiene contenido.
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

    // Busca el libro que se está editando, si corresponde.
    const libroExistente = libros.find(
      (libro) => libro.id === editandoId
    )

    // Evita reducir la cantidad por debajo de los ejemplares prestados.
    if (libroExistente && cantidad < libroExistente.prestados) {
      setMensaje(
        'La cantidad no puede ser menor que los ejemplares prestados.'
      )
      return
    }

    // Si existe un ID de edición, actualiza el libro seleccionado.
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

      // Si es un libro nuevo, lo agrega al catálogo.
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

    // Cierra el formulario y limpia los campos después de guardar.
    setMostrarFormulario(false)
    setFormulario(formularioVacio)
    setEditandoId(null)
  }

  // ====================================================
  // ELIMINAR LIBRO
  // Solicita confirmación antes de eliminar un libro
  // y lo retira del catálogo si el usuario acepta.
  // ====================================================

  function eliminarLibro(id) {
    const confirmado = window.confirm(
      '¿Estás seguro de que deseas eliminar este libro?'
    )

    if (!confirmado) return

    setLibros((actuales) =>
      actuales.filter((libro) => libro.id !== id)
    )
  }

  // ====================================================
  // REGISTRAR PRÉSTAMOS Y DEVOLUCIONES
  // Actualiza los ejemplares prestados y disponibles.
  // Evita prestar libros sin existencias y devolver
  // libros que no tienen préstamos pendientes.
  // ====================================================

  function cambiarPrestamo(libro, operacion) {

    // Comprueba si existen ejemplares disponibles para prestar.
    if (
      operacion === 'prestar' &&
      libro.cantidad <= libro.prestados
    ) {
      alert('No hay ejemplares disponibles.')
      return
    }

    // Comprueba si existen préstamos pendientes de devolución.
    if (operacion === 'devolver' && libro.prestados <= 0) {
      alert('No hay préstamos pendientes de devolución.')
      return
    }

    // Actualiza la cantidad de ejemplares prestados del libro seleccionado.
    setLibros((actuales) =>
      actuales.map((actual) => {
        if (actual.id !== libro.id) return actual

        return {
          ...actual,
          prestados:
            operacion === 'prestar'
              ? actual.prestados + 1
              : actual.prestados - 1,
        }
      })
    )
  }

  // ====================================================
  // ESTRUCTURA VISUAL PRINCIPAL
  // Contiene la barra lateral, el menú de navegación
  // y el área donde se muestran las diferentes secciones.
  // ====================================================

  return (
    <div className="sistema">

      {/* ==================================================
          BARRA LATERAL
          Muestra la identificación de la biblioteca,
          las opciones de navegación y el estado del sistema.
      ================================================== */}

      {/* Menú lateral de navegación de Bibliohub */}
<Sidebar
  seccion={seccion}
  setSeccion={setSeccion}
/>

      {/* ==================================================
          ÁREA PRINCIPAL DE CONTENIDO
          Muestra una sección diferente dependiendo
          de la opción seleccionada en el menú lateral.
      ================================================== */}

      <main className="contenido" id="inicio">

        {/* ==================================================
            GESTIÓN DE LECTORES
            Muestra el componente encargado de registrar,
            consultar, editar y eliminar lectores.
        ================================================== */}

        {seccion === 'lectores' ? (
          <Lectores />

        ) : seccion === 'dashboard' ? (

  <Dashboard
    libros={libros}
    totalDisponibles={totalDisponibles}
    totalPrestados={totalPrestados}
  />

       ) : (

  <CatalogoLibros
    mostrarFormulario={mostrarFormulario}
    guardarLibro={guardarLibro}
    editandoId={editandoId}
    formulario={formulario}
    setFormulario={setFormulario}
    mensaje={mensaje}
    setMensaje={setMensaje}
    setMostrarFormulario={setMostrarFormulario}
    abrirNuevoFormulario={abrirNuevoFormulario}
    busqueda={busqueda}
    setBusqueda={setBusqueda}
    librosFiltrados={librosFiltrados}
    libros={libros}
    editarLibro={editarLibro}
    cambiarPrestamo={cambiarPrestamo}
    eliminarLibro={eliminarLibro}
    totalEjemplares={totalEjemplares}
  /> 
  )}
      </main>

    </div>
  )
}
export default App