// Get Product Categories API call
export const getProductCategories = async (HOST) => {
  const res = await fetch(HOST + `/sales/product-categories/`, {
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
  const res = await fetch(HOST + `/sales/products/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const response = await res.json();
  return response;
};
