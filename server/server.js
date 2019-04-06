require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use( require('./routes/index'));

 
// parse application/json
app.use(bodyParser.json())

  console.log("Conexion string Mongo:"+process.env.URLDB);
  mongoose.connect(process.env.URLDB,
       {useNewUrlParser: true,useCreateIndex: true}, 
       (err,res)=>{

      if(err) throw err;

      console.log("Base de datos ONLINE!!!");
  });



app.listen(process.env.PORT,()=>{
    console.log("Escuchando el puerto:",process.env.PORT);
})