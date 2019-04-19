//===========================================
//     Puerto
//===========================================

process.env.PORT = process.env.PORT || 3000;

//===========================================
//     Enviroment
//===========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================================
//     Vencimiento del token
//===========================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
//process.env.CADUCIDAD = 60 * 60 * 24 * 30;
process.env.CADUCIDAD = '48h';

//===========================================
//     SEED del token
//===========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//===========================================
//     Enviroment
//===========================================
let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB= 'mongodb://localhost:27017/cafe';
}else{
    urlDB= process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//===========================================
//     Google Client ID
//===========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '303094345642-kaov3r7jfu771kbrr6j20uoj7a9ukjs2.apps.googleusercontent.com'