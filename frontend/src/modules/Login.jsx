import React, { useEffect, useState } from "react";
import * as api from "../api/LoginAndRegister";
import "react-day-picker/lib/style.css";
import { useSnackbar } from "notistack";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import "../css/LoginAndRegister.css";
import { makeStyles } from "@material-ui/core/styles";

function Login({ onLogin }) {
  //States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");

  //Error control
  const { enqueueSnackbar } = useSnackbar();

  //Function of login
  const login = async (e) => {
    e.preventDefault();
    try {
      const { error, accessToken, person, user } = await api.login({
        email,
        password,
      });
      if (error) {
        setMessage({ type: "error", text: error });
      } else {
        if (accessToken == undefined) {
          enqueueSnackbar(`Usuario o contraseña incorrecta`, {
            variant: "error",
          });
        } else {
          onLogin(accessToken, person, user);
        }
      }
    } catch (err) {
      setMessage({ type: "error", text: err.toString() });
    }
  };

  const theme = createTheme();

  return (
    <div className="login-page">
      <ThemeProvider theme={theme}>
        <Grid
          className="container-main"
          container
          component="main"
          sx={{ height: "100vh" }}
        >
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} />
          <Grid
            className="box-login"
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
              <Avatar
                className="coorporativeicon"
                sx={{ m: 1, bgcolor: "secondary.main" }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Iniciar Sesión
              </Typography>
              <Box sx={{ mt: 1 }}>
                <form onSubmit={(e) => login(e)}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Correo"
                    name="email"
                    autoComplete="email"
                    autoFocus
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
                    autoComplete="current-password"
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
                    Iniciar Sesión
                  </Button>
                </form>
                <Grid container>
                  <Grid item>
                    <Link className="sinLink" href="/register" variant="body2">
                      ¿No tienes una cuenta? {"Regístrate"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default Login;
