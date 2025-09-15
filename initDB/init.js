const mongoose = require('mongoose');
const listing = require('../models/listing.js');
const initdb = require('./data.js');
main().then(()=>{
    console.log("connection success");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

async function init(){
    await listing.deleteMany({});    // phle jitna data hoga wo khali ho jayega;
    initdb.data = initdb.data.map((e)=>({...e,owner:'68c3c971657a5e377d49442d'}));
await listing.insertMany(initdb.data);      
}

init();