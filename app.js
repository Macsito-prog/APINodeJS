const express = require("express");
const sql = require("mssql/msnodesqlv8");
const cors = require("cors");

const app = express();
app.use(cors());

const config = {
  database: 'gestionComercial',
  server: 'DESKTOP-FDUSN85\\SQLEXPRESS',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

async function obtenerProductosPorProveedor(RUT_PROVEEDOR) {
    try {
      const conn = new sql.ConnectionPool(config);
      await conn.connect();
  
      const request = new sql.Request(conn);
      request.input("rutProveedor", sql.VarChar, RUT_PROVEEDOR); // Agregar el parámetro
      const resultado = await request.query(`
        SELECT PPP.RUT_PROVEEDOR, P.NOMBRE_PRODUCTO AS nombre_producto, PR.NOMBRE_PROVEEDOR AS nombre_proveedor
        FROM PRODUCTO_POR_PROVEEDOR AS PPP
        INNER JOIN PRODUCTO AS P ON P.ID_PRODUCTO = PPP.ID_PRODUCTO
        INNER JOIN PROVEEDOR AS PR ON PR.RUT_PROVEEDOR = PPP.RUT_PROVEEDOR
        WHERE PPP.RUT_PROVEEDOR = @rutProveedor
      `);
  
      await conn.close();
  
      return resultado.recordset;
    } catch (error) {
      console.log("Error al obtener los productos: ", error);
      return [];
    }
  }
  
  

async function obtenerTodosProductosPorProveedor() {
    try {
      const conn = new sql.ConnectionPool(config);
      await conn.connect();
  
      const request = new sql.Request(conn);
      const resultado = await request.query(`
      SELECT PPP.RUT_PROVEEDOR, P.NOMBRE_PRODUCTO AS nombre_producto, PR.NOMBRE_PROVEEDOR AS nombre_proveedor
      FROM PRODUCTO_POR_PROVEEDOR AS PPP
      INNER JOIN PRODUCTO AS P ON P.ID_PRODUCTO = PPP.ID_PRODUCTO
      INNER JOIN PROVEEDOR AS PR ON PR.RUT_PROVEEDOR = PPP.RUT_PROVEEDOR
    `);
  
      await conn.close();
  
      return resultado.recordset;
    } catch (error) {
      console.log("Error al obtener los productos: ", error);
      return [];
    }
  }



  app.get("/productosPorProveedor/:RUT_PROVEEDOR", async (req, res) => {
    try {
      const rutProveedor = req.params.RUT_PROVEEDOR; // Obtener el valor del parámetro
      const productos = await obtenerProductosPorProveedor(rutProveedor);
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  });
  

app.get('/productosPorProveedor', async(req, res)=>{
    try{
        const productos = await obtenerTodosProductosPorProveedor();
        res.json(productos);
    }catch(error){
        res.status(500).json({error:"Error al obtener todos los productos"})
    }
});



const port = 8088;
app.listen(port, () => {
  console.log(`API escuchando en el puerto ${port}`);
});
