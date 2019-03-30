//===========================================
//     Puerto
//===========================================

process.env.PORT = process.env.PORT || 3000;

//===========================================
//     Enviroment
//===========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================================
//     Enviroment
//===========================================
let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB= 'mongodb://localhost:27017/cafe';
}else{
    urlDB= process.env.MONGO_URI;
}
console.log("===>process.env.NODE_ENV:",process.env.NODE_ENV);
process.env.URLDB = urlDB;

console.log("===>process.env.URLDB:",process.env.URLDB);


