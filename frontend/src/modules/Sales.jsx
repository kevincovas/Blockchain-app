import React, { useEffect, useState } from "react";
import { HOST } from "../config/const";
import * as api from "../api/Sales";
import axios from "axios";
import "./Sales.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function useMounted() {
  /*
    Custom hook created to check if the component is being mounted or if it has already been mounted. 
  */
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

function Sales() {
  const [count, setCount] = useState(0);
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [productsSelect, setProductsSelect] = useState([]);
  const [categoriesSelect, setCategoriesSelect] = useState([]);
  const [loadingCategories, setCategoriesLoaded] = useState([false]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.00);

  const isMounted = useMounted();

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        await api.getProductCategories(HOST).then((response) => {
          const { error, error_message, data } = response;
          if (error) {
            alert(`Error: ${error_message}`);
          } else {
            setCategoriesList(data);
            setCategoriesSelect(data);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProducts = async () => {
      try {
        await api.getProducts(HOST).then(({ error, error_message, data }) => {
          if (error) {
            alert(`Error: ${error_message}`);
          } else {
            setProductsList(data);
            setProductsSelect(data);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductCategories();
    fetchProducts();
  }, []);

  const filterProductsByCategory = (categoryID) => {
    const filteredProducts = productsList.filter(
      ({ category }) => category.toString() === categoryID.toString()
    );
    setProductsSelect(filteredProducts);
  };

  const addSaleProduct = (productID) => {
    setSaleProducts((prevState) => {
      // If this product is already in saleProducts (prevStatee), add one to this product quantity
      // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
      const index = prevState.findIndex(
        (item) => productID.toString() === item.id.toString()
      );
      if (index !== -1) {
        // Creates a new array from prevState, modify the product quantity and final price of the product.
        const products = [...prevState];
        const product = { ...prevState[index] };
        product.quantity = product.quantity + 1;
        product.total_price = (
          product.price * product.quantity
        ).toFixed(2);
        products[index] = product;
        return products;
      } else {
        // Creates the new fullProduct and adds it to saleProducts
        // Get the selected product object from the products list using the id saved in selectedProduct when a product is clicked.
        const product = productsList.find(
          ({ id }) => id.toString() === productID.toString()
        );
        const fullProduct = {
          ...product,
          quantity: 1,
          total_price: product.price,
        };
        return [...prevState, fullProduct];
      }
    });
  };

  const deleteSaleProduct = (productID) => {
    setSaleProducts((prevState) => {
      // If this product is already in saleProducts (prevStatee), add one to this product quantity
      // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
      const index = prevState.findIndex(
        (item) => productID.toString() === item.id.toString()
      );
      if (index !== -1) {
        // Creates a new array from prevState, modify the product quantity and final price of the product.
        const products = [...prevState];
        products.splice(index, 1);
        return products;
      }
    });
  }; 

  const decreaseSaleProductQuantity = (productID) => {
    setSaleProducts((prevState) => {
      // If this product is already in saleProducts (prevStatee), add one to this product quantity
      // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
      const index = prevState.findIndex(
        (item) => productID.toString() === item.id.toString()
      );
      if (index !== -1) {
        // Creates a new array from prevState, modify the product quantity and final price of the product.
        const products = [...prevState];
        const product = { ...prevState[index] };
        if (product.quantity > 1) {
          product.quantity = product.quantity - 1;
          product.total_price = (
            product.price * product.quantity
          ).toFixed(2);
          products[index] = product;
        } else {
          products.splice(index, 1);
        }
        return products;
      }
    });
  };

  const increaseSaleProductQuantity = (productID) => {
    setSaleProducts((prevState) => {
      // If this product is already in saleProducts (prevStatee), add one to this product quantity
      // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
      const index = prevState.findIndex(
        (item) => productID.toString() === item.id.toString()
      );
      if (index !== -1) {
        // Creates a new array from prevState, modify the product quantity and final price of the product.
        const products = [...prevState];
        const product = { ...prevState[index] };
        product.quantity = product.quantity + 1;
        product.total_price = (
          product.price * product.quantity
        ).toFixed(2);
        products[index] = product;
        return products;
      }
    });
  };

  const calculateTotalPrice = () => {
    var finalPrice = 0.00;
    saleProducts.forEach(({total_price}) => finalPrice += parseFloat(total_price));
    setTotalPrice(finalPrice);
  }

  // useEffect(() => {
  //   if (isMounted) {
  //     setSaleProducts((prevState) => {
  //       // Get the selected product object from the products list using the id saved in selectedProduct when a product is clicked.
  //       const product = productsList.find(
  //         ({ id }) => id.toString() === selectedProduct.toString()
  //       );
  //       // If this product is already in saleProducts (prevStatee), add one to this product quantity
  //       // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
  //       const index = prevState.findIndex(
  //         (item) => product.id.toString() === item.id.toString()
  //       );
  //       if (index !== -1) {
  //         // Creates a new array from prevState, modify the product quantity and final price of the product.
  //         const products = [...prevState];
  //         const product = { ...prevState[index] };
  //         product.quantity = product.quantity + 1;
  //         product.total_price = (
  //           product.price * product.quantity
  //         ).toFixed(2);
  //         products[index] = product;
  //         return products;
  //       } else {
  //         // Creates the new fullProduct and adds it to saleProducts
  //         const fullProduct = {
  //           ...product,
  //           quantity: 1,
  //           total_price: product.price,
  //         };
  //         return [...prevState, fullProduct];
  //       }
  //     });
  //   }
  // }, [selectedProduct]);

  return (
    <div className="view sales">
      <div className="sales column left sold-products">
        <h1>Nueva venta</h1>
        <form>
          <label>
            Selecciona la categoría:
            <select
              onChange={(event) => {
                filterProductsByCategory(event.target.value);
              }}
            >
              {categoriesSelect.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Selecciona el producto:
            <select
              onClick={(event) => {
                addSaleProduct(event.target.value);
              }}
            >
              {productsSelect.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
        </form>

        <table>
          <thead>
            <tr>
              <th key="name">Producto</th>
              <th key="quantity">Quant</th>
              <th key="unitary-price">€/u.</th>
              <th key="options">Opciones</th>
              <th key="total_price">Precio</th>
            </tr>
          </thead>
          <tbody>
            {saleProducts.map((saleProduct) => (
              <tr key={saleProduct.id}>
                <td key={`${saleProduct.id}-name`}>{saleProduct.name}</td>
                <td key={`${saleProduct.id}-quantity`}>
                  {saleProduct.quantity}
                </td>
                <td key={`${saleProduct.id}-price`}>{saleProduct.price}</td>
                <td key={`${saleProduct.id}-options`}>
                  <div className="sale-option-action-buttons">
                    <FontAwesomeIcon
                      icon={faMinus}
                      onClick={(e) =>
                        decreaseSaleProductQuantity(`${saleProduct.id}`)
                      }
                    />
                    <FontAwesomeIcon
                      icon={faPlus}
                      onClick={(e) =>
                        increaseSaleProductQuantity(`${saleProduct.id}`)
                      }
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={(e) =>
                        deleteSaleProduct(`${saleProduct.id}`)
                      }
                    />
                  </div>
                </td>
                <td key={`${saleProduct.id}-total_price`}>
                  {saleProduct.total_price}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="5">{totalPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <button onClick={() => calculateTotalPrice() }>Cobrar</button>
        </div>
      </div>
    </div>
  );
}

export default Sales;