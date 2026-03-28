import { useState } from "react";
import { crearProveedor, eliminarProveedor } from "../../../services/catalogos/proveedores/proveedores.services";

const ProveedorView = ({ data, respuesta }) => {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');

    const guardar = async (e) => {
        e.preventDefault();
        await crearProveedor({ nombre, telefono, estado: 1 });
        setNombre(''); setTelefono(''); 
        respuesta(); 
    };

    const borrar = async (id) => {
        if (confirm("¿Eliminar?")) {
            await eliminarProveedor(id);
            respuesta();
        }
    };

    return (
        <div>
            <form onSubmit={guardar}>
                <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre Proveedor" required />
                <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" required />
                <button type="submit">Agregar Proveedor</button>
            </form>

            <table border="1" width="100%">
                <thead><tr><th>Nombre</th><th>Teléfono</th><th>Acciones</th></tr></thead>
                <tbody>
                    {data.map(p => (
                        <tr key={p.id}>
                            <td>{p.nombre}</td>
                            <td>{p.telefono}</td>
                            <td><button onClick={() => borrar(p.id)}>Eliminar</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProveedorView;