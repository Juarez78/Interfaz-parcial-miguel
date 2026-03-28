import { useState, useEffect } from 'react'
import './utils/css/app.css'

// Importación de Servicios
import { getMarcas } from './services/catalogos/marcas/marcas.services'
import { getProveedores } from './services/catalogos/proveedores/proveedores.services'
import { getProductos } from './services/catalogos/productos/productos.services'

// Importación de Vistas
import MarcaView from './views/catalogos/marcas/MarcaView'
import ProveedorView from './views/catalogos/proveedores/ProveedorView'
import ProductoView from './views/catalogos/productos/ProductoView'

function App() {
  const [listaMarcas, setListaMarcas] = useState([])
  const [listaProveedores, setListaProveedores] = useState([])
  const [listaProductos, setListaProductos] = useState([])

  const cargarTodo = async () => {
    try {
      // Cargamos todas las listas de la API simultáneamente
      const marcas = await getMarcas()
      const proveedores = await getProveedores()
      const productos = await getProductos()
      
      setListaMarcas(marcas || [])
      setListaProveedores(proveedores || [])
      setListaProductos(productos || [])
    } catch (error) {
      console.error("Error al cargar datos:", error.message)
    }
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  return (
    <div className="container">
      <h1>Panel de Administración - Parcial 2</h1>
      
      <hr />

      <section>
        <h2>Gestión de Marcas</h2>
        {/* MarcaView ahora incluye su propio formulario de agregar y la tabla */}
        <MarcaView data={listaMarcas} respuesta={cargarTodo} />
      </section>

      <hr />

      <section>
        <h2>Gestión de Proveedores</h2>
        {/* ProveedorView incluye su formulario y tabla */}
        <ProveedorView data={listaProveedores} respuesta={cargarTodo} />
      </section>

      <hr />

      <section>
        <h2>Gestión de Productos</h2>
        {/* ProductoView incluye el formulario con selects y la tabla principal */}
        <ProductoView data={listaProductos} respuesta={cargarTodo} />
      </section>
    </div>
  )
}

export default App