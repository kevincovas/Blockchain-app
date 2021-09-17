import React, { useEffect, useState } from "react";
import * as api from "../api/LoginAndRegister";
import "react-day-picker/lib/style.css";
import { useSnackbar } from "notistack";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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

  // Submit Information to backed API
    const handleSubmit = async () => {
    // Close Dialog
    setOpen(false);
    }
  // Style Material
  const useStyles = makeStyles((theme) => ({
    formsContainer: {
      display: "block",
      padding: "10px",
      backgroundColor: "#F1F9F7",
    },

    btnReservation: {
      backgroundColor: "#555B6E",
    },

    mainPaper: {
      display: "block",
      backgroundColor: "#89b0ae",
      padding: "10px",
    },

    paperCalendar: {
      display: "flex",
      backgroundColor: "#F1F9F7",
    },
  }));
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");

  //Error control
  const { enqueueSnackbar } = useSnackbar();

  // Alert Frame
  const [open, setOpen] = useState(false);

  // Dismiss or Continue
  const handleClose = async (action) => {
    // Close generaate new password
    if (action == 2) {
      setOpen(false);
      setTimeFrame(null);
    }
    // Continue with Reservation
    else {
      // Do Reservation
      await handleSubmit();

      // Redirect to main (only if user)
      if (person != null && JSON.parse(person).role == "customer")
        window.location.href = "/";
    }
  };

  const login = async (e) => {
    
    e.preventDefault();
    try {
      const { error, accessToken, person, user } = await api.login({
        email,
        password,
      });
      console.log(`error: ${error}`);
      console.log(`accessToken: ${accessToken}`);
      console.log(`User: ${user}`);
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
                  <Grid item xs>
                    <Link className="sinLink" href="#" variant="body2" onClick={(e) => setOpen(true)}>
                      Has olvidado la contraseña?
                    </Link>
                  </Grid>
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
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Está seguro de resetear su password?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            <TextField
              label="Correo"
              multiline
              rows={1}
              variant="filled"
              onChange={(event) => setChangePassword(event.target.value)}
            />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={(e) => handleClose(`2`)} color="primary">
              Cancelar
            </Button>
            <Button
              className={classes.btnReservation}
              onClick={(e) => handleClose(`1`)}
              color="primary"
              variant="contained"
              autoFocus
            >
              Resetear
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}

export default Login;
