import React, { useEffect, useState } from "react";
import { HOST } from "../config/const";
import * as api from "../api/Sales";
import "../css/Sales.css";
import "../css/NewSale.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faTrash,
  faMoneyBillWave,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import { useSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

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

// function useMounted() {
//   /*
//     Custom hook created to check if the component is being mounted or if it has already been mounted.
//   */
//   const [isMounted, setIsMounted] = useState(false);
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);
//   return isMounted;
// }

const methodOfPayment = "methodOfPayment";
const employeeId = "employeeId";
const customerId = "customerId";
const methodOfPaymentErrorMessage = "Por favor, escoja un método de pago.";
const customerIdErrorMessage = "Por favor, escoja un cliente.";
const employeeIdErrorMessage =
  "Por favor, escoja el peluquero que ha cobrado el servicio.";
const employeeIdDefaultHelperMessage =
  "Selecciona el peluquero que ha cobrado el servicio.";

function NewSale() {
  const token = localStorage.getItem("token");
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const [productsList, setProductsList] = useState([]);
  const [productsSelect, setProductsSelect] = useState([]);
  const [categoriesSelect, setCategoriesSelect] = useState([]);
  const [customersSelect, setCustomerSelect] = useState([]);
  const [employeesSelect, setEmployeesSelect] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [saleProducts, setSaleProducts] = useState([]);
  const [saleCustomerId, setSaleCustomerId] = useState(null);

  const [saleEmployeeId, setSaleEmployeeId] = useState(null);
  const [saleMethodOfPayment, setSaleMethodOfPayment] = useState("");
  const [observations, setObservations] = useState("");
  const [isDialogOpened, setDialogOpen] = useState(false);

  //Errors
  const [employeeIdError, setEmployeeIdError] = useState(false);
  const [employeeIdHelperMessage, setEmployeeIdHelperMessage] = useState(
    employeeIdDefaultHelperMessage
  );
  const [customerIdError, setCustomerIdError] = useState(false);
  const [customerIdHelperMessage, setCustomerIdHelperMessage] = useState("");

  /*const checkGenericValue = (key, value) => {
    if(!value){
      const {errorMessage, setStateName} = errorMessages.filter(({id}) => id === key)[0];
        eval(setStateName)(errorMessages);
      }
    }
  }*/
  useEffect(() => {
    /* 
      Only executed on component first render. 
      It gets the product categories, products, customers and hairdressers from the database and updates the states: 
        - productsList: list of all the products
    */
    const fetchProductCategories = async () => {
      try {
        await api.getProductCategories(HOST, token).then((response) => {
          const { error, error_message, data } = response;
          if (error) {
            enqueueSnackbar(
              `Error extrayendo categorías de productoa: ${error_message}`,
              {
                variant: "error",
              }
            );
          } else {
            setCategoriesSelect(data);
          }
        });
      } catch (error) {
        enqueueSnackbar(
          `Error extrayendo categorías de producto: ${error.toString()}`,
          {
            variant: "error",
          }
        );
      }
    };

    const fetchProducts = async () => {
      try {
        await api
          .getProducts(HOST, token)
          .then(({ error, error_message, data }) => {
            if (error) {
              enqueueSnackbar(`Error extrayendo productos: ${error_message}`, {
                variant: "error",
              });
            } else {
              setProductsList(data);
              setProductsSelect(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(`Error extrayendo productos: ${error.toString()}`, {
          variant: "error",
        });
      }
    };

    const fetchCustomers = async () => {
      try {
        await api.getPeopleByRole(HOST, token, "customer").then((result) => {
          if (result.status !== "OK") {
            enqueueSnackbar(`Error extrayendo clientes: ${result.details}`, {
              variant: "error",
            });
          } else {
            setCustomerSelect(result.results);
          }
        });
      } catch (error) {
        enqueueSnackbar(`Error extrayendo clientes: ${error.toString()}`, {
          variant: "error",
        });
      }
    };

    const fetchEmployees = async () => {
      try {
        await api.getPeopleByRole(HOST, token, "hairdresser").then((result) => {
          if (result.status !== "OK") {
            enqueueSnackbar(`Error extrayendo peluqueros: ${result.details}`, {
              variant: "error",
            });
          } else {
            setEmployeesSelect(result.results);
          }
        });
      } catch (error) {
        enqueueSnackbar(`Error extrayendo peluqueros: ${error.toString()}`, {
          variant: "error",
        });
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

  const checkSale = () => {
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
      return error;
    } else {
      enqueueSnackbar("Selecciona algun producto para seguir con la venta.", {
        variant: "error",
      });
      return true;
    }
  };

  const saveSale = async () => {
    const error = checkSale();
    if (!error) {
      const sale = {
        customer_id: parseInt(saleCustomerId),
        employee_id: parseInt(saleEmployeeId),
        total_price: totalPrice,
        method_of_payment: parseInt(saleMethodOfPayment),
        observations: observations,
      };
      try {
        const saleResult = await api.createSale(HOST, token, sale);
        if (saleResult.error) {
          enqueueSnackbar(saleResult.error_message, {
            variant: "error",
          });
        } else {
          var createProductsError = false;
          saleProducts.forEach(async ({ id, quantity, name, price }) => {
            const saleProduct = {
              sale_id: parseInt(saleResult.data.id),
              product_id: id,
              quantity,
              product_name: name,
              product_unit_price: parseInt(price).toFixed(2),
            };
            var productResult = await api.addProductToSale(
              HOST,
              token,
              saleProduct
            );
            if (productResult.error) {
              enqueueSnackbar(productResult.error_message, {
                variant: "error",
              });
              createProductsError = true;
            }
          });
          if (!createProductsError) {
            enqueueSnackbar("La venta se ha guardado correctamente", {
              variant: "success",
            });
            setDialogOpen(false);
            history.push("/sales/list/");
            // cleanStates();
          }
        }
      } catch (error) {
        enqueueSnackbar(error.toString(), {
          variant: "error",
        });
      }
    }
  };

  const setOptionsForAutocompletes = (option) => {
    return `${option.name} ${option.surname_1} ${option.surname_2}`;
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [saleProducts]);

  return (
    <div className="new-sale sales view">
      <h1 className="sales-title">Nueva venta</h1>
      <Paper
        elevation={6}
        className="new-sale new-sale-container sales-container"
      >
        <div className="new-sale sales main-column left">
          <div className="categories-products-container">
            <div className="products-container">
              <p>Productos:</p>
              <div className="buttons-container products">
                {productsSelect.map((product) => (
                  <Button
                    className="product-button"
                    key={product.id}
                    onClick={() => {
                      addSaleProduct(product.id);
                    }}
                  >
                    {product.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="categories-container">
              <p>Categorias:</p>
              <div className="buttons-container categories">
                {categoriesSelect.map((category) => (
                  <Button
                    className="category-button"
                    key={category.id}
                    onClick={() => {
                      filterProductsByCategory(category.id);
                    }}
                  >
                    {category.name.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="new-sale sales main-column left">
          <div className="account-total-container">
            <div className="account-container">
              <form
                className="new-sale-people-form"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="form-customer-field">
                  <Autocomplete
                    onChange={(event, value) => {
                      if (value) {
                        setSaleCustomerId(value.id);
                        setCustomerIdError(false);
                        setCustomerIdHelperMessage("");
                      } else {
                        setSaleCustomerId("");
                        setCustomerIdError(true);
                        setCustomerIdHelperMessage(customerIdErrorMessage);
                      }
                    }}
                    size="small"
                    fullWidth
                    options={customersSelect}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cliente"
                        helperText={customerIdHelperMessage}
                        error={customerIdError}
                      />
                    )}
                    getOptionLabel={(option) =>
                      setOptionsForAutocompletes(option)
                    }
                  />
                </div>
                <div className="form-employee-field">
                  <Autocomplete
                    onChange={(event, value) => {
                      if (value) {
                        setSaleEmployeeId(value.id);
                        setEmployeeIdError(false);
                        setEmployeeIdHelperMessage(
                          employeeIdDefaultHelperMessage
                        );
                      } else {
                        setSaleCustomerId("");
                        setEmployeeIdError(true);
                        setEmployeeIdHelperMessage(employeeIdErrorMessage);
                      }
                    }}
                    size="small"
                    fullWidth
                    options={employeesSelect}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Peluquero"
                        helperText={employeeIdHelperMessage}
                        error={employeeIdError}
                      />
                    )}
                    getOptionLabel={(option) =>
                      setOptionsForAutocompletes(option)
                    }
                  />
                </div>
              </form>
              <div className="sold-products-table-container">
                <Table stickyHeader size="small" className="sales">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell className="name-option" key="name">
                        Producto
                      </StyledTableCell>
                      <StyledTableCell key="quantity">Cant</StyledTableCell>
                      <StyledTableCell key="unitary-price">
                        €/u.
                      </StyledTableCell>
                      <StyledTableCell key="total_price">
                        Precio
                      </StyledTableCell>
                      <StyledTableCell key="options">Opciones</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleProducts.map((saleProduct) => (
                      <TableRow key={saleProduct.id}>
                        <StyledTableCell
                          className="name-option"
                          key={`${saleProduct.id}-name`}
                        >
                          {saleProduct.name}
                        </StyledTableCell>
                        <StyledTableCell key={`${saleProduct.id}-quantity`}>
                          {saleProduct.quantity}
                        </StyledTableCell>
                        <StyledTableCell key={`${saleProduct.id}-price`}>
                          {saleProduct.price}
                        </StyledTableCell>
                        <StyledTableCell key={`${saleProduct.id}-total_price`}>
                          {saleProduct.total_price}
                        </StyledTableCell>
                        <StyledTableCell key={`${saleProduct.id}-options`}>
                          <div className="sale-option-action-buttons-container">
                            <FontAwesomeIcon
                              icon={faMinus}
                              onClick={(e) =>
                                decreaseSaleProductQuantity(`${saleProduct.id}`)
                              }
                              className="sale-action-icon decrease"
                            />
                            <FontAwesomeIcon
                              icon={faPlus}
                              onClick={(e) =>
                                increaseSaleProductQuantity(`${saleProduct.id}`)
                              }
                              className="sale-action-icon increase"
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              onClick={(e) =>
                                deleteSaleProduct(`${saleProduct.id}`)
                              }
                              className="sale-action-icon delete"
                            />
                          </div>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
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
            <div className="total-container">
              <div className="final-import-container">
                <div className="final-import-label">
                  <p>Importe total:</p>
                </div>
                <div className="final-import-value">
                  <p>{totalPrice.toFixed(2)}€</p>
                </div>
              </div>
              <div className="mop-buttons-container">
                <Button
                  key="0"
                  className="mop-button"
                  onClick={() => {
                    if (!checkSale()) {
                      setSaleMethodOfPayment(0);
                      setDialogOpen(true);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faMoneyBillWave}
                    className="mop-button-icon"
                  />
                </Button>
                <Button
                  key="1"
                  className="mop-button"
                  onClick={() => {
                    if (!checkSale()) {
                      setSaleMethodOfPayment(1);
                      setDialogOpen(true);
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="mop-button-icon"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Paper>
      <Dialog
        open={isDialogOpened}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"¿Deseas guardar la venta?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              label="Observaciones"
              multiline
              rows={5}
              variant="filled"
              onChange={(event) => setObservations(event.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
            color="primary"
          >
            Cancelar
          </Button>
          <Button onClick={() => saveSale()} color="primary" autoFocus>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NewSale;
