import React, { useEffect, useState } from "react";
import { HOST, METHODS_OF_PAYMENT } from "../config/const";
import * as api from "../api/Sales";
import "./NewSale.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSnackbar } from 'notistack';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Table, TableHead, TableBody, TableRow, TableCell, TableFooter } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: "left",
  },
  body: {
    fontSize: 12,
    textAlign: "left",
  },
}))(TableCell);

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
const employeeIdDefaultHelperMessage = "Selecciona el peluquero que ha cobrado el servicio.";


function NewSale() {
  const [productsList, setProductsList] = useState([]);
  const [productsSelect, setProductsSelect] = useState([]);
  const [categoriesSelect, setCategoriesSelect] = useState([]);
  const [customersSelect, setCustomerSelect] = useState([]);
  const [employeesSelect, setEmployeesSelect] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [saleCustomerId, setSaleCustomerId] = useState("");
  const [customerIdError, setCustomerIdError] = useState(false);
  const [customerIdHelperMessage, setCustomerIdHelperMessage] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState(false);
  const [employeeIdHelperMessage, setEmployeeIdHelperMessage] = useState(employeeIdDefaultHelperMessage);
  const [methodOfPaymentError, setMethodOfPaymentError] = useState("");
  const [saleEmployeeId, setSaleEmployeeId] = useState("");
  const [saleMethodOfPayment, setSaleMethodOfPayment] = useState("");
  const [observations, setObservations] = useState("");
  const [messages, setMessages] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

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
        setCustomerIdError(true);
        setCustomerIdHelperMessage(customerIdErrorMessage);
        error = true;
      }
      if (!saleEmployeeId) {
        setEmployeeIdError(true);
        setEmployeeIdHelperMessage(employeeIdErrorMessage);
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
    } else {
      enqueueSnackbar("Selecciona algun producto para seguir con la  venta.", {variant: 'error'});
    }
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [saleProducts]);

  return (
    <div className="new-sale view">
      <h1>Nueva venta</h1>
      <div className="new-sale container">
        <div className="new-sale main-column left">
          <form className="new-sale-people-form" onSubmit={(event) => event.preventDefault()}>
            <div className="form-customer-field">
              <Autocomplete
                onChange={(event, value) => {
                  setSaleCustomerId(value.id);
                  if(value.id){
                    setCustomerIdError(false);
                    setCustomerIdHelperMessage("");
                  }
                }}
                size="small"
                fullWidth
                options={customersSelect}
                renderInput={(params)=> <TextField {...params} label="Cliente" helperText={customerIdHelperMessage} error={customerIdError}/>}
                getOptionLabel={option => `${option.name} ${option.surname_1} ${option.surname_2}`}
              />
            </div>
            <div className="form-employee-field">
              <Autocomplete
                onChange={(event, value) => {
                  setSaleEmployeeId(value.id);
                  if(value.id){
                    setEmployeeIdError(false);
                    setEmployeeIdHelperMessage(employeeIdDefaultHelperMessage );
                  }
                }}
                size="small"
                fullWidth
                options={employeesSelect}
                renderInput={(params)=> <TextField {...params} label="Peluquero" helperText={employeeIdHelperMessage} error={employeeIdError}/>}
                getOptionLabel={option => `${option.name} ${option.surname_1} ${option.surname_2}`}
              />
            </div>
          </form>
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell key="name">Producto</StyledTableCell>
                <StyledTableCell key="quantity">Quant</StyledTableCell>
                <StyledTableCell key="unitary-price">€/u.</StyledTableCell>
                <StyledTableCell key="options">Opciones</StyledTableCell>
                <StyledTableCell key="total_price">Precio</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {saleProducts.map((saleProduct) => (
                <TableRow key={saleProduct.id}>
                  <StyledTableCell key={`${saleProduct.id}-name`}>{saleProduct.name}</StyledTableCell>
                  <StyledTableCell key={`${saleProduct.id}-quantity`}>
                    {saleProduct.quantity}
                  </StyledTableCell>
                  <StyledTableCell key={`${saleProduct.id}-price`}>{saleProduct.price}</StyledTableCell>
                  <StyledTableCell key={`${saleProduct.id}-options`}>
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
                  </StyledTableCell>
                  <StyledTableCell key={`${saleProduct.id}-total_price`}>
                    {saleProduct.total_price}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <StyledTableCell key="total-title" colSpan="4" >
                  Importe Total
                </StyledTableCell>
                <StyledTableCell key="final-price" colSpan="4" >
                  {totalPrice.toFixed(2)}
                </StyledTableCell>
              </TableRow>
            </TableFooter> */}
          </Table>        
            {/*<label>
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
            <div>
              <button type="button" onClick={() => saveSale()}>Cobrar</button>
                </div>*/}
        </div>
        <div className="new-sale main-column right">
          <div className="categories-products-container">
            <div className="products-container">
              <p>Productos:</p>
              <div className="buttons-container categories">
                {productsSelect.map((product) => (
                  <Button className="product-button" key={product.id} onClick={() => {
                    addSaleProduct(product.id);
                  }}>
                    {product.name}
                  </Button>
                ))}
              </div>  
            </div>
            <div className="categories-container">
              <p>Categorias:</p>
              <div className="buttons-container categories">
                {categoriesSelect.map((category) => (
                  <Button className="category-button" key={category.id} onClick={() => {
                    filterProductsByCategory(category.id);
                  }}>
                    {category.name.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSale;
