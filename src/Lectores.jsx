import { useState, useEffect } from 'react';

function Lectores() {
  const [lectores, setLectores] = useState(() => {
    const datos = localStorage.getItem('biblioteca-lectores');
    return datos ? JSON.parse(datos) : [];
  });

  const [nombre, setNombre] = useState('');
  const [dni, setDni] = useState('');

  useEffect(() => {
    localStorage.setItem(
      'biblioteca-lectores',
      JSON.stringify(lectores)
    );
  }, [lectores]);

  function agregarLector(e) {
    e.preventDefault();

    if (nombre.trim() === '' || dni.trim() === '') {
      alert('Completa el nombre y el DNI');
      return;
    }

    const nuevoLector = {
      id: Date.now(),
      nombre: nombre,
      dni: dni
    };

    setLectores([...lectores, nuevoLector]);
    setNombre('');
    setDni('');
  }

  function eliminarLector(id) {
    setLectores(
      lectores.filter((lector) => lector.id !== id)
    );
  }

  return (
    <section className="contenedor-lectores">
      <h1>Gestión de lectores</h1>
      <p>Registra y administra los lectores de la biblioteca.</p>

      <form className="formulario-lectores" onSubmit={agregarLector}>
        <label>Nombre completo</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del lector"
        />

        <label>DNI</label>
        <input
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Número de DNI"
          maxLength={8}
        />

        <button type="submit">Registrar lector</button>
      </form>

      <h2>Lectores registrados: {lectores.length}</h2>

      {lectores.length === 0 ? (
        <p>No hay lectores registrados.</p>
      ) : (
        <ul className="lista-lectores">
          {lectores.map((lector) => (
            <li key={lector.id}>
              {lector.nombre} - DNI: {lector.dni}
              <button
                type="button"
                onClick={() => eliminarLector(lector.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
export default Lectores;
