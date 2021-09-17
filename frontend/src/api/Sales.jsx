// Get Product Categories API call
export const getProductCategories = async (HOST, token) => {
  const res = await fetch(HOST + `/sales/get-product-categories/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  const response = await res.json();
  return response;
};

// Get Products API call
export const getProducts = async (HOST, token) => {
  const res = await fetch(HOST + `/sales/get-products/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  const response = await res.json();
  return response;
};


// Create Sale API call
export const createSale = async (HOST, token, sale) => {
  const res = await fetch(HOST + `/sales/create-sale/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(sale),
  });
  const response = await res.json();
  return response;
};

// Add Product to Sale API call
export const addProductToSale = async (HOST, token, saleProduct) => {
  const res = await fetch(HOST + `/sales/add-product-to-sale/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(saleProduct),
  });
  const response = await res.json();
  return response;
}

// Get Customers API call
export const getPeopleByRole = async (HOST, token, role) => {
  const res = await fetch(HOST + `/clients/get-people-by-role/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({role}),
  });
  const response = await res.json();
  return response;
};


//Get Sales
export const getSales = async (HOST, token) => {
  const res = await fetch(HOST + `/sales/get-sales/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  const response = await res.json();
  return response;
};