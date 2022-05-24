const express = require('express');
const router = express.Router();
const UserController = require("../controller/userController");
const ProductController = require("../controller/productController");
const CartController = require("../controller/cartController")
const OrderController = require("../controller/orderController")
const mw = require("../middleware/auth");



router.post("/register", UserController.createUser);

router.post("/login", UserController.login);

router.get("/user/:userId/profile", mw.authentication, mw.authorisation, UserController.getUser);

router.put('/user/:userId/profile', mw.authentication, mw.authorisation, UserController.updateUser);

router.post('/products', ProductController.createProduct);

router.get("/products", ProductController.getProductbyQuery);

router.get("/products/:productId", ProductController.getProductsById);

router.post("/products/:productId", ProductController.updateProduct);

router.delete("/products/:productId", ProductController.deleteProduct);

router.post("/users/:userId/cart", mw.authentication, mw.authorisation, CartController.createCart);

router.put("/users/:userId/cart", mw.authentication, mw.authorisation, CartController.updateCart);

router.get("/users/:userId/cart", mw.authentication, mw.authorisation, CartController.getCart);

router.delete("/users/:userId/cart", mw.authentication, mw.authorisation, CartController.deleteCart);

router.post("/users/:userId/orders", mw.authentication, mw.authorisation, OrderController.createOrder);

router.put("/users/:userId/orders", mw.authentication, mw.authorisation, OrderController.updateOrder);







module.exports = router;