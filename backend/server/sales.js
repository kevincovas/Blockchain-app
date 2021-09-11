const db = require("./db/db_sales");
const { Router } = require("express");

const router = new Router();

const okResult = (results) => ({ error: false, error_message: "", data:results });
const errorResult = (error_message) => ({ error: true, error_message, data: []});

router.get("/product-categories/", async (req, res) => {
  const { error, error_message, data } = await db.getProductCategories();
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});

router.get("/products/", async (req, res) => {
  const { error, error_message, data } = await db.getProducts();
  if (error) {
    return res.status(500).json(errorResult(error_message));
  } else {
    return res.json(okResult(data));
  }
});


module.exports = router;
