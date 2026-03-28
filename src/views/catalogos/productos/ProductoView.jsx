import { useState, useEffect } from "react";
import { crearProducto, eliminarProducto } from "../../../services/catalogos/productos/productos.services";
import { getMarcas } from "../../../services/catalogos/marcas/marcas.services";
import { getProveedores } from "../../../services/catalogos/proveedores/proveedores.services";

const ProductoView = ({ data, respuesta }) => {
    const [marcas, setMarcas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({ nombre: '', precio: '', stock: '', marca_id: '', proveedor_id: '' });

    useEffect(() => {
        const cargarSelects = async () => {
            setMarcas(await getMarcas() || []);
            setProveedores(await getProveedores() || []);
        };
        cargarSelects();
    }, []);

    const guardar = async (e) => {
        e.preventDefault();
        await crearProducto(form);
        setForm({ nombre: '', precio: '', stock: '', marca_id: '', proveedor_id: '' });
        respuesta();
    };

    return (
        <div>
            <form onSubmit={guardar} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} placeholder="Producto" required />
                <input type="number" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} placeholder="Precio" required />
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} placeholder="Stock" required />
                
                <select value={form.marca_id} onChange={e => setForm({...form, marca_id: e.target.value})} required>
                    <option value="">Marca</option>
                    {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                </select>

                <select value={form.proveedor_id} onChange={e => setForm({...form, proveedor_id: e.target.value})} required>
                    <option value="">Proveedor</option>
                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>

                <button type="submit">Agregar Producto</button>
            </form>

            <table border="1" width="100%">
                <thead><tr><th>Nombre</th><th>Precio</th><th>Marca</th><th>Proveedor</th><th>Acciones</th></tr></thead>
                <tbody>
                    {data.map(prod => (
                        <tr key={prod.id}>
                            <td>{prod.nombre}</td>
                            <td>${prod.precio}</td>
                            <td>{prod.marca?.nombre}</td>
                            <td>{prod.proveedor?.nombre}</td>
                            <td>
                                <button onClick={async () => { 
                                    if(confirm("¿Eliminar?")) { await eliminarProducto(prod.id); respuesta(); } 
                                }} style={{ color: 'red' }}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default ProductoView;