require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

function MongoDB() {
  this.db = null;
  this.client = null;
  this.collection = null;
  this.generateContactID = function () {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let contactID = "";

    for (let i = 0; i < 12; i++) {
      contactID += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return contactID;
  };
}

//conexion a mongoDB
MongoDB.prototype.connect = async function () {
  try {
    const mongoUri = process.env.MONGO_URI;
    const dbName = "aprendiendo";
    this.client = await MongoClient.connect(mongoUri);
    this.db = this.client.db(dbName);
    this.collection = this.db.collection("collectionContacts");
  } catch (err) {
    console.error("Error al conectar con MongoDB:", err);
  }
};

//create
MongoDB.prototype.addContactToCollection = async function (contact) {
  try {
    contact.contactID = this.generateContactID();
    await this.collection.insertOne(contact);
    console.log("Contacto agregado con éxito:");
  } catch (err) {
    console.error("Error al agregar el contacto:", err);
  }
};

//read
MongoDB.prototype.getContacts = async function () {
  try {
    const contacs = await this.collection.find({}).toArray();
    return contacs
  } catch (err) {
    console.error("Error al obtener los contactos:", err);
  }
};

//update

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
