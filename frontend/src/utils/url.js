const URL_BACKEND = "http://localhost:3000";

export const getBackendURL = (path) => {
    return `${URL_BACKEND}${path}`;
};

export const getArchivoURL = (nombreArchivo) => {
    return `${URL_BACKEND}/plantillas/archivo/${nombreArchivo}`;
};