const { MongoClient } = require("mongodb");

function connectToDb(){
    return  new MongoClient(
        `mongodb+srv://berkaouimedev:${process.env.PASSWORD}@cluster0.qniwl9s.mongodb.net/`
       );
       
}
module.exports=connectToDb