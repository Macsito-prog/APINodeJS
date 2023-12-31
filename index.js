const express = require("express");
const app = express();
const sql = require("msnodesqlv8");
const cors = require('cors')

const bdconnect = {
  database: "gestionComercial",
  server: "G10V4NNY\\SQLEXPRESS",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

const connectionString = `Driver={SQL Server};Server=${
  bdconnect.server
};Database=${bdconnect.database};Trusted_Connection=${
  bdconnect.options.trustedConnection ? "Yes" : "No"
};`;

app.use(express.json());
app.use(cors());

//ruta para obtener las ordenes de compra

app.get("/datos", (req, res) => {
  const rutProveedor = req.query.rutProveedor;

  if (!rutProveedor) {
    return res.status(400).send('El parámetro "rutProveedor" es obligatorio');
  }

  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al conectar con la base de datos");
    }

    const query = `SELECT * FROM ORDEN_COMPRA WHERE RUT_PROVEEDOR = '${rutProveedor}'`;

    conn.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al ejecutar la consulta");
      }

      // Envía los resultados como respuesta al navegador
      res.json(rows);

      // Cierra la conexión después de usarla
      conn.close();
    });
  });
});

//ruta para obtener los detalles de la orden de compra según ID
app.get("/orden-compra/:idOrdenCompra/detalle", (req, res) => {
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

//obtener el detalle de todas las ordenes de compra.

app.get("/detalle-orden-compra", (req, res) => {
  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al conectar con la base de datos");
    }

    const query = `
      SELECT DOC.*, OC.RUT_PROVEEDOR
      FROM DETALLE_ORDEN_COMPRA DOC
      INNER JOIN ORDEN_COMPRA OC ON DOC.ID_ORDEN_COMPRA = OC.ID_ORDEN_COMPRA
    `;

    conn.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al ejecutar la consulta");
      }

      res.json(rows);

      conn.close();
    });
  });
});

//obtener orden_compra según rut
app.get("/proveedores/:rutProveedor/ordenes-compra", (req, res) => {
  const rutProveedor = req.params.rutProveedor;

  if (!rutProveedor) {
    return res.status(400).send('El parámetro "rutProveedor" es obligatorio');
  }

  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al conectar con la base de datos");
    }

    const query = `
      SELECT OC.ID_ORDEN_COMPRA, OC.RUT_PROVEEDOR, DOC.ID_DETALLE_ORDEN, PRO.NOMBRE_PRODUCTO, DOC.CANTIDAD 
      FROM ORDEN_COMPRA OC
      INNER JOIN DETALLE_ORDEN_COMPRA DOC ON OC.ID_ORDEN_COMPRA = DOC.ID_ORDEN_COMPRA
      INNER JOIN PRODUCTO PRO ON PRO.ID_PRODUCTO = DOC.ID_PRODUCTO
      WHERE OC.RUT_PROVEEDOR = '${rutProveedor}'
    `;

    conn.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al ejecutar la consulta");
      }

      res.json(rows);

      conn.close();
    });
  });
});



//RUTAS POST

//generar el detalle de una orden de compra
app.post("/orden-compra/:idOrdenCompra/detalle", (req, res) => {
  const idOrdenCompra = req.params.idOrdenCompra;
  const { ID_PRODUCTO, CANTIDAD } = req.body;

  if (!idOrdenCompra || !ID_PRODUCTO || !CANTIDAD) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al conectar con la base de datos");
    }

    const query = `INSERT INTO DETALLE_ORDEN_COMPRA (ID_ORDEN_COMPRA, ID_PRODUCTO, CANTIDAD) VALUES (${idOrdenCompra}, ${ID_PRODUCTO}, ${CANTIDAD})`;

    conn.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al ejecutar la consulta.");
      }

      res.json({
        message: "Detalle de la orden de compra agregado correctamente",
      });

      conn.close();
    });
  });
});



app.post("/ordenes-compra", (req, res) => {
  const rutProveedor = req.body.rutProveedor;

  if (!rutProveedor) {
    return res.status(400).send('El parámetro "rutProveedor" es obligatorio');
  }

  sql.open(connectionString, (err, conn) => {
    if (err) {
      console.error("Error al conectar con la base de datos");
      return res.status(500).send("Error al conectar con la base de datos");
    }

    const query = `INSERT INTO ORDEN_COMPRA (RUT_PROVEEDOR) OUTPUT INSERTED.ID_ORDEN_COMPRA VALUES ('${rutProveedor}')`;

    conn.query(query, (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error al ejecutar la consulta");
      }
    
      const orderId = rows[0].ID_ORDEN_COMPRA;
    
      res.json({ message: "Orden de compra agregada correctamente", orderId });
    
      conn.close();
    });
    
    
  });
});




app.listen(8080, () => {
  console.log("Servidor: http://localhost:8080/datos");
});
