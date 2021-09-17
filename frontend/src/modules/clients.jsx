import React, { useEffect, useState } from "react";
import * as api from "../api/Clients";
import "../css/Clients.css";
import * as moment from "moment";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField
} from "@material-ui/core";
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
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

const clientStructure = {
  id: "",
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
  const [editedClientFields, setEditedClientFields] = useState(clientSelected);
  const [editClient, setEditClient] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        await api.getPeopleByRoleExtended("customer", token).then((result) => {
          if (result.status !== "OK") {
            enqueueSnackbar(`Error extrayendo clientes: ${result.details}`, {
              variant: "error",
            });
          } else {
            setClientsList(result.results);
            setclientsListFiltered(result.results);
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
      <Paper elevation={6} className="clients clients-container">
        <div className="clients main-column left">
          <input
            className="searcher"
            type="text"
            value={clientsFilter}
            onChange={(e) => setClientsFilter(e.target.value)}
          />
          <Table size="small">
            <TableBody>
              {clientsListFiltered.map((client) => (
                <TableRow key={client.id}>
                  <StyledTableCell
                    className="row-client"
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
                <EditIcon className="editIcon"
                  onClick={() => {
                    setEditClient(!editClient);
                  }}
                />
              </div>
              {editClient ? (
                <div className="clientDataForm">
                  <form className="editform">
                    <TextField
                      margin="normal"
                      fullWidth
                      id="name"
                      label="Nombre"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      value={`${clientSelected.name}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...clientEdit,
                          name: e.target.value,
                        })
                      }
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      id="surname_1"
                      label="Primer Apellido"
                      name="surname_1"
                      autoComplete="surname_1"
                      autoFocus
                      value={`${clientSelected.surname_1}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...clientEdit,
                          surname_1: e.target.value,
                        })
                      }
                    />
                    <TextField
                      margin="normal"
                      fullWidth
                      id="surname_2"
                      label="Segundo Apellido"
                      name="surname_2"
                      autoComplete="surname_2"
                      autoFocus
                      value={`${clientSelected.surname_2}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...clientEdit,
                          surname_2: e.target.value,
                        })
                      }
                    />
                    
                    <TextField
                      margin="normal"
                      fullWidth
                      id="phone"
                      label="Teléfono"
                      name="phone"
                      autoComplete="phone"
                      autoFocus
                      value={`${clientSelected.phone}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...clientEdit,
                          phone: e.target.value,
                        })
                      }
                    />
                    <div className="date-gender-form">      
                     <TextField
                      className="form-date-fields"
                      margin="normal"
                      id="birth_date"
                      label="Fecha de nacimiento"
                      name="birth_date"
                      autoComplete="birth_date"
                      type="date"
                      autoFocus
                      value={`${clientSelected.birth_date}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...clientEdit,
                          birth_date: e.target.value
                        })
                      }
                    />
                    <Autocomplete
                    className="form-gender-fields"
                    onChange={(event, value) => {
                      console.log(value);
                      if (value) {
                        setGender(value.value);
                      } else {
                        setGender("");
                      }
                    }}
                    fullWidth
                    options={[
                      {
                        name: "Mujer",
                        value: "W",
                      },
                      {
                        name: "Hombre",
                        value: "M",
                      },
                    ]}
                    renderInput={(params) => (
                      <TextField {...params} label="Sexo" />
                    )}
                    getOptionLabel={(option) => `${option.name}`}
                    getOptionSelected={(option) => `${option.value}`}
                    />
                    </div>

                      <TextareaAutosize
                        maxRows={10}
                        aria-label="maximum height"
                        placeholder="Observaciones"
                        type="text"
                        style={{ width: 400}}
                        value={`${clientSelected.observations}`}
                        onChange={(e) =>
                          setEditedClientFields({
                            ...clientEdit,
                            observations: e.target.value,
                          })
                        }
                      />
                  </form>
                </div>
              ) : (
                <div className="clientData">
                  <h5 className="clientDataName">
                    Cliente: 
                    {` ${clientSelected.name} ${clientSelected.surname_1} ${clientSelected.surname_2}`}
                  </h5>
                  <p>
                    Teléfono: {clientSelected.phone == null ? `Sin especificar` : `${clientSelected.phone}`}</p>
                  <p>
                    Fecha de nacimiento:{" "}
                    {`${moment(clientSelected.birth_date).format(
                      "DD-MM-YYYY"
                    )}`}
                  </p>
                  <p>
                    Género: {clientSelected.gender == "W" ? `Mujer` : `Hombre`}
                  </p>
                  <p>Observaciones: {`${clientSelected.observations}`}</p>
                </div>
              )}
            </>
          ) : (
            <></>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default ClientSearch;
