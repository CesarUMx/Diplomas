import { LogOut } from "lucide-react";
import avatar from "../assets/default.png";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import logo from "../assets/logo.png";
import { getBackendURL } from "../utils/url";

const URL_BACKEND_ME = getBackendURL("/auth/me");
const URL_BACKEND_logout = getBackendURL("/auth/logout");
const NavDer = () => {

    const [user, setUser] = useState(null);
    const [rol, setRol] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(URL_BACKEND_ME, {
                    method: "GET",
                    credentials: "include", // 🔥 Necesario para enviar cookies
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                     throw new Error("No autenticado");
                     window.location.href = "/Login"; // Redirigir al usuario
                     return;
                    }

                const data = await response.json();
                
                setUser(data);
                setRol(data.rol);
            } catch (error) {
                console.error("Error obteniendo usuario:", error);
                setUser(null);
                setRol(null);
                window.location.href = "/Login"; // Redirigir al usuario
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch(URL_BACKEND_logout, {
                method: "POST",
                credentials: "include", // Para asegurarse de que se envíe la cookie
            });
    
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Intento manual de eliminar la cookie en frontend
            window.location.href = "/Login"; // Redirigir al usuario
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };

    return (

    <nav className="fixed top-0 left-0 w-full shadow-md z-50 px-4 py-2 flex items-center justify-between bg-stone-800">
        <div className="flex items-center gap-3">

        <Sidebar rol={rol} />
        <a href="/dashboard" className="text-2xl font-bold">
            <img src={logo.src} alt="Logo" className="h-10 w-auto" />
        </a>

        </div>
        <div className="flex items-center gap-3">
            <img src={user?.avatar || avatar.src} alt="Avatar" className="h-10 w-10 rounded-full" />
            <span className="text-gray-100 font-semibold">{user?.nombre}</span>
            <button onClick={handleLogout} className="p-2 rounded-md hover:bg-gray-100">
            <LogOut size={24} color="#e92438" />
            </button>
        </div>
    </nav> 
    );
    
};

export default NavDer;
