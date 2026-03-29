import { useState } from "react";
import { crearProveedor, eliminarProveedor, actualizarProveedor } from "../../../services/catalogos/proveedores/proveedores.services";

const ProveedorView = ({ data, respuesta }) => {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [editandoId, setEditandoId] = useState(null);

    const guardar = async (e) => {
        e.preventDefault();
        const proveedorData = { nombre, telefono, estado: 1 };    
        
        try {
            if (editandoId) {
                await actualizarProveedor(editandoId, proveedorData);
            } else {
                await crearProveedor(proveedorData);
            }
            cancelarEdicion();
            respuesta();
        } catch (error) {
            console.error("Error en la operación:", error);
            alert("Ocurrió un error al guardar el proveedor");
        }
    };

    const prepararEdicion = (proveedor) => {
        setNombre(proveedor.nombre);
        setTelefono(proveedor.telefono);
        setEditandoId(proveedor.id);
    };

    const cancelarEdicion = () => {
        setNombre('');
        setTelefono('');
        setEditandoId(null);
    };

    const borrar = async (id) => {
        if (confirm("¿Eliminar este proveedor?")) {
            await eliminarProveedor(id);

            await respuesta(); 
            
        }
    };

    const btnStyle = {
        color: 'white',
        border: 'none',
        padding: '5px 10px', 
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    };

    return (
        <div className="view-container">
            <form onSubmit={guardar} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    placeholder="Nombre Proveedor" 
                    required 
                    className="form-control" 
                />
                <input 
                    value={telefono} 
                    onChange={e => setTelefono(e.target.value)} 
                    placeholder="Teléfono" 
                    required 
                    className="form-control" 
                />
                
                <button 
                    type="submit" 
                    className={editandoId ? "btn-warning" : "btn-primary"}
                    style={{ ...btnStyle, backgroundColor: editandoId ? '#ffa500' : '#007bff' }}
                >
                    {editandoId ? "Actualizar Proveedor" : "Agregar Proveedor"}
                </button>

                {editandoId && (
                    <button 
                        type="button" 
                        onClick={cancelarEdicion} 
                        className="btn-secondary"
                        style={{ ...btnStyle, backgroundColor: '#6c757d' }}
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th style={{ padding: '10px' }}>Nombre</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map(p => (
                            <tr key={p.id} style={{ textAlign: 'center' }}>
                                <td style={{ padding: '8px' }}>{p.nombre}</td>
                                <td>{p.telefono}</td>
                                <td style={{ display: 'flex', gap: '5px', justifyContent: 'center', padding: '5px' }}>
                                    
                                    <button 
                                        onClick={() => prepararEdicion(p)}
                                        style={{ ...btnStyle, backgroundColor: '#ffa500' }}
                                    >
                                        Editar
                                    </button>

                                    <button 
                                        onClick={() => borrar(p.id)}
                                        style={{ ...btnStyle, backgroundColor: 'red' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No hay proveedores registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProveedorView;