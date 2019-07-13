import React, { Component } from "react";
import {
  Divider,
  Button,
  Grid,
  TableHead,
  TableRow,
  Table,
  TableBody,
  TableCell,
  Card,
  Hidden,
  Tooltip
} from "@material-ui/core";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Assignment
} from "@material-ui/icons";
import setAuthToken from "../../../utils/setAuthToken";
import * as moment from "moment";
import { getCurrentUser, getOrdersByUser } from "../../../utils/requestManager";
import { styles } from "./styles";
import Spinner from "../../../utils/Spinner";

export default class Account extends Component {
  constructor() {
    super();
    this.state = {
      orders: [],
      isLoading: false,
      errors: null,
      currentPage: 1,
      totalPages: 1,
      userId: ""
    };
  }
  async componentDidMount() {
    this.setState({ isLoading: true });
    let token = localStorage.getItem("jwtToken");
    setAuthToken(token);
    try {
      const orders = await getCurrentUser();
      this.setState({
        userId: orders.data.id
      });
      const orderList = await getOrdersByUser(this.state.userId);
      this.setState({
        orders: orderList.data.orders,
        isLoading: false,
        totalPages: orderList.data.orders.length / 10
      });
    } catch (err) {
      this.setState({
        isLoading: false,
        errors: err
      });
    }
  }

  newPage = pageNumber => {
    this.setState({ currentPage: pageNumber });
  };

  render() {
    const { orders, isLoading, currentPage, totalPages } = this.state;
    let ordersView;
    if (orders === null || isLoading) {
      ordersView = <Spinner />;
    } else {
      ordersView = (
        <div>
          {this.state.orders.length ? (
            <div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order Details</TableCell>
                    <TableCell>Date</TableCell>
                    <Hidden xsDown>
                      <TableCell>Name</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Status</TableCell>
                    </Hidden>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders
                    .slice((currentPage - 1) * 10, currentPage * 10)
                    .map((order, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <a href={`/order/${order._id}`}>View</a>
                          </TableCell>
                          <TableCell>
                            {moment(order.date).format("ll")}
                          </TableCell>
                          <Hidden xsDown>
                            <TableCell>
                              {order.deliveryInfo.firstname +
                                " " +
                                order.deliveryInfo.lastname}
                            </TableCell>
                            <TableCell>{order.deliveryInfo.phone}</TableCell>
                            <TableCell>{order.status}</TableCell>
                          </Hidden>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              <Tooltip disableFocusListener title="Go back">
                <span>
                  <Button
                    disabled={currentPage === 1 ? true : false}
                    onClick={() => this.newPage(currentPage - 1)}
                  >
                    <KeyboardArrowLeft />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip disableFocusListener title="Go next">
                <span>
                  <Button
                    disabled={
                      currentPage === Math.ceil(totalPages) ? true : false
                    }
                    onClick={() => this.newPage(currentPage + 1)}
                  >
                    <KeyboardArrowRight />
                  </Button>
                </span>
              </Tooltip>
            </div>
          ) : (
            <h1 style={styles.noOrdersHeader}>No order made</h1>
          )}
        </div>
      );
    }
    return (
      <div style={styles.pageContainer}>
        <Grid style={{ padding: 16 }} container>
          <Card style={styles.ordersCardStyle}>
            <div style={styles.ordersStyle}>
              <Hidden xsDown>
                <div style={styles.headerStyle}>
                  <Divider style={styles.dividerPosition} />
                  <Assignment style={styles.imgStyle} />
                </div>
              </Hidden>
              {ordersView}
            </div>
          </Card>
        </Grid>
      </div>
    );
  }
}
