// Componente que muestra y administra el catálogo de libros.
// Recibe desde App.jsx los datos y las funciones necesarias.

function CatalogoLibros({
  mostrarFormulario,
  guardarLibro,
  editandoId,
  formulario,
  setFormulario,
  mensaje,
  setMostrarFormulario,
  abrirNuevoFormulario,
  busqueda,
  setBusqueda,
  librosFiltrados,
  libros,
  editarLibro,
  cambiarPrestamo,
  eliminarLibro,
  totalEjemplares
}) {
  return (
    <>
      {/* Encabezado y perfil del administrador */}
      <header className="encabezado">
        <div>
          <p className="sobretitulo">ADMINISTRACIÓN</p>
          <h1>Gestión de libros</h1>
          <p className="subtitulo">
            Administra el catálogo de tu biblioteca.
          </p>
        </div>

        {/* Información visual del administrador */}
        <div className="perfil">
          <div className="avatar">A</div>
          <div>
            <strong>Administrador</strong>
            <small>Panel principal</small>
          </div>
        </div>
      </header>

      {/* Panel principal del catálogo */}
      <section className="panel" id="libros">

        {/* Título del catálogo y botón para registrar libros */}
        <div className="panel-encabezado">
          <div>
            <h2>Catálogo de libros</h2>
            <p>
              Registra y administra los ejemplares de tu biblioteca.
            </p>
          </div>

          <button
            className="boton-principal"
            onClick={abrirNuevoFormulario}
          >
            + Nuevo libro
          </button>
        </div>

        {/* Formulario para registrar o editar libros */}
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
                      titulo: e.target.value
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
                      autor: e.target.value
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
                      isbn: e.target.value
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
                      categoria: e.target.value
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
                      cantidad: e.target.value
                    })
                  }
                  required
                />
              </label>
            </div>

            {/* Mensajes de validación o confirmación */}
            {mensaje && <p className="mensaje">{mensaje}</p>}

            {/* Botones para cancelar o guardar */}
            <div className="acciones-formulario">
              <button
                type="button"
                className="boton-secundario"
                onClick={() => {
                  setMostrarFormulario(false);
                  // Limpia el mensaje al cancelar.
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

        {/* Barra de búsqueda del catálogo */}
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

        {/* Tabla con los libros registrados */}
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
                // Calcula los ejemplares disponibles de cada libro.
                const disponibles = libro.cantidad - libro.prestados;

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

                    {/* Acciones disponibles para cada libro */}
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
                          onClick={() => cambiarPrestamo(libro, 'prestar')}
                          disabled={disponibles === 0}
                          title="Registrar un préstamo"
                        >
                          Prestar
                        </button>

                        <button
                          className="boton-accion devolver"
                          onClick={() => cambiarPrestamo(libro, 'devolver')}
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
                );
              })}

              {/* Mensaje cuando la búsqueda no encuentra resultados */}
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

        {/* Resumen de resultados y ejemplares */}
        <p className="pie-tabla">
          Mostrando {librosFiltrados.length} de {libros.length} títulos.
          Total de ejemplares: {totalEjemplares}.
        </p>
      </section>

      {/* Pie de página de Gestión de libros */}
      <footer className="pie-pagina">
        Sistema de Gestión de Biblioteca · Proyecto académico
      </footer>
    </>
  );
}
export default CatalogoLibros;