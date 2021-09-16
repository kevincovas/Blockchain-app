import React, { useEffect, useState } from "react";
import * as api from "../api/Clients";
import "./Clients.css";
import * as moment from "moment";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
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

const clientStructure = {
  id:"",
  name: "",
  surname_1: "",
  surname_2: "",
  phone: "",
  birth_date: "",
  gender: "",
  observations: "",
  user_id: "",
};

function ClientSearch() {
  const token = localStorage.getItem("token");
  const [clientsList, setClientsList] = useState([]);
  const [clientsListFiltered, setclientsListFiltered] = useState([]);
  const [clientsFilter, setClientsFilter] = useState("");
  const [clientSelected, setClientSelected] = useState(clientStructure);
  const [clientEdit, setClientEdit] = useState(clientSelected);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        await api
          .getPeopleByRoleExtended("customer", token)
          .then(({ error, error_message, data }) => {
            if (error) {
              enqueueSnackbar(`Error extrayendo clientes: ${error_message}`, {
                variant: "error",
              });
            } else {
              setClientsList(data);
              setclientsListFiltered(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(`Error extrayendo clientes: ${error.toString()}`, {
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

  /*function editClient(field) {
      try {
        await api
          .getUpdateClient(id, token)
          .then(({ error, error_message, data }) => {
            if (error) {
              enqueueSnackbar(`Error extrayendo clientes: ${error_message}`, {
                variant: "error",
              });
            } else {
              setEditClient(data);
            }
          });
      } catch (error) {
        enqueueSnackbar(`Error extrayendo clientes: ${error.toString()}`, {
          variant: "error",
        });
      }
    };*/
  

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
                  <StyledTableCell
                    onClick={() => {
                      console.log("estoy en el onclick");
                      if (!showClientDetails) {
                        setShowClientDetails(true);
                      }
                      setClientSelected(client);
                    }}
                  >{`${client.name} ${client.surname_1} ${client.surname_2}`}</StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="clients main-column right">
          {showClientDetails ? (
            <>
              <div className="clients editClient">
                <EditIcon
                  onClick={() => {
                    console.log("estoy en el onclick del edit");
                    var clientData = document.querySelector(
                      "#root > div > div.clients.view > div > div.clients.main-column.right > div > div.clientData"
                    );
                    if (clientData.style.display == "block") {
                      console.log("Hola block");
                      clientData.style.display = "none";
                    } else {
                      console.log("Hola no block");
                      clientData.style.display = "block";
                    }
                    var clientDataForm = document.querySelector(
                      "#root > div > div.clients.view > div > div.clients.main-column.right > div > div.clientDataForm"
                    );
                    if (clientDataForm.style.display == "none") {
                      console.log("QUE none");
                      clientDataForm.style.display = "block";
                    } else {
                      console.log("QUE no none");
                      clientDataForm.style.display = "none";
                    }
                  }}
                />
                <div className="clientData">
                  <h3>
                    Nombre:{" "}
                    {`${clientSelected.name} ${clientSelected.surname_1} ${clientSelected.surname_2}` }
                  </h3>
                  <p>Teléfono: {`${clientSelected.phone}`}</p>
                  <p>
                    Fecha de nacimiento:{" "}
                    {`${moment(clientSelected.birth_date).format(
                      "DD-MM-YYYY"
                    )}`}
                  </p>
                  <p>Género: {`${clientSelected.gender}`}</p>
                  <p>Observaciones: {`${clientSelected.observations}`}</p>
                </div>
                <div className="clientDataForm">
                  <form>
                    <label>
                      <div>Nombre</div>
                      <input
                        type="text"
                        value={`${clientSelected.name}`} onChange={(e) => setClientEdit()}
                      />
                    </label>
                    <label>
                      <div>Primer Apellido</div>
                      <input
                        type="text"
                        value={`${clientSelected.surname_1}`} onChange={(e) => setClientEdit()}
                      />
                    </label>
                    <label>
                      <div>Segundo Apellido</div>
                      <input
                        type="text"
                        value={`${clientSelected.surname_2}`} onChange={(e) => setClientEdit()}
                      />
                    </label>
                    <label>
                      <div>Teléfono:</div>
                      <input type="text" value={`${clientSelected.phone}`} />
                    </label>
                    <label>
                      <div>Fecha de nacimiento:</div>
                      <input
                        type="text"
                        value={`${moment(clientSelected.birth_date).format(
                          "DD-MM-YYYY")}
                        )`}
                      />
                    </label>
                    <label>
                      <div>Género:</div>
                      <input type="text" value={`${clientSelected.gender}`} />
                    </label>
                    <label>
                      <div>Observaciones:</div>
                      <input
                        type="text"
                        value={`${clientSelected.observations}`}
                      />
                    </label>
                  </form>
                </div>
              </div>
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
