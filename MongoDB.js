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
MongoDB.prototype.updateContact = async function (contactID, updateFields) {
  try {
    const result = await this.collection.updateOne(
      { contactID: contactID }, { $set: updateFields }
    )
    if (result.matchedCount === 0) {
      console.log("No se encontró ningún contacto con el ID proporcionado.");
    }
      console.log("Contacto actualizado con éxito:", result);
    return result;
  } catch (error) {
    console.error("Error al actualizar el contacto:", err);
  }
}

MongoDB.prototype.deleteContact = async function (contactID) {
  try {
    const result = await this.collection.deleteOne({ contactID });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error al eliminar el contacto:", error)
  }
}


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
