const express = require( 'express');

let { verificaToken , verificaAdminRole} = require ('../middlewares/autenticacion');

let app = express();

let Categoria = require ('../models/categoria');

// =================================
// Mostrar todas las categorias
// =================================
app.get('/categoria',verificaToken,(req,res)=>{
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err,categorias)=>{
        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }
        
        res.json({
            ok: true,
            categorias
        })
    });
});

// =================================
// Mostrar una categoria por ID
// =================================
app.get('/categoria/:id',verificaToken,(req,res)=>{
   //Categoria.findById
   let id = req.params.id;
    Categoria.findById(id , (err,categoriaDB)=>{
        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }
        if( !categoriaDB ){
            return res.status(400).json({
                  ok: false,
                  err:{
                      message:'El Id categoria no encontrado'
                  }
              });
        } 
        
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    });
 

});

// =================================
// Crear una categoria por ID
// =================================
app.post('/categoria',verificaToken,(req,res)=>{
    //Categoria.findById
    //req.usuario._id

    console.log('req',req.usuario);
    let body = req.body;

    let categoria = new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id
    })

    categoria.save( (err, categoriaDB)=>{
        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }
        if( !categoriaDB ){
            return res.status(400).json({
                  ok: false,
                  err
              });
        }  
        
        res.json({
            ok:true,
            categoria:categoriaDB
        })
    });

 
 });

// =================================
// Modificar una categoria por ID
// =================================
app.put('/categoria/:id',verificaToken, (req,res)=>{
    //Categoria.findById

    let id = req.params.id;
    let body = req.body;

    let descCategoria ={
        descripcion: body.descripcion
    }
    console.log('categoria_upadte',descCategoria);
    Categoria.findByIdAndUpdate( id, descCategoria, { new: true , runValidators: false},(err, categoriaDB)=>{
        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }

        console.log('categoria_DB',categoriaDB);
        if( !categoriaDB ){
            return res.status(400).json({
                  ok: false,
                  err
              });
        }  
        
        res.json({
            ok:true,
            categoria:categoriaDB
        })       
    })

 
 });
 
 // =================================
// Eliminar una categoria por ID
// =================================
app.delete('/categoria/:id',[verificaToken, verificaAdminRole],(req,res)=>{
    //Solo elimina el admiistrador y validar token
    //Categoria.findIdAndRemove
    let id =req.params.id;

    Categoria.findByIdAndRemove(id,(err,categoriaDB)=>{
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            });            
        }

        if(!categoriaDB){
            return res.status(400).json({
              ok: false,
              err:{
                message:'Categoria no encontrada'
              }
          });             
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });
 
 });




module.exports = app;