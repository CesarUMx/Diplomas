import React, { useState } from "react";
import { Undo2, Menu, Users, NotepadTextDashed, ScrollText } from "lucide-react";

const Sidebar = ({ rol }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Botón de hamburguesa */}
            <button
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu color="#ffffff" />
            </button>

            {/* Menú lateral */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-stone-800 shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
                <h2 className="text-xl font-bold p-4 flex items-center justify-between text-white">
                    Menú
                <button
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Undo2 color="#ffffff" />
                </button>
                </h2>
                <ul className="space-y-1">
                    <li>
                        <a href="/plantillas" className="block bg-stone-800/10 text-white px-4 py-2 text-center hover:bg-stone-600 transition items-center flex justify-center">
                            <NotepadTextDashed size={18} color="#ffffff" /> <span className="ml-3">Plantillas</span>
                        </a>
                    </li>
                    <li>
                        <a href="/diplomas" className="block bg-stone-800/10 text-white px-4 py-2 text-center hover:bg-stone-600 transition items-center flex justify-center">
                            <ScrollText size={18} color="#ffffff" /> <span className="ml-3">Diplomas</span>
                        </a>
                    </li>
                    {rol === 1 && (
                        <li>
                            <a href="/Usuarios" className="block bg-stone-800/10 text-white px-4 py-2 text-center hover:bg-stone-600 transition items-center flex justify-center">  
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
