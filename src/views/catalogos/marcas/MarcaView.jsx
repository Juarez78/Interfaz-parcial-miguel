import { useState } from "react";
import { crearMarca, eliminarMarca, actualizarMarca } from "../../../services/catalogos/marcas/marcas.services";

const MarcaView = ({ data, respuesta }) => {
    const [nombre, setNombre] = useState('');
    const [editandoId, setEditandoId] = useState(null); // Estado para rastrear si editamos

    const guardar = async (e) => {
        e.preventDefault();

        const marcaData = { 
            nombre: nombre, 
            estado: true
        };

        try {
            let res;
            if (editandoId) {
              
                res = await actualizarMarca(editandoId, marcaData);
            } else {
              
                res = await crearMarca(marcaData);
            }

            if (res && res.errors) {
                alert("Error de validación: " + JSON.stringify(res.errors));
            } else {
                cancelarEdicion();
                respuesta(); 
            }
        } catch (error) {
            console.error("Error en la operación:", error);
            alert("No se pudo conectar con el servidor");
        }
    };

    const prepararEdicion = (marca) => {
        setNombre(marca.nombre);
        setEditandoId(marca.id);
    };

    const cancelarEdicion = () => { 
        setNombre('');
        setEditandoId(null);
    };

    return (
        <div className="view-container">
            <form onSubmit={guardar} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    placeholder="Nombre de la marca" 
                    required 
                    className="form-control"
                />
                <button type="submit" className={editandoId ? "btn-warning" : "btn-primary"}>
                    {editandoId ? "Actualizar Marca" : "Agregar Marca"}
                </button>
                {editandoId && (
                    <button type="button" onClick={cancelarEdicion} className="btn-secondary">
                        Cancelar
                    </button>
                )}
            </form>

            <table border="1" width="100%" style={{ borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f2f2f2' }}>
                    <tr>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map(m => (
                            <tr key={m.id} style={{ textAlign: 'center' }}>
                                <td style={{ padding: '8px' }}>{m.id}</td>
                                <td>{m.nombre}</td>
                                <td style={{ display: 'flex', gap: '5px', justifyContent: 'center', padding: '5px' }}>
                                   
                                    <button 
                                        onClick={() => prepararEdicion(m)}
                                        style={{ color: 'white', backgroundColor: '#ffa500', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Editar
                                    </button>

                                  
                                    <button 
                                        onClick={async () => { 
                                            if(confirm(`¿Deseas eliminar la marca "${m.nombre}"?`)) { 
                                                await eliminarMarca(m.id); 
                                                await respuesta(); 
                                            } 
                                        }} 
                                        style={{ color: 'white', backgroundColor: 'red', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No hay marcas registradas.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MarcaView;