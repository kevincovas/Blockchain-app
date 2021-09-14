import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

class Dropdown extends Component {
  
  // To Get Hairdressers
  render() {
    return (
      <div className="form-employee-field">
        <Autocomplete
          onChange={(event, value) => {
            if (value == null) this.props.setEmployeeId(0);
            else {
              this.props.setEmployeeId(value.id);
              if (value.id) {
                this.props.setEmployeeIdError(false);
                this.props.setEmployeeIdHelperMessage(
                  this.props.employeeIdDefaultHelperMessage
                );
              }
            }
          }}
          size="small"
          fullWidth
          options={this.props.employeesSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label={this.props.field}
              helperText={this.props.employeeIdHelperMessage}
              error={this.props.employeeIdError}
            />
          )}
          getOptionLabel={(option) =>
            `${option.name} ${option.surname_1} ${option.surname_2}`
          }
        />
      </div>
    );
  }
}

export default Dropdown;
