require("dotenv").config();
const express = require("express");
const mongoDB = require("./mongoDB");
const cors = require("cors")

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.static("public"));


app.use(express.json());
app.post("/add-contact", async (req, res) => {
  
  const { name, phone } = req.body

  const contact = {name, phone}
  try {
    await mongoDB.addContactToCollection(contact)
      res
        .status(201)
        .send({ message: "Contacto agregado con éxito"});
  } catch (error) {
    res.status(500).send({ message: "Error al agregar el contacto"});
  }
});

app.get("/get-contacts", async (req, res) => {
  try {
    const contacts = await mongoDB.getContacts();
    res.status(200).send(contacts);
  } catch(error) {
    res.status(500).send({message: "Error al obtener los contactos"})
  }
});


app.put("/update-contact/:contactID", async (req, res) => {
  const { contactID } = req.params;
  const updateFields = req.body

  try {
    const result = await mongoDB.updateContact(contactID, updateFields)

    if (!result) {
      return res.status(404).send({message:  "Contacto no encontrado"})
    }
    res.status(200).send({message: "Contacto actualizado con éxito"})
  } catch (error) {
    res.status(500).send({message: "Error al actualizar el contacto"})
  }
});

app.delete("/delete-contact/:contactID",async (req, res) => {
  const { contactID } = req.params
  try {
    const result = await mongoDB.deleteContact(contactID)
    if (!result) {
      return res.status(404).send({message: "Contacto no encontrado"})
    }
    res.status(200).send({ message: "Contacto eliminado con éxito" });
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar el contacto" });
  }
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await mongoDB.connect();
  console.log("Conexión exitosa a MongoDB");
});
