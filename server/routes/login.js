const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require( '../models/usuario' );
const app = express();


app.post('/login',function(req,res){

    let body= req.body;

    Usuario.findOne({email: body.email},(err, usuarioDB)=>{

        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }  

        if( !usuarioDB ){
            return res.status(500).json({
                ok: false,
                err:{
                    message:'(Usuario) o contraseña incorrecto'
                }
            });
        }

        if( !bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(500).json({
                ok: false,
                err:{
                    message:'Usuario o (contraseña) incorrecto'
                }
            });
        }

        let token= jwt.sign({
           usuario:usuarioDB,
        },
        process.env.SEED,
        {
            expiresIn:process.env.CADUCIDAD
        },function(err,token){
            if(err){
                return res.status(401).json({
                    ok:false,
                    err:{
                        message:'Error en generacion de token:'+err
                    }
                });
            }else{
                return  res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token
                });

            }
        });

    


    });

});

// Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
     
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);

    return {
        nombre: payload.name,
        email:payload.email,
        img: payload.picture,
        google:true
    }

  }
  


app.post('/google',async (req,res)=>{

    console.log('body',req.body);
    let token=req.body.idtoken;
    let googleUser;
    try{
        console.log('token_google',token);
        googleUser= await verify(token)
        console.log('verify');
    }catch( e ){
        console.log('Catch verify token');
        return res.status(403).json({
            ok: false,
            err: e
        });
    };

    Usuario.findOne({email: googleUser.email},(err,usuarioDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        } 

        if( usuarioDB ){
          if( usuarioDB.google === false){
            return res.status(400).json({
                ok: false,
                err:{
                    message:'Debe usar su autenticacion normal'
                }
            });             
          } else {

            let token= jwt.sign({
                usuario:usuarioDB,
             },
             process.env.SEED,
             {
                 expiresIn:process.env.CADUCIDAD
             },function(err,token){
                 if(err){
                     return res.status(401).json({
                         ok:false,
                         err:{
                             message:'Error en generacion de token:'+err
                         }
                     });
                 }else{
                     return  res.json({
                         ok:true,
                         usuario:usuarioDB,
                         token
                     });
     
                 }
             });
          }


        } else {

            // Si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';


            usuario.save ((err,usuarioDB)=>{
                if( err ){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token= jwt.sign({
                    usuario:usuarioDB,
                 },
                 process.env.SEED,
                 {
                     expiresIn:process.env.CADUCIDAD
                 },function(err,token){
                     if(err){
                         return res.status(401).json({
                             ok:false,
                             err:{
                                 message:'Error en generacion de token:'+err
                             }
                         });
                     }else{
                        return  res.json({
                             ok:true,
                             usuario:usuarioDB,
                             token
                         });
         
                     }
                 });
            });

        }
    })                      

    // res.json({
    //     usuario: googleUser
    // });
});


module.exports= app;

