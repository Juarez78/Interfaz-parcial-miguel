const url = import.meta.env.VITE_URL_BACK;

const getProductos = async () => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/productos`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' 
            }
        });

        const res = await response.json();
        
       
        return res.data || []; 
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        return []; 
    }
}

const crearProducto = async (objetoData) => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/productos`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(objetoData)
        });

        
        return await response.json();
    } catch (error) {
        console.error("Error al crear producto:", error.message);
        return { status: false, errors: { connection: ["Error de red"] } };
    }
}

const eliminarProducto = async (id) => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/productos/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error al eliminar producto:", error.message);
    }
}

export { getProductos, crearProducto, eliminarProducto };