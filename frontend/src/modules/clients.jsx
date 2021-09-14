import React, { useEffect, useState } from "react";
import * as api from "../api/Clients";
import "./clients.css";
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


const clientsIdErrorMessage = "Por favor, escoja un cliente.";


function ClientSearch() {
  const [clientsList, setClientsList] = useState([]);
  const [clientsListFiltered, setclientsListFiltered] = useState([]);
  const [clientsFilter, setClientsFilter] = useState("");
  const [clientSelected, setClietSelected] = useState({});
  const [clientsIdError, setclientsIdError] = useState(false);
  const [clientsIdHelperMessage, setclientsIdHelperMessage] = useState("");


  useEffect(() => {
    const fetchClients = async() => {
      try {
        await api.getClients("customer").then (({ error, error_mesage, data}) => {
        if(error) {
          alert.apply(`Error: ${error_message}`);
        }else {
          setClientsList(data);
          setclientsListFiltered(data);
        }
      });
      } catch(error) {
        alert.apply(error.toString());
      }
    }
      fetchClients();
    }, []);

    useEffect(() => { 
      const filterClients = (text) => {
        const filteredClients = clientsList.filter(({ name, surname_1, surname_2 }) => 
        name.toString().toUpperCase().includes(text.toString().toUpperCase()) || 
        surname_1.toString().toUpperCase().includes(text.toString().toUpperCase()) ||
        surname_2.toString().toUpperCase().includes(text.toString().toUpperCase()));
        setclientsListFiltered(filteredClients);
      };
      filterClients(clientsFilter);
    }, [clientsFilter]);

    useEffect(() => {

    })

   return (
    <div className="client-view">
      <h1>Clientes</h1>
      <input type="text" value={clientsFilter} onChange={(e) => setClientsFilter(e.target.value)} />
      <div className="main-column right">
          <div className="categories-clients-container">
            <div className="clients-container">
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre Cliente</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientsListFiltered.map((client) => (
                <TableRow key={client.id}>
                  <StyledTableCell>{`${client.name} ${client.surname_1} ${client.surname_2}`}</StyledTableCell>
                </TableRow>))}
            </TableBody>

          </Table>    
            </div>
        </div>
      </div>
    </div>
  );
}

export default ClientSearch;

