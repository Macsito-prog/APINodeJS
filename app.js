const express = require("express");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");

const app = express();
app.use(express.json())
app.use(cors());

const config = {
  database: 'gestionComercial',
  server: 'DESKTOP-FDUSN85\\SQLEXPRESS',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};



// async function obtenerProductosPorProveedor(RUT_PROVEEDOR) {
//     try {
//       const conn = new sql.ConnectionPool(config);
//       await conn.connect();
  
//       const request = new sql.Request(conn);
//       request.input("rutProveedor", sql.VarChar, RUT_PROVEEDOR); // Agregar el parámetro
//       const resultado = await request.query(`
//         SELECT PPP.RUT_PROVEEDOR, P.NOMBRE_PRODUCTO AS nombre_producto, PR.NOMBRE_PROVEEDOR AS nombre_proveedor
//         FROM PRODUCTO_POR_PROVEEDOR AS PPP
//         INNER JOIN PRODUCTO AS P ON P.ID_PRODUCTO = PPP.ID_PRODUCTO
//         INNER JOIN PROVEEDOR AS PR ON PR.RUT_PROVEEDOR = PPP.RUT_PROVEEDOR
//         WHERE PPP.RUT_PROVEEDOR = @rutProveedor
//       `);
  
//       await conn.close();
//       return resultado.recordset;
//     } catch (error) {
//       console.log("Error al obtener los productos: ", error);
//       return [];
//     }
//   }
  
  

// async function obtenerTodosProductosPorProveedor() {
//     try {
//       const conn = new sql.ConnectionPool(config);
//       await conn.connect();
  
//       const request = new sql.Request(conn);
//       const resultado = await request.query(`
//       SELECT PPP.RUT_PROVEEDOR, P.NOMBRE_PRODUCTO AS nombre_producto, PR.NOMBRE_PROVEEDOR AS nombre_proveedor
//       FROM PRODUCTO_POR_PROVEEDOR AS PPP
//       INNER JOIN PRODUCTO AS P ON P.ID_PRODUCTO = PPP.ID_PRODUCTO
//       INNER JOIN PROVEEDOR AS PR ON PR.RUT_PROVEEDOR = PPP.RUT_PROVEEDOR
//     `);
  
//       await conn.close();
  
//       return resultado.recordset;
//     } catch (error) {
//       console.log("Error al obtener los productos: ", error);
//       return [];
//     }
//   }


// //ruta para los productos por proveedor
//   app.get("/productosPorProveedor/:RUT_PROVEEDOR", async (req, res) => {
//     try {
//       const rutProveedor = req.params.RUT_PROVEEDOR; // Obtener el valor del parámetro
//       const productos = await obtenerProductosPorProveedor(rutProveedor);
//       res.json(productos);
//     } catch (error) {
//       res.status(500).json({ error: "Error al obtener los productos" });
//     }
//   });
  

//   //ruta para obtener un listado de todos los productos

// app.get('/productosPorProveedor', async(req, res)=>{
//     try{
//         const productos = await obtenerTodosProductosPorProveedor();
//         res.json(productos);
//     }catch(error){
//         res.status(500).json({error:"Error al obtener todos los productos"})
//     }
// });


// ...

async function agregarOrdenCompra(rutProveedor) {
  try {
    const conn = new sql.ConnectionPool(config);
    await conn.connect();

    const request = new sql.Request(conn);
    request.input("rutProveedor", sql.VarChar, rutProveedor);
    const resultado = await request.query(`
      INSERT INTO PRODUCTO_POR_PROVEEDOR (RUT_PROVEEDOR)
      VALUES (@rutProveedor)
    `);

    await conn.close();

    return resultado;
  } catch (error) {
    console.log("Error al agregar el producto: ", error);
    throw error;
  }
}

// Ruta para agregar una orden de compra
app.post("/agregarOrdenCompra", async (req, res) => {
  try {
    const rutProveedor = req.body.rutProveedor; // Obtener el valor del parámetro del cuerpo de la solicitud
    await agregarOrdenCompra(rutProveedor);
    res.status(200).json({ message: "Orden de Compra generada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al generar la Orden de Compra" });
  }
});

// ...


async function obtenerOrdenCompraPorProveedor(rutProveedor) {
  try {
    const conn = new sql.ConnectionPool(config);
    await conn.connect();

    const request = new sql.Request(conn);
    request.input("rutProveedor", sql.VarChar, rutProveedor);
    const resultado = await request.query(`
      SELECT ID_ORDEN_COMPRA, RUT_PROVEEDOR, FECHA_ORDEN_COMPRA
      FROM ORDEN_COMPRA
      WHERE RUT_PROVEEDOR = @rutProveedor
    `);

    await conn.close();

    return resultado.recordset;
  } catch (error) {
    console.log("Error al obtener la orden de compra: ", error);
    throw error;
  }
}

