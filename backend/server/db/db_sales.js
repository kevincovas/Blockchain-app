const { pool } = require("./db");

/*
  Query that gets all product categories and return some of the fields sorted by product category name.
*/
const getProductCategoriesSQL = `
  SELECT 
    id, 
    name 
  FROM product_categories 
  ORDER BY name;
`;

const getProductCategories = async () => {
  /*
    Function that executes the query to get all product categories.
    Returns: 
      - error:
        - true: indicates an error in the query execution
        - false: everything went ok
      - error_message: details of the error above
      - data: it returns the results of the query or [] if an error occurred. 
  */
  try {
    const result = await pool.query(getProductCategoriesSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

/*
  Query that gets all products and return some of the fields sorted by product name.
*/
const getProductsSQL = `
  SELECT 
    id, 
    name, 
    description, 
    category, 
    price, 
    duration, 
    is_service, 
    is_for_women 
  FROM products
  ORDER BY name;
`;

const getProducts = async () => {
  /*
    Function that executes the query to get all products.
    Returns: 
      - error:
        - true: indicates an error in the query execution
        - false: everything went ok
      - error_message: details of the error above
      - data: it returns the results of the query or [] if an error occurred. 
  */
  try {
    const result = await pool.query(getProductsSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

/*
  Query that gets all sales from the database and returns all necessary fields.
  Makes an inner joy of tables people and sales to get the names of the customer and hairdresser.
*/
const getSalesSQL = `
SELECT 
  s.id, 
  CONCAT(p1.name, ' ', p1.surname_1, ' ', COALESCE(p1.surname_2, '')) as customer_name, 
  CONCAT(p2.name, ' ', p2.surname_1, ' ', COALESCE(p2.surname_2, '')) as employee_name, 
  s.total_import, 
  s.observations, 
  s.method_of_payment, 
  s.created_at, 
  s.updated_at 
FROM sales s
INNER JOIN people p1 ON p1.id = s.customer_id
INNER JOIN people p2 ON p2.id = s.employee_id
ORDER BY s.created_at DESC;`;

const getSales = async () => {
  /*
    Function that executes the query to get all sales.
    Returns: 
      - error:
        - true: indicates an error in the query execution
        - false: everything went ok
      - error_message: details of the error above
      - data: it returns the results of the query or [] if an error occurred. 
  */
  try {
    const result = await pool.query(getSalesSQL);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

/*
  Query that creates a sale in the database.
*/
const createSaleSQL = `
  INSERT INTO sales(
    customer_id, 
    employee_id, 
    total_import, 
    method_of_payment, 
    observations) 
  VALUES ($1, $2, $3, $4, $5) 
  RETURNING 
    id, 
    employee_id, 
    total_import, 
    method_of_payment, 
    observations;
`;

const createSale = async (sale) => {
  /*
  Function that executes the query to create a sale in the database. 
  Receives: 
    - customer_id (person id, not null)
    - employee_id (person id, not null)
    - total_import (decimal, not null)
    - method_of_payment (small int, not null)
    - observations (text)
  Returns: 
      - error:
        - true: indicates an error in the query execution
        - false: everything went ok
      - error_message: details of the error above
      - data: it returns the results of the position 0 of the query or [] if an error occurred. 
*/
  try {
    const result = await pool.query(createSaleSQL, Object.values(sale));
    return { error: false, error_message: "", data: result.rows[0] };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

/*
  Query that creates a sold product in the database.
  Requires the sale id.
*/
const addProductToSaleSQL = `
  INSERT INTO sold_products(
    sale_id, 
    product_id, 
    product_name, 
    product_unit_price, 
    quantity
  ) 
  VALUES ($1, $2, $3, $4, $5) 
  RETURNING id;
`;

const addProductToSale = async ({
  sale_id,
  product_id,
  product_name,
  product_unit_price,
  quantity,
}) => {
  /*
    Function that executes the query to create a sold product in the database. 
  Receives: 
    - sale_id (sale id, not null)
    - product_id (product id, not null)
    - product_unit_price (decimal, not null)
    - quantity (small int, not null)
  Returns: 
      - error:
        - true: indicates an error in the query execution
        - false: everything went ok
      - error_message: details of the error above
      - data: it returns the results of the id of the product sold just created or [] if an error occurred. 
  */
  try {
    const result = await pool.query(addProductToSaleSQL, [
      sale_id,
      product_id,
      product_name,
      product_unit_price,
      quantity,
    ]);
    return { error: false, error_message: "", data: result.rows[0] };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

/*
  Query that gets a sold product from the database by sale id.
  Requires the sale id.
*/
const getSoldProductsBySaleIdSQL = `
  SELECT 
    id, 
    product_name, 
    product_unit_price, 
    quantity
  FROM sold_products
  WHERE sale_id=$1;
`;

const getSoldProductsBySaleId = async (sale_id) => {
  /*
    Function that executes the query to create a sold product in the database. 
    Receives: 
      - sale_id
    Returns: 
        - error:
          - true: indicates an error in the query execution
          - false: everything went ok
        - error_message: details of the error above
        - data: it returns the results of the query or [] if an error occurred. 
  */
  try {
    const result = await pool.query(getSoldProductsBySaleIdSQL, [sale_id]);
    return { error: false, error_message: "", data: result.rows };
  } catch (e) {
    return { error: true, error_message: e.toString(), data: [] };
  }
};

module.exports = {
  getProductCategories,
  getProducts,
  getSales,
  createSale,
  addProductToSale,
  getSoldProductsBySaleId,
};
