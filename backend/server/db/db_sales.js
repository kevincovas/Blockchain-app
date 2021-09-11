const { pool } = require("./db");

const getProductCategoriesSQL = `SELECT id, name FROM product_categories;`;
const getProductsSQL = `SELECT id, name, description, category, price, duration, is_service, is_for_women FROM products;`;
const getProductById = `SELECT id, name, description, category, price, duration, is_service, is_for_women FROM products WHERE id=$1;`;

const getTableSQL = "SELECT * FROM $1;";

const getProductCategories = async () => {
  try {
    const result = await pool.query(getProductCategoriesSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

const getProducts = async () => {
  try {
    const result = await pool.query(getProductsSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

module.exports = {
  getProductCategories,
  getProducts
};
