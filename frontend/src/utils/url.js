const URL_BACKEND = "https://83cb-189-206-100-66.ngrok-free.app";

export const getBackendURL = (path) => {
    return `${URL_BACKEND}${path}`;
};