import React, { Component } from "react";
import { styles } from "../styles";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

export default class PayingOptions extends Component {
  render() {
    const { payOptionCheck, confirmInfo } = this.props;
    return (
      <div>
        <ExpansionPanel
          disabled={!confirmInfo ? true : false}
          expanded={confirmInfo ? (payOptionCheck ? false : true) : false}
        >
          <ExpansionPanelSummary
            onClick={this.props.onExpandClickPay}
            expandIcon={<ExpandMore />}
          >
            <h5 style={styles.headerStyle}>Step 2: Paying options</h5>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={styles.panelContent}>
            <div>
              <h5 style={styles.headerStyle}>Please choose option</h5>
              <div style={styles.informationStyle}>
                <FormControl style={styles.formStyle} required>
                  <InputLabel>Pay option</InputLabel>
                  <Select
                    inputProps={{
                      name: "payOptions"
                    }}
                    value={this.props.payOptions}
                    onChange={this.props.handleDrawerChange}
                  >
                    <MenuItem value="Pay on delivery">Pay on delivery</MenuItem>
                    <MenuItem value="Pay on web">Pay on web</MenuItem>
                  </Select>
                  <Drawer
                    docked={false}
                    open={this.props.drawerOpen}
                    onRequestChange={this.props.toggleDrawer}
                  />
                </FormControl>
              </div>
            </div>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}
