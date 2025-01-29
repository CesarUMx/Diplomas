import React, { useState, useEffect } from "react";

const LoginComponent = () => {
    const googleLoginURL = "https://2c20-189-206-100-66.ngrok-free.app/auth/google"; // Reemplaza con tu URL de backend.

    // Estado para almacenar el mensaje de error
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        if (error) {
            setErrorMessage(decodeURIComponent(error));
        }
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">Inicio de Sesión</h1>
                <p className="text-gray-600 text-center mb-6">Inicia sesión con Google para acceder</p>
                
                {/* Mostrar la alerta si hay un error */}
                {errorMessage && (
                    <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded mb-4 text-center">
                        {errorMessage}
                    </div>
                )}

                <div className="text-center">
                    <a href={googleLoginURL} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.766 12.276c0-.854-.07-1.671-.198-2.463H12v4.92h6.737c-.308 1.68-1.26 3.1-2.66 4.064v3.338h4.296c2.52-2.338 3.98-5.774 3.98-9.86z" />
                            <path d="M12 24c3.24 0 5.946-1.08 7.93-2.918l-4.296-3.338c-1.2.808-2.72 1.294-4.33 1.294-3.34 0-6.18-2.264-7.2-5.296H.636v3.43C2.616 20.5 7.004 24 12 24z" />
                            <path d="M4.8 14.74a7.998 7.998 0 01-.694-2.582H.636v2.99C2.616 20.5 7.004 24 12 24v-4.92c-2.06 0-3.84-.688-5.2-1.84l-1.64 2.5z" />
                            <path d="M12 4.92a7.92 7.92 0 015.6 2.18l4.1-4.1C18.936 1.2 15.24 0 12 0 7.004 0 2.616 3.5.636 8.2l4.1 2.5c1.02-3.032 3.86-5.296 7.2-5.296z" />
                        </svg>
                        Iniciar sesión con Google
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
