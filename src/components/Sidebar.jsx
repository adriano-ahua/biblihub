// COMPONENTE SIDEBAR
// Muestra el menú lateral y permite navegar
// entre las diferentes secciones de la pagina.

function Sidebar({ seccion, setSeccion }) {
  return (
    <aside className="sidebar">

      {/* Logotipo y nombre del sistema */}
      <div className="marca">
        <span className="marca-icono">B</span>
        <div>
          <strong>Biblioteca</strong>
          <small>Sistema de gestión</small>
        </div>
      </div>

      {/* Título del menú */}
      <p className="menu-titulo">MENÚ PRINCIPAL</p>

      {/* Opciones de navegación */}
      <nav className="menu">

        {/* Acceso al Dashboard */}
        <a
          href="#inicio"
          className={`menu-link ${seccion === 'dashboard' ? 'activo' : ''}`}
          onClick={() => setSeccion('dashboard')}
        >
          <span>▦</span> Dashboard
        </a>

        {/* Acceso a Gestión de libros */}
        <a
          href="#libros"
          className={`menu-link ${seccion === 'libros' ? 'activo' : ''}`}
          onClick={() => setSeccion('libros')}
        >
          <span>▤</span> Gestión de libros
        </a>

        {/* Acceso a Gestión de lectores */}
        <a
          href="#lectores"
          className={`menu-link ${seccion === 'lectores' ? 'activo' : ''}`}
          onClick={() => setSeccion('lectores')}
        >
          <span>👥</span> Gestión de lectores
        </a>

      </nav>

      {/* Indicador de funcionamiento del sistema */}
      <div className="sidebar-pie">
        <span className="estado-punto" />
        Sistema en funcionamiento
      </div>

    </aside>
  )
}
export default Sidebar
