require("dotenv").config();
const express = require("express");
const mongoDB = require("./MongoDB");
const cors = require("cors");
const AppError = require("./appError");
const { ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.static("public"));
app.use(express.json());


app.post("/add-contact", async (req, res, next) => {
  
  const { name, phone } = req.body
  if (!name || !phone ) {
    return next(new AppError("Faltan datos: nombre o telefono", 400));
  }

  const contact = { name, phone }
  
  try {
    await mongoDB.addContactToCollection(contact)
      res
        .status(201)
        .send({ message: "Contacto agregado con éxito"});
  } catch (error) {
    next( new AppError("Error al agregar el contacto", 500))
  }
});

app.get("/get-contacts", async (req, res, next) => {
  try {
    const contacts = await mongoDB.getContacts();
    if (!contacts || contacts.length === 0) {
      return next (new AppError("No se encontraron contactos", 400))
    }
    res.status(200).send(contacts);
  } catch(error) {
    next(new AppError("Error al obtener los contactos", 500))
  }
});


app.put("/update-contact/:contactID", async (req, res, next) => {
  const { contactID } = req.params;
  const updateFields = req.body

  try {
    if (!ObjectId.isValid(contactID)) {
       throw new AppError("El ID proporcionado no es válido.", 400);
    }
    const result = await mongoDB.updateContact(contactID, updateFields)

    if (!result) {
      return next(new AppError("Contacto no encontrado", 404))
    }
    res.status(200).send({message: "Contacto actualizado con éxito"})
  } catch (error) {
    next(error)
  }
});

app.delete("/delete-contact/:contactID",async (req, res, next) => {
  const { contactID } = req.params
  try {
    const result = await mongoDB.deleteContact(contactID)
    if (!result) {
      return next(new AppError("Contacto no encontrado", 400))
    }
    res.status(200).send({ message: "Contacto eliminado con éxito" });
  } catch (error) {
    next(new AppError("Error al elimanar el contacto", 500))
  }
});


app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "castError") {
    return res.status(400).json({
      message: "ID invalido. Asegurate de enviar un ID correco"
    })
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "Dato duplicado. Este contacto ya existe."
    })
  }
  
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }

  res
    .status(500)
    .json({message: "Ocurrió un error inesperado. Intenta más tarde.",
    });
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await mongoDB.connect();
  console.log("Conexión exitosa a MongoDB");
});
