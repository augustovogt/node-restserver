const express = require('express');
const app = express();
const Usuario = require( '../models/usuario' );
const bcrypt = require('bcrypt');
const _ = require ('underscore'); //El estandar de uso de underscore es _
const { verificaToken,verificaAdminRole } = require ('../middlewares/autenticacion')

app.get('/usuario', verificaToken, function (req, res) {



     let desde = req.query.desde || 0;
     desde = Number(desde);
     let limite = req.query.desde || 5
     limite = Number(limite);

     Usuario.find({estado: true}, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err,usuarios)=>{
            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }  
            
            Usuario.count({estado: true },(err,conteo)=>{

              res.json({
                ok:true,
                usuarios,
                cuantos:conteo
              });
  
            });
      });
            



  });
  
  app.post('/usuario', [verificaToken, verificaAdminRole], function (req, res) {
  
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });

    
    usuario.save( (err,usuarioDB)=>{

        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password=null;

        res.json({
            ok:true,
            usuario:usuarioDB
        })
    
    })


    });
  
    app.put('/usuario/:id', [verificaToken, verificaAdminRole] ,function (req, res) {
  
      let id = req.params.id;
      //let body = req.body;
      let body = _.pick( req.body,['nombre','email','img','role','estado']);

      //Esto esto valido cuando son pocos los paremtros
      // delete body.password;
      // delete body.google;


      try{
        console.log("findByIdAndUpdate:"+JSON.stringify(body));
        Usuario.findByIdAndUpdate( id, body, { new: true , runValidators: true},(err,usuarioDB)=>{
          console.log("Actualize");
          if( err ){
            console.log("Actualize ERROR");
            return res.status(400).json({
                  ok: false,
                  err
              });
          }
          console.log("Actualize OK");
          res.json({
            ok: true,
            usuario:usuarioDB
        });

        });
      }catch(error){
        console.log("Error put:",error);
      }

  
    });
  
    app.delete('/usuario/:id', [verificaToken, verificaAdminRole] ,function (req, res) {
          
         let id= req.params.id;

         let cambiaEstado={
           estado:false
         }
         //Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
          Usuario.findByIdAndUpdate(id,cambiaEstado,{ new: true },(err,usuarioBorrado)=>{
            if( err ){
            return res.status(400).json({
                ok: false,
                err
            });            
        }

        if(!usuarioBorrado){
            return res.status(400).json({
              ok: false,
              err:{
                message:'Usuario no encontrado'
              }
          });             
        }

        res.json({
          ok:true,
          usuario:usuarioBorrado
        })

         });
    });

module.exports= app;