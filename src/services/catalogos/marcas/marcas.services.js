const url = import.meta.env.VITE_URL_BACK;

const getMarcas = async () => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/marcas`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
      
        return data; 
    } catch (error) {
        console.error("Error al obtener marcas:", error.message);
        return [];
    }
}

const crearMarca = async (dataObjeto) => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/marcas`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(dataObjeto)
        });
        
        const res = await response.json();
        
    
        return res; 
    } catch (error) {
        console.error("Error al crear:", error.message);
    }
}

const eliminarMarca = async (id) => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/marcas/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error al eliminar:", error.message);
    }
}

const actualizarMarca = async (id, dataObjeto) => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/marcas/${id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(dataObjeto)
        });
        return await response.json();
    } catch (error) {
        console.error("Error al actualizar:", error.message);
    }
}

export { getMarcas, crearMarca, eliminarMarca, actualizarMarca };