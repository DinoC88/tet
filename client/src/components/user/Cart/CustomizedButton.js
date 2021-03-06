import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Tooltip } from "@material-ui/core";
import { purple } from "@material-ui/core/colors";
import { Delete } from "@material-ui/icons";
import { FormattedMessage } from "react-intl";
const DeleteCartButton = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#2b9e82",
    "&:hover": {
      backgroundColor: "#1e705c"
    },
    height: "200px",
    minWidth: 45,
    maxWidth: 45,
    borderRadius: 0
  }
}))(Button);

export default class CustomizedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Tooltip
          disableFocusListener
          title={
            <FormattedMessage
              id="removeProduct"
              defaultMessage="Remove product"
            />
          }
        >
          <DeleteCartButton
            variant="contained"
            onClick={async () => await this.props.removeItem(this.props.itemId)}
          >
            <Delete style={{ fontSize: 30 }} />
          </DeleteCartButton>
        </Tooltip>
      </div>
    );
  }
}
