import React, { useState } from "react";
import { Undo2, Menu, Users, NotepadTextDashed, ScrollText } from "lucide-react";
import "./menu.css";

const Sidebar = ({ rol }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Botón de hamburguesa */}
            <button
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu color="#FF4D00" />
            </button>

            {/* Menú lateral */}
            <div className={`fixed top-0 left-0 h-full w-64 blue_mondragon shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
                <h2 className="text-xl font-bold p-4 flex items-center justify-between text-white">
                    Menú
                <button
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Undo2 color="#FF4D00" />
                </button>
                </h2>
                <ul className="space-y-1">
                    <li>
                        <a href="/Plantillas" className="block text-white I_blue_mondragon px-4 py-2 text-center transition items-center flex justify-center">
                            <NotepadTextDashed size={18} color="#ffffff" /> <span className="ml-3">Plantillas</span>
                        </a>
                    </li>
                    <li>
                        <a href="/Diplomas" className="block text-white I_blue_mondragon px-4 py-2 text-center transition items-center flex justify-center">
                            <ScrollText size={18} color="#ffffff" /> <span className="ml-3">Diplomas</span>
                        </a>
                    </li>
                    {rol === 1 && (
                        <li>
                            <a href="/Usuarios" className="block text-white I_blue_mondragon px-4 py-2 text-center transition items-center flex justify-center">  
                                <Users color="#ffffff" size={18} /> <span className="ml-3">Usuarios</span>
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
