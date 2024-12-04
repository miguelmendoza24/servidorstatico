require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

function MongoDB() {
  this.db = null;
  this.client = null;
  this.coleccion = null;
}

MongoDB.prototype.connect = async function () {
  try {
    const mongoUri = process.env.MONGO_URI; 
    const dbName = "aprendiendo";

    this.client = await MongoClient.connect(mongoUri);

    console.log("Conexión exitosa a MongoDB");

    this.db = this.client.db(dbName);
    this.coleccion = this.db.collection("miColeccion");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
  }
};

module.exports = new MongoDB();

/*function MongoDB() {
  this.propiedad = "string"
  this.metodo = function () {
    console.log("hola");
    console.log(this.propiedad);
    
  }
  console.log("constructor");
}

const mongodb = new MongoDB();
mongodb.metodo();*/
