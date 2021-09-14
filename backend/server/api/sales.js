const db = require("../db/db_sales");
const { Router } = require("express");

const router = new Router();

const okResult = (results) => ({
  error: false,
  error_message: "",
  data: results,
});
const errorResult = (error_message) => ({
  error: true,
  error_message,
  data: [],
});

router.get("/get-product-categories/", async (req, res) => {
  const { error, error_message, data } = await db.getProductCategories();
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});

router.get("/get-products/", async (req, res) => {
  const { error, error_message, data } = await db.getProducts();
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});

router.get("/get-sales/", async (req, res) => {
  const { error, error_message, data } = await db.getSales();
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});

router.post("/get-people-by-role/", async (req, res) => {
  const role = req.body;
  const { error, error_message, data } = await db.getPeopleByRole(role);
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});

router.post("/create-sale/", async (req, res) => {
  const sale = req.body;
  // var error = false; 
  // var missingFieldsErrorMessage = `missing fields: `;
  // if(customerId){
  //   const customerExists = await db.checkIfPersonExists(customerId);
  // } else {
    
  // }
  const {error, error_message, data} = await db.createSale(sale);
  if(error){
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data))
  }
});

router.post("/add-product-to-sale/", async (req, res) => {
  const soldProduct = req.body;
  // var error = false; 
  // var missingFieldsErrorMessage = `missing fields: `;
  // if(customerId){
  //   const customerExists = await db.checkIfPersonExists(customerId);
  // } else {
    
  // }
  const {error, error_message, data} = await db.addProductToSale(soldProduct);
  if(error){
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data))
  }
});

module.exports = router;