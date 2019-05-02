const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    //if (Object.keys(req.files).length == 0)
    if (!req.files) {
        return res.status(400).json({
            ok:false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    // Validar tipos

    let tiposValidos = [ 'productos', 'usuarios'];

    if ( tiposValidos.indexOf(tipo) < 0 ){
        return res.status(400).json({
            ok:false,
            err:{
                message: ' Los tipos validos son ' + tiposValidos.join(', '),
                tipo: tipo
            }
        });
    }

    let archivo = req.files.archivo;
    let elementosArchivo = archivo.name.split('.');
    let extension = elementosArchivo[elementosArchivo.length -1];


    //Extensiones permitidas

    let extensionesValida = ['jpg', 'gif', 'png', 'jpeg']


    if ( extensionesValida.indexOf( extension) < 0 ){
        return res.status(400).json({
            ok:false,
            err:{
                message: ' Las extensiones validas son ' + extensionesValida.join(', '),
                ext: extension
            }
        });
    }

    // Cambiar nombre de Archivo

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err)=> {
    if (err)
      return res.status(500).json({
        ok:false,      
        err
    });

    //Aqui, imagen cargada

    if( tipo === 'usuarios'){
        imagenUsuario(tipo, id, res, nombreArchivo);
    }else{
        imagenProducto(tipo, id, res, nombreArchivo);
    }

  });

});

function imagenUsuario(tipo, id, res, nombreArchivo){

    Usuario.findById( id, (err, usuarioDB)=>{

        if( err ){
            borraArchivo( tipo, nombreArchivo );
            return res.json(500).json({
                ok: false,
                err
            });
        }

        if( !usuarioDB ){
            borraArchivo( tipo, nombreArchivo );
            return res.json(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo( tipo, usuarioDB.img );
        

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado)=>{
          
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })


        });

    });

}
function imagenProducto( tipo, id, res, nombreArchivo ){

    Producto.findById(id, (err, productoDB)=>{

        if( err ){
            borraArchivo( tipo, nombreArchivo );
            return res.json(500).json({
                ok: false,
                err
            });
        }

        if( !productoDB ){
            borraArchivo( tipo, nombreArchivo );
            return res.json(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo( tipo, productoDB.img );

        productoDB.img = nombreArchivo;
        

        productoDB.save( (err, productoGuardado)=>{
          
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })


        });

    });

}

function borraArchivo( tipo, nombreImagen){
    let pathImagen = path.resolve(__dirname,`../../uploads/${ tipo }/${ nombreImagen }` );
    if ( fs.existsSync( pathImagen )){
         fs.unlinkSync( pathImagen );
    }

}


module.exports=app;