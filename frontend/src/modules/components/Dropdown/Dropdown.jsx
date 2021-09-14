import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

class Dropdown extends Component {
  // To Get Hairdressers
  render() {
    return (
      <div className={this.props.className}>
        <Autocomplete
          onChange={(event, value) => {
            if (value == null) {
              this.props.setId(0);
              this.props.setIdHelperMessage(this.props.idHelperMessage);
            } else {
              this.props.setId(value.id);
              if (value.id) {
                this.props.setIdError(false);
              }
            }
          }}
          size="small"
          options={this.props.select}
          renderInput={(params) => (
            <TextField
              {...params}
              label={this.props.field}
              helperText={this.props.idHelperMessage}
              error={this.props.IdError}
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
