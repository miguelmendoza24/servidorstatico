const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/prueba", (req, res) => {
  res.send("Hola el servidor esta funcionando.");
});


app.post("/prueba", (req, res) => {
  res.send("menseje recibido: ")
});

app.put("/prueba", (req, res) => {
  res.send("mensaje actualizado:")
})

app.delete("/prueba", (req, res) => {
  res.send("mensaje eliminado")
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
});
