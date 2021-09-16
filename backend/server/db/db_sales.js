const { pool } = require("./db");

// const getProductByIdSQL = `SELECT id, name, description, category, price, duration, is_service, is_for_women FROM products WHERE id=$1;`;

//Gets all product categories and return the id and the name
const getProductCategoriesSQL = `SELECT id, name FROM product_categories;`;

const getProductCategories = async () => {
  try {
    const result = await pool.query(getProductCategoriesSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

const getProductsSQL = `SELECT id, name, description, category, price, duration, is_service, is_for_women FROM products;`;

const getProducts = async () => {
  try {
    const result = await pool.query(getProductsSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

// Gets all sales from DB and returns all fields.
const getSalesSQL = `SELECT * FROM sales;`;
const getSales = async () => {
  try {
    const result = await pool.query(getSalesSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};



// const checkIfPersonExistsSQL = `SELECT EXISTS(SELECT * FROM people WHERE id=$1);`;
// const checkIfPersonExists = async (userId) => {
//   try {
//     if (!(await pool.query(checkIfPersonExistsSQL, [userId]))) {
//       return {
//         error: true,
//         error_message: `Customer not found (id=${userId}).`,
//       };
//     } else {
//       return {
//         error: false,
//         error_message: "",
//       };
//     }
//   } catch {
//     return { error: true, error_message: e.toString() };
//   }
// };

// Creates a new sale
const createSaleSQL = `INSERT INTO sales(customer_id, employee_id, total_import, method_of_payment, observations ) VALUES ($1, $2, $3, $4, $5) RETURNING id, employee_id, total_import, method_of_payment, observations;`;
const createSale = async (sale) => {
  try {
    const result = await pool.query(createSaleSQL, Object.values(sale));
    return { error: false, error_message: "", data: result.rows[0] };
  } catch (e) {
    return { error: true, error_message: e.toString() };
  }
};


//Adds a row in sold_products table 
const addProductToSaleSQL = `INSERT INTO sold_products(sale_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id;`;
const addProductToSale = async (soldProduct) => {
  try {
    const result = await pool.query(addProductToSaleSQL, Object.values(soldProduct));
    return { error: false, error_message: "", data: result.rows[0] };
  } catch (e) {
    return { error: true, error_message: e.toString() };
  }
};

module.exports = {
  getProductCategories,
  getProducts,
  getSales,
  createSale,
  addProductToSale,
};
