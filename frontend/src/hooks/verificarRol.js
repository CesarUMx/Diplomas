import { useState, useEffect } from "react";
import { getBackendURL } from "../utils/url";

const URL_BACKEND_ME = getBackendURL("/auth/me");

const useVerificarRol = (rolesPermitidos) => {
    const [rol, setRol] = useState(null);
    const [rolLoading, setRolLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(URL_BACKEND_ME, {
                    method: "GET",
                    credentials: "include", // 🔥 Necesario para enviar cookies
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error("No autenticado");
                }

                const data = await response.json();
                setRol(data.rol);
            } catch (error) {
                console.error("Error obteniendo usuario:", error);
                setRol(null);
                window.location.href = "/Login"; // Redirigir al usuario
            } finally {
                setRolLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { rol, rolLoading, permitido: rolesPermitidos.includes(rol) };
};

export default useVerificarRol;
