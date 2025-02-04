import useVerificarRol from "../hooks/verificarRol";

const UsuariosC = () => {
    const { rol, loading, permitido } = useVerificarRol([1]); // Solo permite el rol 1

    if (loading) return <p>Cargando...</p>; // Evitar parpadeo antes de cargar

    if (!permitido) {
        return <p>No tienes permisos para acceder a esta página.</p>;
    }

    return (
        <div>
            <h1>Usuarios</h1>
            <p>Contenido de la página de usuarios.</p>
        </div>
    );
};

export default UsuariosC;
