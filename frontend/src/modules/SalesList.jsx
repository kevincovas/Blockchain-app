import React, { useEffect, useState } from "react";
import { HOST } from "../config/const";
import * as api from "../api/Sales";
import { useSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import "../css/SalesList.css";
import {
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@material-ui/core";

import * as moment from "moment";

import { clientStructure } from "../config/const";

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

function SalesList() {
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  const [salesList, setSalesList] = useState([]);
  const [salesFilteredList, setSalesFilteredList] = useState([]);
  const [selectedSale, setSalectedSale] = useState(clientStructure);
  const [showSaleDetails, setShowSaleDetails] = useState(false);
  const [selectedSaleProducts, setSelectedSaleProducts] = useState([]);
  const [soldProductsTrigger, setSoldProductsTrigger] = useState(true);
  const [clientFilter, setClientFilter] = useState("");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { error, error_message, data } = await api.getSales(HOST, token);
        if (error) {
          enqueueSnackbar(`Error extrayendo ventas: ${error_message}`, {
            variant: "error",
          });
        } else {
          setSalesList(data);
          setSalesFilteredList(data);
        }
      } catch (error) {
        enqueueSnackbar(`Error extrayendo ventas: ${error.toString()}`, {
          variant: "error",
        });
      }
    };

    fetchSales();
  }, []);

  useEffect(() => {
    const fetchSoldProducts = async () => {
      try {
        const { error, error_message, data } = await api.getSoldProducts(
          HOST,
          token,
          selectedSale.id
        );
        if (error) {
          enqueueSnackbar(
            `Error extrayendo productos vendidos: ${error_message}`,
            {
              variant: "error",
            }
          );
        } else {
          setSelectedSaleProducts(data);
        }
      } catch (error) {
        enqueueSnackbar(
          `Error extrayendo productos vendidos: ${error.toString()}`,
          {
            variant: "error",
          }
        );
      }
    };
    if (selectedSale.id) {
      fetchSoldProducts();
    }
  }, [soldProductsTrigger]);

  useEffect(() => {
    const filterSales = (text) => {
      const filteredSales = salesList.filter(({ customer_name }) =>
        customer_name
          .toString()
          .toUpperCase()
          .includes(text.toString().toUpperCase())
      );
      setSalesFilteredList(filteredSales);
    };
    filterSales(clientFilter);
  }, [clientFilter]);

  return (
    <div className="sales-list sales view">
      <h1 className="sales-title">Historial de Ventas</h1>
      <Paper
        elevation={6}
        className="sales-list sales-list-container sales-container"
      >
        <div className="sales-list sales main-column left">
          <div className="shadowed-container sales-list">
            <TextField
              placeholder="Busca por cliente"
              variant="filled"
              size="small"
              value={clientFilter}
              onChange={(event) => {
                setClientFilter(event.target.value);
              }}
            />
            <div className="table-container-sales">
              <Table size="small" className="sales sales-list">
                <TableBody>
                  {salesFilteredList.map((sale) => (
                    <TableRow
                      key={sale.id}
                      onClick={() => {
                        if (!showSaleDetails) {
                          setShowSaleDetails(true);
                        }
                        setSalectedSale(sale);
                        setSoldProductsTrigger(!soldProductsTrigger);
                      }}
                    >
                      <StyledTableCell
                        className="customer-name-option"
                        key={`${sale.id}-customer-name`}
                      >
                        {sale.customer_name.trim()}
                      </StyledTableCell>
                      <StyledTableCell key={`${sale.id}-total-price`}>
                        {sale.total_import}€
                      </StyledTableCell>
                      <StyledTableCell key={`${sale.id}-created-at`}>
                        {`${moment(sale.created_at).format("DD/MM/YYYY")}`}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="sale-list sales main-column left">
          {showSaleDetails ? (
            <div className="view-sale-details-container">
              <div className="clientData">
                <h5 className="clientDataName">
                  {`${selectedSale.customer_name} - ${moment(
                    selectedSale.created_at
                  ).format("DD/MM/YYYY - HH:MM")}`}
                </h5>
                <div className="sold-products-table-container">
                  <Table size="small" className="sales">
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedSaleProducts.map((soldProduct) => (
                        <TableRow key={soldProduct.id}>
                          <StyledTableCell
                            className="name-option"
                            key={`${soldProduct.id}-name`}
                          >
                            {soldProduct.product_name}
                          </StyledTableCell>
                          <StyledTableCell key={`${soldProduct.id}-quantity`}>
                            {soldProduct.quantity}
                          </StyledTableCell>
                          <StyledTableCell key={`${soldProduct.id}-price`}>
                            {soldProduct.product_unit_price}€
                          </StyledTableCell>
                          <StyledTableCell
                            key={`${soldProduct.id}-total_price`}
                          >
                            {(
                              parseInt(soldProduct.product_unit_price) *
                              parseInt(soldProduct.quantity)
                            ).toFixed(2)}
                            €
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="sale-details-container">
                  <p>
                    Peluquero: <span>{selectedSale.employee_name}</span>
                  </p>
                  <p>
                    Método de pago:{" "}
                    <span>
                      {selectedSale.method_of_payment === 0
                        ? "Efectivo"
                        : "Tarjeta"}
                    </span>
                  </p>
                  <p>
                    Importe total: <span>{selectedSale.total_import}€</span>
                  </p>
                  <p>
                    Observaciones:{" "}
                    <span className="block">{selectedSale.observations}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default SalesList;
