import ProductManager from "../Dao/Manager/productManager.js";
import ProductsMongo from "../Dao/Manager/products.mongo.js";
import productModel from "../Dao/models/products.js";
import { generateProduct } from "../utils.js";
import { CustomError } from "../services/customError.service.js";
import { generateProductErrorInfo } from "../services/ErrorInfo.js";
import { EError } from "../enums/Errors.js";
import { processImage } from "../utils/helpers/proccesImage.js";
import products from "../Dao/files/newProducts.js";
import { sendNotifyMailProduct } from "../config/gmailConfig.js";
const manager = new ProductManager();
const productMongo = new ProductsMongo();

class ProductController {
  //Obtener todos los productos de la db

  getAllProducts = async (req, res) => {
    const { page = 1, limit, category, sort } = req.query;
    const options = { page, limit: parseInt(limit) || 10, lean: true };
    if (sort) {
      options.sort = { [sort]: 1 };
    } else {
      options.sort = { title: 1 };
    }
    try {
      const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
        await productMongo.getAllProducts(category, options);
      const products = docs;
      products.reverse();
      const pagesArray = [];
      for (let i = 1; i <= totalPages; i++) {
        pagesArray.push(i);
      }
      res.render("home", {
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        limit,
        totalPages,
        pagesArray,
        user: req.session.user,
      });
    } catch (error) {
      req.logger.error(error);
    }
  };
  //Obtener un productopor id

  getProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await productMongo.getProductById(id);
      if (!result) res.status(404).send({ message: "Producto no encontrado" });
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  getProductToRender = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await productMongo.getProductById(id);
      if (!result) res.status(404).send({ message: "Producto no encontrado" });
      console.log(result);
      const {
        _id,
        title,
        description,
        price,
        thumbnail,
        stock,
        code,
        category,
        status,
      } = result;
      if (
        req.session.user?.role === "admin" ||
        req.session.user?.role === "premium"
      ) {
        res.render("productsDb", {
          _id,
          title,
          description,
          price,
          thumbnail,
          stock,
          code,
          category,
          status,
          user: req.session.user,
        });
      } else {
        res.render("product", {
          id: _id,
          title,
          description,
          price,
          thumbnail,
          stock,
          code,
          category,
          status,
          user: req.session.user,
        });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  //Crear un producto

  createProduct = async (req, res) => {
    const owner = req.session?.user._id;
    try {
      const {
        title,
        description,
        price,
        stock,
        thumbnail,
        code,
        category,
        status,
      } = req.body;
      if (
        !title ||
        !description ||
        !price ||
        !stock ||
        !thumbnail ||
        !code ||
        !category
      ) {
        CustomError.createError({
          name: "Error",
          cause: "Faltan datos para crear el producto",
          message: generateProductErrorInfo(
            title,
            description,
            price,
            stock,
            thumbnail,
            code,
            category,
            status
          ),
          errorCode: EError.INVALID_JSON,
        });
        return res.status(400).send({ message: "Faltan datos" });
      }
      const product = {
        title,
        description,
        stock,
        price,
        thumbnail,
        code,
        category,
        status,
        owner,
      };

      const result = await productMongo.createProduct(product);
      res.status(200).json({ status: "succes", payload: result });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  };
  //Actualizar un producto

  updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        price,
        stock,
        thumbnail,
        code,
        category,
        status,
      } = req.body;
      const update = {
        title: title ? title : undefined,
        description: description ? description : undefined,
        price: price ? price : undefined,
        stock: stock ? stock : undefined,
        thumbnail: thumbnail ? thumbnail : undefined,
        code: code ? code : undefined,
        category: category ? category : undefined,
        status: status ? status : undefined,
      };
      const product = await productModel.findById(id);
      if (product) {
        const productOwer = JSON.parse(JSON.stringify(product.owner));
        const userId = req.user.id;
        if (
          (req.user.role === "premium" && productOwer == userId) ||
          req.user.role === "admin"
        ) {
          const result = await productMongo.updateProduct(id, update);
          res.status(201).json({ status: "success", payload: result });
        }
        res.status(401).json({ status: "error", message: "No autorizado" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
  //Eliminar un producto
  deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productModel.findById(productId).populate("owner");
      console.log(product);
      console.log("llego aca");
      if (product) {
        const productOwer = JSON.parse(JSON.stringify(product.owner));
        const userId = req.user.id;

        if (req.user.role === "admin") {
          if (product.owner.role === "premium") {
            sendNotifyMailProduct(product.owner.email);
          }
          await productModel.findByIdAndDelete(productId);
          return res.json({ status: "success", message: "producto eliminado" });
        }

        if (req.user.role === "premium" && productOwer == userId) {
          await productModel.findByIdAndDelete(productId);
          return res.json({ status: "success", message: "producto eliminado" });
        } else {
          res.status(401).json({ status: "error", message: "No autorizado" });
        }
      } else {
        return res.json({ status: "error", message: "El producto no existe" });
      }
    } catch (error) {
      res.send(error.message);
    }
  };
  //Obtener todos los productos de del file
  realTimeProducts = async (req, res) => {
    const allProducts = await manager.getProducts();
    res.render("realtimeproducts", {
      title: "Productos",
      products: allProducts,
    });
  };

  productsDb = async (req, res) => {
    const { id } = req.params;
    try {
      const result = await productModel.findById(id);
      if (!result) return res.status(404).send({ message: "No hay productos" });
      console.log(result);
      const {
        title,
        description,
        _id,
        category,
        status,
        stock,
        thumbnail,
        price,
      } = result;
      res.render("productsDb", {
        title,
        description,
        _id,
        category,
        status,
        stock,
        thumbnail,
        price,
        user: req.session.user,
      });
    } catch (error) {
      console.log(error);
      req.logger.error(error);
    }
  };
  productsFilter = async (req, res) => {
    const { page = 1, limit, category, sort, status } = req.query;
    const options = { page, limit: parseInt(limit) || 20, lean: true };

    if (sort) {
      options.sort = { [sort]: 1 };
    } else {
      options.sort = { title: 1 };
    }
    const filter = { category: category || { $exists: true } };
    if (status !== undefined) {
      filter.status = status === "true";
    }
    const { docs, hasPrevPage, hasNextPage, nextPage, prevPage, totalPages } =
      await productModel.paginate(filter, options);
    const products = docs;
    const pagesArray = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }
    if (req.session?.user?.role === "admin") {
      res.render("productsAdmin", {
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        limit,
        totalPages,
        pagesArray,
        user: req.session.user,
      });
    } else {
      res.render("products", {
        products,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        limit,
        totalPages,
        user: req.session.user,
        pagesArray,
      });
    }
  };

  getProducts = async (req, res) => {
    try {
      const result = await productModel.find();
      if (!result) return res.status(404).send({ message: "No hay productos" });
      res.send({ status: "success", payload: result });
    } catch (error) {
      req.logger.error(error);
    }
  };
  mockingProducts = async (req, res) => {
    let products = [];
    for (let i = 0; i < 100; i++) {
      let product = generateProduct();
      products.push(product);
    }
    res.status(200).json(products);
  };

  updateImage = async (req, res) => {
    const images = req.files;
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    const productOwer = JSON.parse(JSON.stringify(product.owner));
    const userId = req.user.id;
    console.log(productOwer, userId);
    if (product) {
      console.log("llego aca");
      console.log(product);

      if (
        (req.user.role === "premium" && productOwer == userId) ||
        req.user.role === "admin"
      ) {
        let imagePaths = [];
        if (images) {
          try {
            imagePaths = await Promise.all(
              images.map((image) => processImage(image))
            );
            product.thumbnail = imagePaths[0];
            await product.save();
            res.send({ status: "success", payload: product });
          } catch (error) {
            console.log(error);
            return res
              .status(500)
              .json({ error: "Error al procesar las imágenes", Eerror: error });
          }
        } else {
          res.status(401).json({ status: "error", message: "No autorizado" });
        }
      }
    }
  };

  uploadMany = async (req, res) => {
    try {
      // Obtener el ID del propietario desde req.session.user.id
      const ownerId = req.session.user.id;

      // Agregar el campo "owner" a cada producto con el ID del propietario
      const productsWithOwner = products.map((product) => ({
        ...product,
        owner: ownerId,
      }));

      // Insertar los productos en la base de datos
      const result = await productModel.insertMany(productsWithOwner);

      res.status(200).json({ status: "success", payload: result });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  };
}

export default new ProductController();