import React, { useState, useEffect } from "react";
import { getBackendURL } from "../utils/url";
import "./login.css";
import fondo from "../assets/fondo.jpg?url";

const LoginComponent = () => {

    const googleLoginURL = getBackendURL("/auth/google");

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
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${fondo})` }}>
            <div className="bg-stone-950 shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4 text-white">Inicio de Sesión con:</h1>
                
                 {/* Mostrar la alerta si hay un error */}
                 {errorMessage && (
                     <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-2 rounded mb-4 text-center">
                         {errorMessage}
                     </div>
                 )}
                <div className="light-button">
                    <a href={googleLoginURL} className="bt">
                        <div className="light-holder">
                        <div className="dot"></div>
                        <div className="light"></div>
                        </div>
                        <div className="button-holder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" role="img">
                                <path fillRule="evenodd" d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z" clipRule="evenodd"/>
                            </svg>
                            <p>Google</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
     );
};

export default LoginComponent;
