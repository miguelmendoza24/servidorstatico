require("dotenv").config();
const express = require("express");
const mongoDB = require("/MongoDB");


const app = express();
const PORT = process.env.PORT;

app.use(express.static("public"));


app.get("/prueba", (req, res) => {
  res.send("Hola el servidor esta funcionando.");
});

app.post("/prueba", (req, res) => {
  res.send("mensaje recibido: ");
});

app.put("/prueba", (req, res) => {
  res.send("mensaje actualizado: ");
});

app.delete("/prueba", (req, res) => {
  res.send("mensaje eliminado");
});

app.listen(PORT,  async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  await mongoDB.connect();
   console.log("Conexión exitosa a MongoDB");
});
