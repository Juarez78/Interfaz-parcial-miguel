const url = import.meta.env.VITE_URL_BACK;

const getProveedores = async () => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/proveedores`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' 
            }
        });

        const res = await response.json();
        
        if (res && res.data) {
            return res.data;
        }
        
        if (Array.isArray(res)) {
            return res;
        }

        return []; 
    } catch (error) {
        console.error("Error al obtener proveedores:", error.message);
        return []; 
    }
}

const crearProveedor = async (objetoData) => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/proveedores`, {
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
        console.error("Error al crear proveedor:", error.message);
        return { status: false, errors: { connection: ["Error de red"] } };
    }
}

const eliminarProveedor = async (id) => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`${url}/proveedores/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        return await response.json();
    } catch (error) {
        console.error("Error al eliminar proveedor:", error.message);
        return { status: false };
    }
}

export { getProveedores, crearProveedor, eliminarProveedor };