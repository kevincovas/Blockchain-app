import React, { useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import * as api from "../api/LoginAndRegister";
import { useSnackbar } from "notistack";

function ChangePassword(props) {
  // Alert Frame
  const { enqueueSnackbar } = useSnackbar();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const changePassword = async () => {
    try {
      const token = localStorage.getItem("token");      
      const results = await api.changePassword({
        token,
        password,
        newPassword,
        confirmNewPassword,
      });
      if (results.status !== "OK") {
        enqueueSnackbar(`Error al cambiar contraseña: ${results.details}`, {
          variant: "error",
        });
      } else {
        props.closeDialog();
        enqueueSnackbar("Contraseña cambiada correctamente", {
          variant: "success",
        });
      }
    } catch (err) {
      enqueueSnackbar(err.toString(), {
        variant: "error",
      });
    }
  };

  return (
    <Dialog
      open={props.dialogOpened}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Cambio de contraseña:"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña actual"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Nueva Contraseña"
          type="password"
          autoComplete="current-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Confirmar Nueva Contraseña"
          type="password"
          autoComplete="current-password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => props.closeDialog()} color="primary">
          Cancelar
        </Button>
        <Button
          onClick={(e) => changePassword(e)}
          color="primary"
          variant="contained"
          autoFocus
        >
          Cambiar Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChangePassword;
