const express = require ('express');

let app = express();

//============================
// Obtener productos
//============================
app.post('/test',(req,res)=>{

    console.log('body',req);

    res.json({
        ok:true,
        respuesta:req.body
    });
});


module.exports= app;