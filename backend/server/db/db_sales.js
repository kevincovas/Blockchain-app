const { pool } = require("./db");

const getProductCategoriesSQL = `SELECT id, name FROM product_categories;`;
const getProductsSQL = `SELECT id, name, description, category, price, duration, is_service, is_for_women FROM products;`;

const getProductByIdSQL = `SELECT id, name, description, category, price, duration, is_service, is_for_women FROM products WHERE id=$1;`;

const createSaleSQL = `INSERT INTO sales(customer_id, employee_id, total_import, method_of_payment, observations ) VALUES ($1, $2, $3, $4, $5) RETURNING id, employee_id, total_import, method_of_payment, observations;`;

const addProductToSaleSQL = `INSERT INTO sold_products(sale_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id;`;

const checkIfPersonExistsSQL = `SELECT EXISTS(SELECT * FROM people WHERE id=$1);`;

const getSalesSQL = `SELECT * FROM sales;`;

const getPeolpleByRoleSQL = 
  `SELECT id, name, surname_1, COALESCE(surname_2 , '') as surname_2
    FROM people 
    WHERE id IN 
      (SELECT user_id FROM user_roles 
        WHERE role_id=
          (SELECT id FROM roles WHERE name=$1));`

const getTableSQL = "SELECT * FROM $1;";


// GET functions
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

const getSales = async () => {
  try {
    const result = await pool.query(getSalesSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

const getPeopleByRole = async ({role}) => {
  try {
    const result = await pool.query(getPeolpleByRoleSQL, [role]);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};


const checkIfPersonExists = async (userId) => {
  try {
    if (!(await pool.query(checkIfPersonExistsSQL, [userId]))) {
      return {
        error: true,
        error_message: `Customer not found (id=${userId}).`,
      };
    } else {
      return {
        error: false,
        error_message: "",
      };
    }
  } catch {
    return { error: true, error_message: e.toString() };
  }
};

const createSale = async (sale) => {
  try {
    const result = await pool.query(createSaleSQL, Object.values(sale));
    return { error: false, error_message: "", data: result.rows[0] };
  } catch (e) {
    return { error: true, error_message: e.toString() };
  }
};

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
  getPeopleByRole,
};
