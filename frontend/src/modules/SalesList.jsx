import React, { useEffect, useState } from "react";
import { HOST, METHODS_OF_PAYMENT } from "../config/const";
import * as api from "../api/Sales";
import { useSnackbar } from "notistack";
import { withStyles } from "@material-ui/core/styles";
import "../css/SalesList.css";
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
  const [clientDetails, setClientDetails] = useState(clientStructure);
  const [showClientDetails, setshowClientDetails] = useState(false);
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { error, error_message, data } = await api.getSales();
        if (error) {
          enqueueSnackbar(
            `Error extrayendo categorías de productoa: ${error_message}`,
            {
              variant: "error",
            }
          );
        } else {
          setSalesList(data);
          setSalesFilteredList(data);
        }
      } catch (error) {
        enqueueSnackbar(
          `Error extrayendo categorías de producto: ${error.toString()}`,
          {
            variant: "error",
          }
        );
      }
    };

    fetchSales();
  }, []);

  return (
    <div className="sales-list sales view">
      <h1 className="sales-title">Historial de Ventas</h1>
      <Paper elevation={6} className="sales-list sales-list-container sales-container">
        <div className="sales-list sales main-column right">
          <Table>
            <TableBody>
              {salesFilteredList.map((sale) => (
                <TableRow key={sale.id}>
                  <StyledTableCell
                    className="customer-name-option"
                    key={`${sale.id}-customer-name`}
                  >
                    {sale.customer_name.trim()}
                  </StyledTableCell>
                  <StyledTableCell key={`${sale.id}-total-price`}>
                    {sale.total_price}
                  </StyledTableCell>
                  <StyledTableCell key={`${sale.id}-created-at`}>
                    {`${moment(sale.created_at).format(
                      "DD-MM-YYYY"
                    )}`}
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
}

export default SalesList;