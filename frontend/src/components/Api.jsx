import React, { useState, useEffect } from "react";

const HelloWorld = () => {
    const [data, setData] = useState("");

    const fetchData = async () => {
        const response = await fetch("http://172.18.0.35:3000");
        const data = await response.json();
        setData(data.mensaje);
    };
    useEffect(() => {
        fetchData();
    }, []);

    return <h1>{data ? data : "Cargando..."}</h1>;
};

export default HelloWorld;
