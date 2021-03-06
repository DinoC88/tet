import React, { Component } from "react";
import { Select, MenuItem, Button, Drawer, Hidden } from "@material-ui/core";
import { styles } from "./styles";
import { FormattedMessage } from "react-intl";
export default class ProductHandle extends Component {
  render() {
    return (
      <div style={styles.productsHandle}>
        <p style={styles.productFound}>
          {this.props.totalProducts}{" "}
          <FormattedMessage id="productFound" defaultMessage="product found" />
        </p>
        <div>
          <b style={styles.sortNshowStyle}>Show:</b>
          <Select
            variant="filled"
            value={this.props.limitInput}
            onChange={this.props.handleLimitDrawerChange}
          >
            <MenuItem value="5">5</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="20">20</MenuItem>
            <MenuItem value="50">50</MenuItem>
          </Select>
          <Drawer
            docked={false}
            open={this.props.drawerShowOpen}
            onRequestChange={this.props.toggleLimitDrawer}
          />
        </div>
        <Hidden xsDown>
          <div>
            <b style={styles.sortNshowStyle}>
              <FormattedMessage id="sort" defaultMessage="Sort by:" />
            </b>
            <Select
              variant="filled"
              value={this.props.sortInput}
              onChange={this.props.handleDrawerChange}
            >
              <MenuItem name="name" id="name" value="Name: A-Z">
                Name: A-Z
              </MenuItem>
              <MenuItem name="name" id="name" value="Name: Z-A">
                Name: Z-A
              </MenuItem>
              <MenuItem name="name" id="name" value="Price: Low to High">
                Price: Low to High
              </MenuItem>
              <MenuItem name="name" id="name" value="Price: High to Low">
                Price: High to Low
              </MenuItem>
            </Select>
            <Drawer
              docked={false}
              open={this.props.drawerSortOpen}
              onRequestChange={this.props.toggleSortDrawer}
            />
          </div>
          <Button
            style={styles.clearButton}
            color="primary"
            variant="contained"
            href="/dashboard"
          >
            <FormattedMessage
              id="clearFilters"
              defaultMessage="Clear filters"
            />
          </Button>
        </Hidden>
      </div>
    );
  }
}
