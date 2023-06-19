const express = require('express');
const app = express();
const sql = require('msnodesqlv8');

const bdconnect = {
  database: 'gestionComercial',
  server: 'DESKTOP-FDUSN85\\SQLEXPRESS',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

const connectionString = `Driver={SQL Server Native Client 11.0};Server=${bdconnect.server};Database=${bdconnect.database};Trusted_Connection=${bdconnect.options.trustedConnection ? 'Yes' : 'No'};`;


app.use(express.json())

//ruta para obtener las ordenes de compra

app.get('/datos', (req, res) => {
  const rutProveedor = req.query.rutProveedor;

  if (!rutProveedor) {
    return res.status(400).send('El parámetro "rutProveedor" es obligatorio');
  }

  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al conectar con la base de datos');
    }

    const query = `SELECT * FROM ORDEN_COMPRA WHERE RUT_PROVEEDOR = '${rutProveedor}'`;

    conn.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al ejecutar la consulta');
      }

      // Envía los resultados como respuesta al navegador
      res.json(rows);
      
      // Cierra la conexión después de usarla
      conn.close();
    });
  });
});

//ruta para obtener los detalles de la orden de compra.
app.get('/orden-compra/:idOrdenCompra/detalle', (req, res) => {
  const idOrdenCompra = req.params.idOrdenCompra;

  if (!idOrdenCompra) {
    return res.status(400).send("El parámetro es obligatorio");
  }

  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al conectar con la base de datos");
    }

    const query = `SELECT * FROM DETALLE_ORDEN_COMPRA WHERE ID_ORDEN_COMPRA = '${idOrdenCompra}'`;

    conn.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al ejecutar la consulta.");
      }

      res.json(rows);

      conn.close();
    });
  });
});
//RUTAS POST

//generar el detalle de una orden de compra
app.post('/orden-compra/:idOrdenCompra/detalle', (req, res) => {
  const idOrdenCompra = req.params.idOrdenCompra;
  const { ID_PRODUCTO, CANTIDAD } = req.body;

  if (!idOrdenCompra || !ID_PRODUCTO || !CANTIDAD) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  sql.open(connectionString, (err,conn)=>{
    if(err){
      console.error(err);
      return res.status(500).send("Error al conectar con la base de datos");
    }

    const query = `INSERT INTO DETALLE_ORDEN_COMPRA (ID_ORDEN_COMPRA, ID_PRODUCTO, CANTIDAD) VALUES (${idOrdenCompra}, ${ID_PRODUCTO}, ${CANTIDAD})`;

    conn.query(query, (err, rows)=>{
      if(err){
        console.error(err);
        return res.status(500).send("Error al ejecutar la consult.")
      }

      res.json({ message: "Detalle de la orden de compra agregado correctamente" });


      conn.close();
    })

  })


});






app.listen(8080, () => {
  console.log('Servidor: http://localhost:8080/datos');
});
