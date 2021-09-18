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
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { clientStructure, genderOptions } from "../config/const";

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

  useEffect(() => {
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

  const saveClient = async () => {
    var is_wrong = false;
    if (!editedClientFields.name) {
      enqueueSnackbar("El campo nombre no puede estar vacío", {
        variant: "error",
      });
      is_wrong = true;
    }
    if (!editedClientFields.surname_1) {
      enqueueSnackbar("El campo primer apellido no puede estar vacío", {
        variant: "error",
      });
      is_wrong = true;
    }
    if (!editedClientFields.gender) {
      enqueueSnackbar("Es obligatorio seleccionar un género", {
        variant: "error",
      });
      is_wrong = true;
    }
    if (!is_wrong) {
      try {
        const editResult = await api.updateClient(editedClientFields, token);
        if (editResult.error) {
          enqueueSnackbar(editResult.error_message, {
            variant: "error",
          });
        } else {
          enqueueSnackbar("Cliente editado correctamente", {
            variant: "success",
          });

          fetchClients();
          setClientSelected(editedClientFields);
          setEditClient(false);
        }
      } catch (error) {
        enqueueSnackbar(`Error extrayendo clientes: ${error.toString()}`, {
          variant: "error",
        });
      }
    }
  };

  return (
    <div className="clients view">
      <h1 className="clients-title">Clientes</h1>
      <Paper elevation={6} className="clients clients-container">
        <div className="clients main-column left">
          <div className="shadowed-container clients-list">
            <TextField
              placeholder="Busca por cliente"
              variant="filled"
              size="small"
              value={clientsFilter}
              onChange={(event) => {
                setClientsFilter(event.target.value);
              }}
            />
            <div className="container-table-client">
              <Table size="small" className="clients">
                <TableBody>
                  {clientsListFiltered.map((client) => (
                    <TableRow
                      key={client.id}
                      onClick={() => {
                        if (!showClientDetails) {
                          setShowClientDetails(true);
                        }
                        setClientSelected(client);
                      }}
                    >
                      <StyledTableCell className="row-client">{`${client.name} ${client.surname_1} ${client.surname_2}`}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="clients main-column right">
          {showClientDetails ? (
            <>
              <div className="clients editClient">
                <EditIcon
                  className="editIcon"
                  onClick={() => {
                    setEditClient(!editClient);
                    setEditedClientFields(clientSelected);
                  }}
                />
              </div>
              {editClient ? (
                <div className="clientDataForm">
                  <form
                    className="editform"
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveClient();
                    }}
                  >
                    <TextField
                      margin="normal"
                      fullWidth
                      id="name"
                      label="Nombre"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      value={`${editedClientFields.name}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...editedClientFields,
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
                      value={`${editedClientFields.surname_1}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...editedClientFields,
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
                      value={`${editedClientFields.surname_2}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...editedClientFields,
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
                      value={
                        editedClientFields.phone
                          ? `${editedClientFields.phone}`
                          : ""
                      }
                      onChange={(e) =>
                        setEditedClientFields({
                          ...editedClientFields,
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
                        value={`${moment(
                          Date.parse(editedClientFields.birth_date)
                        ).format("YYYY-MM-DD")}`}
                        onChange={(e) =>
                          setEditedClientFields({
                            ...editedClientFields,
                            birth_date: e.target.value,
                          })
                        }
                      />
                      <div className="select-container">
                        <InputLabel id="gender-select-label">Sexo</InputLabel>
                        <Select
                          fullWidth
                          margin="normal"
                          labelId="gender-select-label"
                          id="gender-select"
                          value={`${editedClientFields.gender}`}
                          label="Sexo"
                          variant="standard"
                          className="select"
                          onChange={(e) => {
                            setEditedClientFields({
                              ...editedClientFields,
                              gender: e.target.value,
                            });
                          }}
                        >
                          {genderOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <TextField
                      label="Observaciones"
                      fullWidth
                      multiline
                      rows={3}
                      variant="standard"
                      type="text"
                      value={`${editedClientFields.observations}`}
                      onChange={(e) =>
                        setEditedClientFields({
                          ...editedClientFields,
                          observations: e.target.value,
                        })
                      }
                    />
                    <Button
                      className="corporativeButton clients"
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Guardar
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="clientData">
                  <h5 className="clientDataName">
                    Cliente:
                    {` ${clientSelected.name} ${clientSelected.surname_1} ${clientSelected.surname_2}`}
                  </h5>
                  <p>
                    Teléfono:{" "}
                    {clientSelected.phone == null
                      ? `Sin especificar`
                      : `${clientSelected.phone}`}
                  </p>
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
