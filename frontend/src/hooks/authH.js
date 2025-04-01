import { useState, useEffect } from "react";
import { getBackendURL } from "../utils/url";

const URL_BACKEND_ME = getBackendURL("/auth/me");

const useVerificarUsuario = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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
                    window.location.href = "/Login"; // Redirigir al usuario
                    return;
                   }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error obteniendo usuario:", error);
                setUser(null);
                window.location.href = "/Login"; // Redirigir al usuario
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return { user, loading };
};

export default useVerificarUsuario;
