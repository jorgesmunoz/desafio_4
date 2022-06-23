const Contenedor = require("./contenedor.js");
const { log } = require("console");
const express = require("express");
const fs = require("fs");
const router = express.Router();

let product = new Contenedor("productos.txt");

// Save objects
(async () => {
  await product.save({ title: "manzanas", price: 3.5 });
  await product.save({ title: "bananas", price: 11.0 });
  await product.save({ title: "peras", price: 15.0 });
  await product.save({ title: "tomates", price: 13.0 });
})();

// create closure
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

router.get("/api/productos", async (req, res) => {
  res.status(200).json(await product.getAll());
});

router.get("/api/productos/:id", async (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({ error: "El parametro no es numerico" });
  }

  if ((await product.getById(parseInt(req.params.id))) === null) {
    return res.status(400).json({ error: "El producto no se encuentra" });
  } else {
    res.status(200).json(await product.getById(parseInt(req.params.id)));
  }
});

router.post("/api/productos/", async (req, res) => {
  const { title, price } = req.body;
  const ans = await product.save({ title: title, precio: price });
  return res.status(200).json(await product.getById(parseInt(ans)));
});

router.put("/api/productos/:id", async (req, res) => {
  const { title, price } = req.body;

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "El parametro no es numerico" });
  }

  const ans = await product.getById(id);

  if (ans === null) {
    return res.status(400).json({ error: "El producto no se encuentra" });
  }
  if (title !== undefined) {
    ans["title"] = title;
  }

  if (price !== undefined) {
    ans["price"] = price;
  }

  const data = {
    id: id,
    title: ans["title"],
    price: ans["price"],
  };

  const answer = await product.put(data);
  return res.status(200).json(await product.getById(parseInt(answer)));
});

router.delete("/api/productos/:id", async (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.status(400).json({ error: "El parametro no es numerico" });
  }

  const ans = await product.getById(parseInt(req.params.id));

  if (ans === null) {
    return res.status(400).json({ error: "El producto no se encuentra" });
  } else {
    return res
      .status(200)
      .json(await product.deleteById(parseInt(req.params.id)));
  }
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
