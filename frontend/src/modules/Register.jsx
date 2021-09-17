import React, { useEffect, useState } from "react";
import * as api from "../api/LoginAndRegister";
import "react-day-picker/lib/style.css";
import { useLocation } from "react-router";
import { useSnackbar } from "notistack";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import "../css/LoginAndRegister.css";

function Register() {

  //States
  const [name, setName] = useState("");
  const [surname_1, setApellido1] = useState("");
  const [surname_2, setApellido2] = useState("");
  const [gender, setGender] = useState("M");
  const [birth_date, setBirth_date] = useState("0001-01-01");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();

  const history = useHistory();

  //Error control
  const { enqueueSnackbar } = useSnackbar();

  const register = async (e) => {
    e.preventDefault();
    //For check that the all required fields aren't empty
    var is_wrong = false;
    if (!name) {
      enqueueSnackbar("El campo nombre no puede estar vacío", {
        variant: "error",
      });
      is_wrong = true;
    }
    if (!surname_1) {
      enqueueSnackbar("El campo primer apellido no puede estar vacío", {
        variant: "error",
      });
      is_wrong = true;
    }
    if (!gender) {
      enqueueSnackbar("Es obligatorio seleccionar un género", {
        variant: "error",
      });
      is_wrong = true;
    }
    //If all fiels are okey the we have the register
    if (!is_wrong) {
      try {
        //Check that the email of the user doesn't exists 
        const userExists = await api.user_exist({ email });
        if (!userExists.data.exists) {
          const valPassword = validatePassword(password);
          if (valPassword) {
            const result = await api.register({ email, password, token });
            if (result.status !== "OK") {
              enqueueSnackbar(`Error: ${result.details.toString()}`, {
                variant: "error",
              });
            } else {
              const user_id = result.results.id;
              //Save the fields of the client
              const result2 = await api.register_client({
                name,
                surname_1,
                surname_2,
                gender,
                birth_date,
                phone,
                user_id,
              });
              if (result2.status !== "OK") {
                enqueueSnackbar(`Error: ${result2.details.toString()}`, {
                  variant: "error",
                });
              } else {
                enqueueSnackbar("Usuario y cliente creado", {
                  variant: "success",
                });
                history.push("/");
              }
            }
          }
        } else {
          enqueueSnackbar("Este correo ya está registrado", {
            variant: "error",
          });
        }
      } catch (err) {
        enqueueSnackbar(`Error: ${err.toString()}`, {
          variant: "error",
        });
      }
    }
  };

  function validatePassword(p) {
    if (p.length < 8 || p.search(/[a-z]/i) < 0 || p.search(/[0-9]/) < 0) {
      enqueueSnackbar(
        "La contraseña debe tener almenos 8 carácteres, una letra y un número.",
        {
          variant: "error",
        }
      );
      return false;
    }
    return true;
  }

  const theme = createTheme();

  return (
    <div className="register-page">
      <ThemeProvider theme={theme}>
        <Grid
          container
          className="container-main"
          component="main"
          sx={{ height: "100vh" }}
        >
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid className="box-register"
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar className="coorporativeicon" sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Registro nuevo cliente
              </Typography>
              <Box className="form-register" sx={{ mt: 1 }}>
                <form onSubmit={register}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Nombre"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="surname_1"
                    label="Primer Apellido"
                    type="text"
                    id="surname_1"
                    autoComplete="current-surname_1"
                    value={surname_1}
                    onChange={(e) => setApellido1(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    name="surname_2"
                    label="Segundo Apellido"
                    type="text"
                    id="surname_2"
                    autoComplete="current-surname_2"
                    value={surname_2}
                    onChange={(e) => setApellido2(e.target.value)}
                  />
                  <Autocomplete
                    onChange={(event, value) => {
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
                  <TextField
                    margin="normal"
                    fullWidth
                    name="phone"
                    label="Teléfono"
                    type="text"
                    id="phone"
                    autoComplete="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    name="birth_date"
                    label="Fecha de Nacimiento"
                    type="date"
                    id="birth_date"
                    autoComplete="birth_date"
                    value={birth_date}
                    onChange={(e) => setBirth_date(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="email"
                    label="Correo"
                    type="email"
                    id="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    className="corporativeButton"
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Registrarse
                  </Button>
                </form>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default Register;
