import React, { useEffect, useState } from "react";
import * as api from "../api/Clients";
import "./Clients.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
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
  const token = localStorage.getItem("token");
  const [clientsList, setClientsList] = useState([]);
  const [clientsListFiltered, setclientsListFiltered] = useState([]);
  const [clientsFilter, setClientsFilter] = useState("");
  const [clientSelected, setClientSelected] = useState(clientStructure);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [clientsIdError, setclientsIdError] = useState(false);
  const [clientsIdHelperMessage, setclientsIdHelperMessage] = useState("");
  const { enqueueSnackbar } = useSnackbar();


  /*const Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
  }*/

  useEffect(() => {
    const fetchClients = async () => {
      try {
        await api
          .getPeopleByRoleExtended("customer", token)
          .then(({ error, error_message, data }) => {
            if (error) {
              enqueueSnackbar(`Error extrayendo clientes: ${error_message}`,{
                variant: "error",
              });
            } else {
              setClientsList(data);
              setclientsListFiltered(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(`Error extrayendo clientes: ${error.toString()}`,{
          variant: "error",
        });
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
              <h3>Nombre: {`${clientSelected.name} ${clientSelected.surname_1} ${clientSelected.surname_2}`}
              </h3>
              <p>Teléfono: {`${clientSelected.phone}`}</p>
              <p>Fecha de nacimiento: {`${clientSelected.birth_date.setTime(
                  birth_date.getTime() - birth_date.getTimezoneOffset() * 60 * 1000)}`}</p>
              <p>Género: {`${clientSelected.gender}`}</p>
              <p>Observaciones: {`${clientSelected.observations}`}</p>
              <p>Id Usuario: {`${clientSelected.user_id}`}</p>
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
