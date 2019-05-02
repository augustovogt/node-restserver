
const jwt = require('jsonwebtoken');



//=========================================
// Verificar Token
//=========================================

let verificaToken = ( req, res, next)=>{

    let token = req.get('token');
    console.log('get_token',token);

    jwt.verify( token, process.env.SEED, ( err, decoded)=>{

        if( err ){
            res.status(401).json({
                ok:false,
                err:{
                    message:'Token no válido'
                }
            });
        }
        console.log('verifica_token',decoded.usuario);
        req.usuario = decoded.usuario;
        next();
    });
 
};

//=========================================
// Verificar ADMIN_ROLE
//=========================================

let verificaAdminRole = ( req, res, next)=>{
    
    console.log("usuario_role:"+JSON.stringify(req.usuario));
    let role = req.usuario.role;
    console.log("role:"+JSON.stringify(role));
    if( role != 'ADMIN_ROLE'){
        return res.status(401).json({
            ok:false,
            err:{
                message:'El usuario no es administrador'
            }
        })

    }

    next();

}

//=========================================
// Verificar Token Imagen
//=========================================

let verificaTokenImg = ( req, res, next)=>{
    
    let token = req.query.token;

    jwt.verify( token, process.env.SEED, ( err, decoded)=>{

        console.log('token_decoded',JSON.stringify(decoded));
        if( err ){
            res.status(401).json({
                ok:false,
                err:{
                    message:'Token no válido'
                }
            });
        }
        console.log('verifica_token',decoded.usuario);
        req.usuario = decoded.usuario;
        next();
    });
    
}

module.exports={
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}