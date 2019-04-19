const express = require ('express');
const {verificaToken} = require ('../middlewares/autenticacion');

let app = express();
let Producto = require ('../models/producto');
let Categoria = require ('../models/categoria');

//============================
// Obtener productos
//============================
app.get('/productos',verificaToken,(req,res)=>{
    //trae todos los productos
    //populate usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.desde || 3
    limite = Number(limite);



    Producto.find({disponible:true})
    .skip(desde)
    .limit(limite)
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .populate('categoria')
    .exec((err,productos)=>{
        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }
        
        res.json({
            ok: true,
            productos
        })
    });
});
//============================
// Obtener producto por ID
//============================
app.get('/productos/:id',verificaToken,(req,res)=>{
    //populate usuario categoria
    let id= req.params.id;

    Producto.findById(id)
             .populate('categoria')
             .populate('usuario','nombre email')
             .exec((err,productoDB)=>{                
        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }
        if( !productoDB ){
            return res.status(400).json({
                  ok: false,
                  err:{
                      message:'El Id categoria no encontrado'
                  }
              });
        } 
        
        res.json({
            ok:true,
            producto:productoDB
        })
    });
});

//============================
// Buscar  productos 
//============================

app.get('/productos/buscar/:termino',verificaToken, (req,resp)=>{

     let termino = req.params.termino;
     let regex = new RegExp(termino,'i');
     
     Producto.find({ descripcion: regex})
          .populate('categoria')
          .exec((err,productos)=>{
            if( err ){
                return res.status(500).json({
                      ok: false,
                      err
                  });
            }
            
            resp.json({
                ok:true,
                productos
            });
          });

});




//============================
// Crear un nuevo producto 
//============================
app.post('/productos', verificaToken, (req,res)=>{
    //grabar el usuario
    //obtener una categoria del listado
    let body=req.body;
    console.log('producto_body',body);
    let descCategoria= body.descCategoria;
    console.log('descCategoria',descCategoria);
    Categoria.find({},(err,categoriasDB)=>{

        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }
        if( !categoriasDB ){
            return res.status(400).json({
                  ok: false,
                  err:{
                      message:'No hay categoria para asociar'
                  }
              });
        }   
        console.log('categorias',categoriasDB);
        let categoria=categoriasDB.find(categoria => categoria.descripcion == descCategoria);
        console.log("categoria",categoria);
        if ( !categoria){
            categoria = categoriasDB[0];
            console.log("categoria_0",categoria);
        }

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: true,
            categoria:categoria._id,
            usuario: req.usuario._id        
        });
        producto.save((err, productoDB)=>{
            if( err ){
                return res.status(500).json({
                      ok: false,
                      err
                  });
            }
            if( !productoDB ){
                return res.status(400).json({
                      ok: false,
                      err
                  });
            }              
            res.json({
                ok:true,
                producto:productoDB
            })
        });
    

    });



});
//============================
// Actualizar un producto 
//============================
app.put('/productos/:id',verificaToken, (req,res)=>{
    //grabar el usuario
    //obtener una categoria del listado
    let id = req.params.id
    let descripcion = req.body.descripcion;

    Producto.findByIdAndUpdate(id, { descripcion }, { new: true , runValidators: false}, (err,productoDB)=>{
        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }
        if( !productoDB ){
            return res.status(400).json({
                  ok: false,
                  err
              });
        }              
        res.json({
            ok:true,
            producto:productoDB
        })       
    });


});
//============================
// Eliminar un producto 
//============================
app.delete('/productos/:id',(req,res)=>{
    //cambiar estado disponible
    let id = req.params.id
 
    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true , runValidators: false}, (err,productoDB)=>{
        if( err ){
            return res.status(500).json({
                  ok: false,
                  err
              });
        }
        if( !productoDB ){
            return res.status(400).json({
                  ok: false,
                  err
              });
        }              
        res.json({
            ok:true,
            producto:productoDB
        })       
    });

});

module.exports = app;
