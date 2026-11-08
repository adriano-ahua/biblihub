
// Componente que muestra el resumen general de la biblioteca.
// Recibe los datos desde App.jsx mediante props.

function Dashboard({ libros, totalDisponibles, totalPrestados }) {
  return (
    <>
      {/* Encabezado de la sección Dashboard */}
      <header className="encabezado">
        <div>
          <p className="sobretitulo">ADMINISTRACIÓN</p>
          <h1>Dashboard</h1>
          <p className="subtitulo">
            Resumen general de tu biblioteca.
          </p>
        </div>
      </header>

      {/* Tarjetas con los indicadores generales de la biblioteca */}
      <section className="tarjetas">

        {/* Tarjeta que muestra la cantidad de títulos registrados */}
        <article className="tarjeta">
          <div className="tarjeta-superior">
            <span>Total de títulos</span>
            <span className="tarjeta-icono azul">▤</span>
          </div>

          <h2>{libros.length}</h2>
          <p>Libros diferentes registrados</p>
        </article>

        {/* Tarjeta que muestra los ejemplares disponibles */}
        <article className="tarjeta">
          <div className="tarjeta-superior">
            <span>Ejemplares disponibles</span>
            <span className="tarjeta-icono verde">✓</span>
          </div>

          <h2>{totalDisponibles}</h2>
          <p>Listos para préstamo</p>
        </article>

        {/* Tarjeta que muestra los ejemplares actualmente prestados */}
        <article className="tarjeta">
          <div className="tarjeta-superior">
            <span>Ejemplares prestados</span>
            <span className="tarjeta-icono naranja">↗</span>
          </div>

          <h2>{totalPrestados}</h2>
          <p>Actualmente fuera de biblioteca</p>
        </article>

      </section>

      {/* Pie de página del Dashboard */}
      <footer className="pie-pagina">
        Sistema de Gestión de Biblioteca · Proyecto académico
      </footer>
    </>
  );
}
export default Dashboard;