// Ruta para obtener una orden de compra por su RUT de proveedor
app.get("/ordenCompraPorProveedor/:rutProveedor", async (req, res) => {
  try {
    const rutProveedor = req.params.rutProveedor;
    const ordenCompra = await obtenerOrdenCompraPorProveedor(rutProveedor);
    res.json(ordenCompra);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la orden de compra" });
  }
});



// ...

async function agregarProducto(rutProveedor) {
  try {
    const conn = new sql.ConnectionPool(config);
    await conn.connect();

    const request = new sql.Request(conn);
    request.input("rutProveedor", sql.VarChar, rutProveedor);
    const resultado = await request.query(`
      INSERT INTO PRODUCTO_POR_PROVEEDOR (RUT_PROVEEDOR)
      VALUES (@rutProveedor)
    `);

    await conn.close();

    return resultado;
  } catch (error) {
    console.log("Error al agregar el producto: ", error);
    throw error;
  }
}

// Ruta para agregar una Orden de Compra
app.post("/agregarOrdenCompra", async (req, res) => {
  try {
    const rutProveedor = req.body.rutProveedor; // Obtener el valor del parámetro del cuerpo de la solicitud
    await agregarProducto(rutProveedor);
    res.status(200).json({ message: "Orden de Compra generada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al generar la Orden de Compra" });
  }
});

// ...


async function obtenerOrdenCompraPorProveedor(rutProveedor) {
  try {
    const conn = new sql.ConnectionPool(config);
    await conn.connect();

    const request = new sql.Request(conn);
    request.input("rutProveedor", sql.VarChar, rutProveedor);
    const resultado = await request.query(`
      SELECT ID_ORDEN_COMPRA, RUT_PROVEEDOR, FECHA_ORDEN_COMPRA
      FROM ORDEN_COMPRA
      WHERE RUT_PROVEEDOR = @rutProveedor
    `);

    await conn.close();

    return resultado.recordset;
  } catch (error) {
    console.log("Error al obtener la orden de compra: ", error);
    throw error;
  }
}

// Ruta para obtener una orden de compra por su RUT de proveedor
app.get("/ordenCompraPorProveedor/:rutProveedor", async (req, res) => {
  try {
    const rutProveedor = req.params.rutProveedor;
    const ordenCompra = await obtenerOrdenCompraPorProveedor(rutProveedor);
    res.json(ordenCompra);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la orden de compra" });
  }
});


async function obtenerDetallesOrdenCompraPorProveedor(rutProveedor) {
  try {
    const conn = new sql.ConnectionPool(config);
    await conn.connect();

    const request = new sql.Request(conn);
    request.input("rutProveedor", sql.VarChar, rutProveedor);
    const resultado = await request.query(`
      SELECT DOC.ID_DETALLE_ORDEN, DOC.ID_ORDEN_COMPRA, DOC.ID_PRODUCTO, DOC.CANTIDAD, DOC.PRECIO
      FROM detalle_orden_compra AS DOC
      INNER JOIN orden_compra AS OC ON OC.ID_ORDEN_COMPRA = DOC.ID_ORDEN_COMPRA
      WHERE OC.RUT_PROVEEDOR = @rutProveedor
    `);

    await conn.close();

    return resultado.recordset;
  } catch (error) {
    console.log("Error al obtener los detalles de la orden de compra: ", error);
    throw error;
  }
}

// Ruta para obtener los detalles de la orden de compra por el RUT de proveedor
app.get("/detallesOrdenCompraPorProveedor/:rutProveedor", async (req, res) => {
  try {
    const rutProveedor = req.params.rutProveedor;
    const detallesOrdenCompra = await obtenerDetallesOrdenCompraPorProveedor(rutProveedor);
    res.json(detallesOrdenCompra);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los detalles de la orden de compra" });
  }
});




// Ruta para agregar un detalle de orden de compra
app.post("/detalleOrdenCompra", async (req, res) => {
  try {
    const { idOrdenCompra, idProducto, cantidad, precio } = req.body;

    const conn = new sql.ConnectionPool(config);
    await conn.connect();

    const request = new sql.Request(conn);
    request.input("idOrdenCompra", sql.Int, idOrdenCompra);
    request.input("idProducto", sql.Int, idProducto);
    request.input("cantidad", sql.Int, cantidad);
    request.input("precio", sql.Decimal, precio);

    const resultado = await request.query(`
      INSERT INTO detalle_orden_compra (ID_ORDEN_COMPRA, ID_PRODUCTO, CANTIDAD, PRECIO)
      VALUES (@idOrdenCompra, @idProducto, @cantidad, @precio)
    `);

    await conn.close();
    
    res.status(200).json({ message: "Detalle de orden de compra agregado exitosamente" });
    return resultado.recordset;
    
  } catch (error) {
    console.log("Error al agregar el detalle de orden de compra: ", error);
    res.status(500).json({ error: "Error al agregar el detalle de orden de compra" });
  }
});









const port = 8088;
app.listen(port, () => {
  console.log(`API escuchando en la url http://localhost:${port}`);
});



