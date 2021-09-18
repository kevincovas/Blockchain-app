const db = require("../db/db_sales");
const { Router } = require("express");
const { isHairdresser, authenticated } = require("../auth/auth.middlewares");
const router = new Router();

/*
  Variable that creates a success/error message structure.
  Receives: 
    - data(ok): result of the query that has to be sent, it has the same format of the return messages in the db_server file.
    - error_message: indicates that something went wrong with the query
*/
const okResult = (data) => ({
  error: false,
  error_message: "",
  data,
});
const errorResult = (error_message) => ({
  error: true,
  error_message,
  data: [],
});

/*
  End point to get all product categories. 
  It requires that the user is: 
    - Authenticated
    - Role like "admin" or "hairdresser"
*/
router.get(
  "/get-product-categories/",
  authenticated,
  isHairdresser,
  async (req, res) => {
    const { error, error_message, data } = await db.getProductCategories();
    if (error) {
      return res.status(500).json(errorResult(error_message));
    } else {
      return res.json(okResult(data));
    }
  }
);

/*
  End point to get all products. 
  It requires that the user is: 
    - Authenticated
    - Role like "admin" or "hairdresser"
*/
router.get("/get-products/", authenticated, isHairdresser, async (req, res) => {
  const { error, error_message, data } = await db.getProducts();
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});

/*
  End point to get all sales. 
  It requires that the user is: 
    - Authenticated
    - Role like "admin" or "hairdresser"
*/
router.get("/get-sales/", authenticated, isHairdresser, async (req, res) => {
  const { error, error_message, data } = await db.getSales();
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});

/*
  End point to create a new sale. 
  It requires that the user is: 
    - Authenticated
    - Role like "admin" or "hairdresser"
*/
router.post("/create-sale/", authenticated, isHairdresser, async (req, res) => {
  const sale = req.body;
  const { error, error_message, data } = await db.createSale(sale);
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});

/*
  End point to create a new sold product associated to a sale. 
  It requires that the user is: 
    - Authenticated
    - Role like "admin" or "hairdresser"
*/
router.post(
  "/add-product-to-sale/",
  authenticated,
  isHairdresser,
  async (req, res) => {
    const soldProduct = req.body;
    const { error, error_message, data } = await db.addProductToSale(
      soldProduct
    );
    if (error) {
      return res.status(500).json(errorResult(error_message));
    } else {
      return res.json(okResult(data));
    }
  }
);

/*
  End point that returns all sold products given a sale id. 
  It requires that the user is: 
    - Authenticated
    - Role like "admin" or "hairdresser"
*/
router.get(
  "/get-sold-products/:id",
  authenticated,
  isHairdresser,
  async (req, res) => {
    const saleId = req.params.id;
    const { error, error_message, data } = await db.getSoldProductsBySaleId(
      saleId
    );
    if (error) {
      return res.status(500).json(errorResult(error_message));
    } else {
      return res.json(okResult(data));
    }
  }
);

module.exports = router;
