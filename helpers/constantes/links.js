//--> Crear usuario
export const nuevoAdmin = "http://localhost:4444/api/administradores"
export const validarToken = "http://localhost:4444/api/administradores/confirmar/"

//--> Iniciar sesion
export const iniciarSesion = "http://localhost:4444/api/administradores/login"

//--> Resetear password
export const resetearPassword = "http://localhost:4444/api/administradores/olvide-password"
export const tokenResetearPassword = "http://localhost:4444/administradores/olvide-password/"
export const cambiarPassword = "http://localhost:4444/api/administradores/olvide-password/"

//--> Funciones crud de catalogo 'producto'
export const consultarProductos = "http://localhost:4444/api/productos/verProductos"
export const editarProducto = "http://localhost:4444/api/productos/modificarProducto/"
export const nuevoProducto = "http://localhost:4444/api/productos/registrarProducto"
export const eliminarProducto = "http://localhost:4444/api/productos/eliminarProducto/"


//--> Lista de dropdowns
export const listaCategoriasPlantas ="http://localhost:4444/api/productos/verProductos"


//--> Endpoints de pedidos
export const consultarPedidos = "http://localhost:4444/api/administrador/pedidos/mostrarPedidos"
export const consultarPedidosCancelados = "http://localhost:4444/api/administrador/pedidos/mostrarPedidosCancelados"

//---> Validación de médicos

export const validarDoctores = "http://localhost:4444/api/doctores/aceptarDoctor"