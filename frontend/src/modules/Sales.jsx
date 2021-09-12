import React, { useEffect, useState } from "react";
import { HOST, METHODS_OF_PAYMENT } from "../config/const";
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

const methodOfPayment = "methodOfPayment";
const employeeId = "employeeId";
const customerId = "customerId";
const methodOfPaymentErrorMessage = "Por favor, escoja un método de pago.";
const customerIdErrorMessage = "Por favor, escoja un cliente.";
const employeeIdErrorMessage = "Por favor, escoja el peluquero que ha cobrado el servicio.";


function Sales() {
  const [productsList, setProductsList] = useState([]);
  const [productsSelect, setProductsSelect] = useState([]);
  const [categoriesSelect, setCategoriesSelect] = useState([]);
  const [customersSelect, setCustomerSelect] = useState([]);
  const [employeesSelect, setEmployeesSelect] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [saleCustomerId, setSaleCustomerId] = useState("");
  const [customerIdError, setCustomerIdError] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  const [methodOfPaymentError, setMethodOfPaymentError] = useState("");
  const [saleEmployeeId, setSaleEmployeeId] = useState("");
  const [saleMethodOfPayment, setSaleMethodOfPayment] = useState("");
  const [observations, setObservations] = useState("");
  const [messages, setMessages] = useState([]);

  const isMounted = useMounted();

  /*const checkGenericValue = (key, value) => {
    if(!value){
      const {errorMessage, setStateName} = errorMessages.filter(({id}) => id === key)[0];
        eval(setStateName)(errorMessages);
      }
    }
  }*/

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        await api.getProductCategories(HOST).then((response) => {
          const { error, error_message, data } = response;
          if (error) {
            alert(`Error: ${error_message}`);
          } else {
            setCategoriesSelect(data);
          }
        });
      } catch (error) {
        alert(error.toString());
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
        alert(error.toString());
      }
    };

    const fetchCustomers = async () => {
      try {
        await api
          .getPeopleByRole(HOST, "customer")
          .then(({ error, error_message, data }) => {
            if (error) {
              alert(`Error: ${error_message}`);
            } else {
              setCustomerSelect(data);
            }
          });
      } catch (error) {
        alert(`Error getting employees: ${error.toString()}`);
      }
    };

    const fetchEmployees = async () => {
      try {
        await api
          .getPeopleByRole(HOST, "hairdresser")
          .then(({ error, error_message, data }) => {
            if (error) {
              alert(`Error: ${error_message}`);
            } else {
              setEmployeesSelect(data);
            }
          });
      } catch (error) {
        alert(error.toString());
      }
    };

    fetchProductCategories();
    fetchProducts();
    fetchCustomers();
    fetchEmployees();
  }, []);

  const filterProductsByCategory = (categoryId) => {
    const filteredProducts = productsList.filter(
      ({ category }) => category.toString() === categoryId.toString()
    );
    setProductsSelect(filteredProducts);
  };

  const addSaleProduct = (productId) => {
    setSaleProducts((prevState) => {
      // If this product is already in saleProducts (prevStatee), add one to this product quantity
      // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
      const index = prevState.findIndex(
        (item) => productId.toString() === item.id.toString()
      );
      if (index !== -1) {
        // Creates a new array from prevState, modify the product quantity and final price of the product.
        const products = [...prevState];
        const product = { ...prevState[index] };
        product.quantity = product.quantity + 1;
        product.total_price = (product.price * product.quantity).toFixed(2);
        products[index] = product;
        return products;
      } else {
        // Creates the new fullProduct and adds it to saleProducts
        // Get the selected product object from the products list using the id saved in selectedProduct when a product is clicked.
        const product = productsList.find(
          ({ id }) => id.toString() === productId.toString()
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

  const deleteSaleProduct = (productId) => {
    setSaleProducts((prevState) => {
      // If this product is already in saleProducts (prevStatee), add one to this product quantity
      // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
      const index = prevState.findIndex(
        (item) => productId.toString() === item.id.toString()
      );
      if (index !== -1) {
        // Creates a new array from prevState, modify the product quantity and final price of the product.
        const products = [...prevState];
        products.splice(index, 1);
        return products;
      }
    });
  };

  const decreaseSaleProductQuantity = (productId) => {
    setSaleProducts((prevState) => {
      // If this product is already in saleProducts (prevStatee), add one to this product quantity
      // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
      const index = prevState.findIndex(
        (item) => productId.toString() === item.id.toString()
      );
      if (index !== -1) {
        // Creates a new array from prevState, modify the product quantity and final price of the product.
        const products = [...prevState];
        const product = { ...prevState[index] };
        if (product.quantity > 1) {
          product.quantity = product.quantity - 1;
          product.total_price = (product.price * product.quantity).toFixed(2);
          products[index] = product;
        } else {
          products.splice(index, 1);
        }
        return products;
      }
    });
  };

  const increaseSaleProductQuantity = (productId) => {
    setSaleProducts((prevState) => {
      // If this product is already in saleProducts (prevStatee), add one to this product quantity
      // If not, creates a fullProduct object (with quantity and total price) and adds it to the saleProducts
      const index = prevState.findIndex(
        (item) => productId.toString() === item.id.toString()
      );
      if (index !== -1) {
        // Creates a new array from prevState, modify the product quantity and final price of the product.
        const products = [...prevState];
        const product = { ...prevState[index] };
        product.quantity = product.quantity + 1;
        product.total_price = (product.price * product.quantity).toFixed(2);
        products[index] = product;
        return products;
      }
    });
  };

  const calculateTotalPrice = () => {
    var finalPrice = 0.0;
    saleProducts.forEach(
      ({ total_price }) => (finalPrice += parseFloat(total_price))
    );
    setTotalPrice(finalPrice);
  };

  const saveSale = async () => {
    if (saleProducts.length !== 0) {
      var error = false;
      if (!saleCustomerId) {
        setCustomerIdError(customerIdErrorMessage);
        error = true;
      }
      if (!saleEmployeeId) {
        setEmployeeIdError(employeeIdErrorMessage);
        error = true;
      }
      if (!saleMethodOfPayment) {
        setMethodOfPaymentError(methodOfPaymentErrorMessage);
        error = true;
      }
      if(!error){
        const sale = {
          customer_id: parseInt(saleCustomerId),
          employee_id: parseInt(saleEmployeeId),
          total_price: totalPrice,
          method_of_payment: parseInt(saleMethodOfPayment),
          observations: observations,
        };
        try {
          const { data } = await api.createSale(HOST, sale);
          saleProducts.forEach(async ({ id, quantity }) => {
            const saleProduct = {
              sale_id: parseInt(data.id),
              product_id: id,
              quantity,
            };
            await api.addProductToSale(HOST, saleProduct);
          });
        } catch (error) {
          alert(error.toString());
        }
      }
    }
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [saleProducts]);

  return (
    <div className="view sales">
      <div className="sales column left sold-products">
        <h1>Nueva venta</h1>
        <form>
          <label>
            Selecciona el cliente:
            <select
              onClick={(event) => {
                setSaleCustomerId(event.target.value);
                if(event.target.value){
                  setCustomerIdError("");
                }
              }}
            >
              {customersSelect.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {`${customer.name} ${customer.surname_1} ${customer.surname_2}`}
                </option>
              ))}
            </select>
            <div className="error-msg">{customerIdError}</div>
          </label>
          <label>
            Selecciona el peluquero que ha cobrado el servicio:
            <select
              onClick={(event) => {
                setSaleEmployeeId(event.target.value);
                if(event.target.value){
                  setEmployeeIdError("");
                }
              }}
            >
              {employeesSelect.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {`${employee.name} ${employee.surname_1} ${employee.surname_2}`}
                </option>
              ))}
            </select>
            <div className="error-msg">{employeeIdError}</div>
          </label>
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
                      onClick={(e) => deleteSaleProduct(`${saleProduct.id}`)}
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
        
        <form>
          <label>
            Observaciones:
            <textarea
              onChange={(event) => setObservations(event.target.value)}
              cols="50"
              rows="7"
            ></textarea>
          </label>
          <label>
            Selecciona el método de pago:
            <select
              onClick={(event) => {
                {
                  setSaleMethodOfPayment(event.target.value);
                  if(event.target.value){
                    setMethodOfPaymentError("");
                  }
                }
              }}
            >
              {METHODS_OF_PAYMENT.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
            <div className="error-msg">{methodOfPaymentError}</div>
          </label>
        </form>
        <div>
          <button onClick={() => saveSale()}>Cobrar</button>
        </div>
      </div>
    </div>
  );
}

export default Sales;
