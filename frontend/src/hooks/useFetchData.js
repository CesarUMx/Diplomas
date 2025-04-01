import { useEffect, useState } from "react";
import { getBackendURL } from "../utils/url";

const useFetchData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const URL = getBackendURL(endpoint);

  useEffect(() => {
    fetchData();
  }, [URL]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(URL, { 
        credentials: "include", 
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(`Error al obtener datos de ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  return { data, fetchData, loading };
};

export default useFetchData;
