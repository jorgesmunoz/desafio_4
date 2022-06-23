// const fs = require("fs");
const fs = require("fs");

class Contenedor {
  static id = 0;

  constructor(archivo, producto) {
    this.archivo = archivo;
    this.objects = [];
  }

  addId() {
    Contenedor.id += 1;
  }

  async save(product) {
    try {
      this.addId();
      product["id"] = Contenedor.id;
      this.objects.push(product);
      fs.promises.writeFile(
        this.archivo,
        JSON.stringify(this.objects, null, 2)
      );
    } catch (error) {
      console.log("Error writing file");
    }

    // console.log(this.objects);

    return Contenedor.id;
  }

  async put(product) {
    console.log(product);
    try {
      const obje = product["id"];
      this.objects[product["id"] - 1] = {
        title: product["title"],
        price: product["price"],
        id: product["id"],
      };
      // this.objects.push(product);
      fs.promises.writeFile(
        this.archivo,
        JSON.stringify(this.objects, null, 2)
      );
    } catch (error) {
      console.log("Error writing file");
    }

    // console.log(this.objects);

    return product["id"];
  }

  async getById(idNumber) {
    try {
      const data = JSON.parse(await fs.promises.readFile(this.archivo));
      const object = data.find((obj) => obj.id === idNumber);
      if (object) {
        return object;
      } else {
        return null;
      }
    } catch (error) {
      console.log("Error reading object");
    }
  }

  async getAll() {
    try {
      const data = JSON.parse(await fs.promises.readFile(this.archivo));
      return data;
    } catch (error) {
      console.log("Error getting all objects");
    }
  }

  async deleteAll() {
    try {
      this.objects = [];
      await fs.promises.writeFile(
        this.archivo,
        JSON.stringify(this.objects, null, 2)
      );
      console.log("All objects were deleted");
    } catch (error) {
      console.log("Objects not deleted");
    }
  }

  async deleteById(idNumber) {
    try {
      let data = JSON.parse(await fs.promises.readFile(this.archivo));
      const object = data.find((obj) => obj.id === idNumber);
      this.objects = data.filter((obj) => obj.id !== object.id);
      console.log(this.objects);
      fs.promises.writeFile(
        this.archivo,
        JSON.stringify(this.objects, null, 2)
      );
    } catch (error) {
      console.log("Error deleting an object");
    }
  }
}

module.exports = Contenedor;
