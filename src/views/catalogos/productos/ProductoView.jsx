import { useState, useEffect } from "react";
import { crearProducto, eliminarProducto, actualizarProducto } from "../../../services/catalogos/productos/productos.services";
import { getMarcas } from "../../../services/catalogos/marcas/marcas.services";
import { getProveedores } from "../../../services/catalogos/proveedores/proveedores.services";


const ProductoView = ({ data, respuesta }) => {
    // Estados para los selects
    const [marcas, setMarcas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    
    // Estado para saber si estamos editando (null = crear, id = editar)
    const [editandoId, setEditandoId] = useState(null);

    // Estado del formulario
    const [form, setForm] = useState({ 
        nombre: '', 
        precio: '', 
        stock: '', 
        marca_id: '', 
        proveedor_id: '',
        estado: true 
    });

    // Cargar marcas y proveedores al iniciar
    useEffect(() => {
        const cargarSelects = async () => {
            const m = await getMarcas();
            const p = await getProveedores();
            setMarcas(m || []);
            setProveedores(p || []);
        };
        cargarSelects();
    }, []);

    // Función para llenar el formulario con los datos a editar
    const prepararEdicion = (prod) => {
        setEditandoId(prod.id);
        setForm({
            nombre: prod.nombre,
            precio: prod.precio,
            stock: prod.stock,
            marca_id: prod.marca_id,
            proveedor_id: prod.proveedor_id,
            estado: prod.estado
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube al formulario
    };

    // Función para limpiar el formulario y salir del modo edición
    const cancelarEdicion = () => {
        setEditandoId(null);
        setForm({ nombre: '', precio: '', stock: '', marca_id: '', proveedor_id: '', estado: true });
    };

    const guardar = async (e) => {
        e.preventDefault();

        // Validamos que los IDs no estén vacíos
        if (!form.marca_id || !form.proveedor_id) {
            alert("Por favor selecciona una marca y un proveedor");
            return;
        }

        const objetoEnviar = {
            ...form,
            precio: Number(form.precio),
            stock: Number(form.stock),
            marca_id: Number(form.marca_id),
            proveedor_id: Number(form.proveedor_id)
        };

        try {
            let res;
            if (editandoId) {
                
                res = await actualizarProducto(editandoId, objetoEnviar);
            } else {
                res = await crearProducto(objetoEnviar);
            }

            if (res) {
                alert(editandoId ? "¡Producto actualizado!" : "¡Producto creado!");
                cancelarEdicion();
                await respuesta(); // Refresca la lista en App.jsx
            }
        } catch (error) {
            console.error("Error en la operación:", error);
            alert("Ocurrió un error en el servidor (500)");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3 style={{ color: editandoId ? '#e67e22' : '#2c3e50' }}>
                {editandoId ? `Editando: ${form.nombre}` : 'Agregar Nuevo Producto'}
            </h3>

            <form onSubmit={guardar} style={{ 
                marginBottom: '30px', 
                padding: '20px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                border: editandoId ? '2px solid #e67e22' : '1px solid #dee2e6'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <input 
                        value={form.nombre} 
                        onChange={e => setForm({...form, nombre: e.target.value})} 
                        placeholder="Nombre del Producto" 
                        required 
                    />
                    <input 
                        type="number" step="0.01"
                        value={form.precio} 
                        onChange={e => setForm({...form, precio: e.target.value})} 
                        placeholder="Precio" 
                        required 
                    />
                    <input 
                        type="number" 
                        value={form.stock} 
                        onChange={e => setForm({...form, stock: e.target.value})} 
                        placeholder="Stock" 
                        required 
                    />
                    
                    <select value={form.marca_id} onChange={e => setForm({...form, marca_id: e.target.value})} required>
                        <option value="">-- Seleccionar Marca --</option>
                        {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                    </select>

                    <select value={form.proveedor_id} onChange={e => setForm({...form, proveedor_id: e.target.value})} required>
                        <option value="">-- Seleccionar Proveedor --</option>
                        {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ 
                            flex: 1, 
                            backgroundColor: editandoId ? '#e67e22' : '#27ae60', 
                            color: 'white', 
                            padding: '10px', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            {editandoId ? 'Actualizar Producto' : 'Guardar Producto'}
                        </button>
                        
                        {editandoId && (
                            <button type="button" onClick={cancelarEdicion} style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#95a5a6', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px'
                            }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'center' }}>
                <thead style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Marca</th>
                        <th>Proveedor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(prod => (
                        <tr key={prod.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px' }}>{prod.nombre}</td>
                            <td>${prod.precio}</td>
                            <td>{prod.stock}</td>
                            <td>{prod.marca?.nombre || 'N/A'}</td>
                            <td>{prod.proveedor?.nombre || 'N/A'}</td>
                            <td>
                                <button 
                                    onClick={() => prepararEdicion(prod)} 
                                    style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={async () => { 
                                        if(confirm(`¿Eliminar ${prod.nombre}?`)) { 
                                            await eliminarProducto(prod.id); 
                                            await respuesta(); 
                                        } 
                                    }} 
                                    style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductoView;