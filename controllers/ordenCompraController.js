const sql = require('mssql')

const config = {
    database: 'gestionComercial',
    server: 'DESKTOP-FDUSN85\\SQLEXPRESS',
    driver: 'msnodesqlv8',
    options: {
      trustedConnection: true
    }
  };

const createOrdenCompra = async (req, res)=>{
    try{
        const {RUT_PROVEEDOR} = req.body;
    

    const pool = await sql.connect(config);
    const query = `INSERT INTO ORDEN_COMPRA (RUT_PROVEEDOR) VALUES (@RUT_PROVEEDOR) `
    const result = await pool.request()
    .input('RUT_PROVEEDOR' , sql.VarChar(20), RUT_PROVEEDOR)
    .query(query)

    res.status(201).json({message:'Orden de compra creada correctamente.'})
    }catch(error){
        console.error('Error al crear la orden de compra:' , error)
        res.status(500).json({error: 'Ocurrio un error al crear la orden de compra.'})
    }
};

module.exports={
    createOrdenCompra,
};





