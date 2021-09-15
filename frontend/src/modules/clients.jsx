import React, { useEffect, useState } from "react";
import * as api from "../api/Clients";
import "./Clients.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

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

const clientStructure = {
  name: "",
  surname_1:"",
  surname_2:"",
  phone:"",
  birth_date:"",
  gender:"",
  observations:"",
  user_id:"",
}

function ClientSearch() {
  const [clientsList, setClientsList] = useState([]);
  const [clientsListFiltered, setclientsListFiltered] = useState([]);
  const [clientsFilter, setClientsFilter] = useState("");
  const [clientSelected, setClientSelected] = useState(clientStructure);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [clientsIdError, setclientsIdError] = useState(false);
  const [clientsIdHelperMessage, setclientsIdHelperMessage] = useState("");




  useEffect(() => {
    const fetchClients = async () => {
      try {
        await api
          .getPeopleByRoleExtended("customer")
          .then(({ error, error_mesage, data }) => {
            if (error) {
              alert.apply(`Error: ${error_message}`);
            } else {
              setClientsList(data);
              setclientsListFiltered(data);
            }
          });
      } catch (error) {
        alert.apply(error.toString());
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const filterClients = (text) => {
      const filteredClients = clientsList.filter(
        ({ name, surname_1, surname_2 }) =>
          name
            .toString()
            .toUpperCase()
            .includes(text.toString().toUpperCase()) ||
          surname_1
            .toString()
            .toUpperCase()
            .includes(text.toString().toUpperCase()) ||
          surname_2
            .toString()
            .toUpperCase()
            .includes(text.toString().toUpperCase())
      );
      setclientsListFiltered(filteredClients);
    };
    filterClients(clientsFilter);
  }, [clientsFilter]);

  
  return (
    <div className="clients view">
      <h1>Clientes</h1>
      <input
        type="text"
        value={clientsFilter}
        onChange={(e) => setClientsFilter(e.target.value)}
      />
      <div className="clients container">
        <div className="clients main-column left">
          <Table size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre Cliente</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientsListFiltered.map((client) => (
                <TableRow key={client.id}>
                  <StyledTableCell onClick={()=>
                    {
                      console.log("estoy en el onclick");
                      if(!showClientDetails){
                        setShowClientDetails(true);
                      }
                      setClientSelected(client);
                    }
                  }>{`${client.name} ${client.surname_1} ${client.surname_2}`}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="clients main-column right">
          {showClientDetails ? (
            <>
              <h3>
                <br>Nombre: </br>
                {`${clientSelected.name} ${clientSelected.surname_1} ${clientSelected.surname_2}`}
              </h3>
              <p>
                <br></br>
              </p>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientSearch;
