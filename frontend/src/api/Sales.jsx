// Get Product Categories API call
export const getProductCategories = async (HOST) => {
  const res = await fetch(HOST + `/sales/get-product-categories/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await res.json();
  return response;
};

// Get Products API call
export const getProducts = async (HOST) => {
  const res = await fetch(HOST + `/sales/get-products/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await res.json();
  return response;
};


// Create Sale API call
export const createSale = async (HOST, sale) => {
  const res = await fetch(HOST + `/sales/create-sale/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sale),
  });
  const response = await res.json();
  return response;
};

// Add Product to Sale API call
export const addProductToSale = async (HOST, saleProduct) => {
  const res = await fetch(HOST + `/sales/add-product-to-sale/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(saleProduct),
  });
  const response = await res.json();
  return response;
}

// Get Customers API call
export const getPeopleByRole = async (HOST, role) => {
  const res = await fetch(HOST + `/sales/get-people-by-role/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({role}),
  });
  const response = await res.json();
  return response;
};
