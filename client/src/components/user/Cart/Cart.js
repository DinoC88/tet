import React, { Component } from "react";
import * as numeral from "numeral";
import { Button, DialogTitle, DialogActions, Dialog } from "@material-ui/core";
import { Link } from "react-router-dom";
import setAuthToken from "../../../utils/setAuthToken";
import {
  getCartData,
  deleteCart,
  removeOneItem,
  getOrder
} from "../../../utils/requestManager";
import { styles } from "./styles";
export default class Cart extends Component {
  constructor() {
    super();
    this.state = {
      cartData: [],
      id: null,
      isLoading: false,
      isLoaded: false,
      error: null,
      openOrderConfirm: false,
      openEmptyConfirm: false
    };
  }
  componentDidMount() {
    let token = localStorage.getItem("jwtToken");
    setAuthToken(token);
    this.setState({ isLoading: true });
    getCartData()
      .then(res => {
        this.setState({
          cartData: res.data ? res.data.items : [],
          id: res.data ? res.data._id : null,
          isLoading: false,
          isLoaded: true,
          error: null
        });
        console.log(res.data);
      })
      .catch(err => this.setState({ error: err }));
  }
  removeItem = itemId => {
    this.setState({ isLoading: true });
    removeOneItem({
      cartId: this.state.id,
      itemId: itemId
    }).then(res => {
      getCartData()
        .then(res => {
          this.setState({
            cartData: res.data ? res.data.items : [],
            id: res.data ? res.data._id : null,
            isLoading: false
          });
        })
        .catch(err => console.log(err));
    });
  };
  emptyCart = () => {
    const id = this.state.id;
    deleteCart({ params: { id } }).then(() => {
      getCartData()
        .then(res => {
          this.setState({
            cartData: res.data ? res.data.items : [],
            id: res.data ? res.data._id : null,
            isLoading: false
          });
        })
        .catch(err => console.log(err));
      this.setState({ openEmptyConfirm: false });
    });
  };
  makeOrder = () => {
    const order = this.state.cartData.map(item => {
      let order = {
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        dateCreated: Date.now()
      };
      return order;
    });
    getOrder({ order: order }).then(res => {
      this.emptyCart();
      this.setState({ openOrderConfirm: false });
    });
  };
  handleOrderDialog = () => {
    this.setState({ openOrderConfirm: !this.state.openOrderConfirm });
  };
  handleEmptyDialog = () => {
    this.setState({ openEmptyConfirm: !this.state.openEmptyConfirm });
  };
  render() {
    let { cartData, isLoaded, error } = this.state;
    const cartExists = isLoaded && !error && cartData.length > 0;
    return (
      <div style={styles.cartContainer}>
        <h1 style={styles.cartTitle}>Your Cart</h1>
        <div style={styles.cart}>
          <div style={styles.cartInfo}>
            <div>
              <p style={styles.cartInfoPar}>
                <b>Number of items: </b>
                {cartExists
                  ? cartData.reduce((acc, item) => (acc += item.quantity), 0)
                  : 0}
              </p>
              <p style={styles.cartInfoPar}>
                <b>Total amount: </b>
                <span style={styles.total}>
                  {cartExists
                    ? numeral(
                        cartData.reduce(
                          (acc, item) =>
                            (acc += item.product.price * item.quantity),
                          0
                        )
                      ).format("$0,0.00")
                    : numeral(0).format("$0,0.00")}
                </span>
              </p>
            </div>
            <div style={styles.cartInfoBtns}>
              <Button
                disabled={!cartExists}
                color="primary"
                variant="contained"
                style={{ marginRight: "5px" }}
                onClick={this.handleOrderDialog}
              >
                Check out
              </Button>
              <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                maxWidth="sm"
                open={this.state.openOrderConfirm}
                onClose={this.handleOrderDialog}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">
                  {
                    "Please read the list of items in your order and click `Ok` to confirm your order?"
                  }
                </DialogTitle>

                <DialogActions>
                  <Button onClick={this.handleOrderDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.makeOrder} color="secondary" autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                disabled={!cartExists}
                color="secondary"
                variant="contained"
                onClick={this.handleEmptyDialog}
              >
                Empty cart
              </Button>
              <Dialog
                disableBackdropClick
                disableEscapeKeyDown
                open={this.state.openEmptyConfirm}
                onClose={this.handleEmptyDialog}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title">
                  {"Are you sure you want to clear shop cart?"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={this.handleEmptyDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.emptyCart} color="secondary" autoFocus>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
          <div style={styles.cartItems}>
            {cartExists ? (
              <table style={styles.cartItemsTable}>
                <thead>
                  <tr>
                    <td style={styles.cartItemsTh} />
                    <td style={styles.cartItemsTh}>Product Name</td>
                    <td style={styles.cartItemsTh}>Price</td>
                    <td style={styles.cartItemsTh}>Qty</td>
                    <td style={styles.cartItemsTh}>Total</td>
                    <td style={styles.cartItemsTh} />
                  </tr>
                </thead>
                <tbody>
                  {cartData.map(item => {
                    return (
                      <tr style={styles.cartItemsTd} key={item.product.name}>
                        <td>
                          <img
                            style={styles.image}
                            src={item.product.image}
                            alt={item.product.name}
                          />
                        </td>
                        <td>
                          <Link
                            style={styles.link}
                            to={`/product/${item.product._id}`}
                          >
                            {item.product.name}
                          </Link>
                        </td>
                        <td>{numeral(item.product.price).format("$0,0.00")}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {numeral(item.product.price * item.quantity).format(
                            "$0,0.00"
                          )}
                        </td>
                        <td>
                          <button
                            style={styles.cartItemButton}
                            title="Remove this item from the cart"
                            onClick={() => this.removeItem(item._id)}
                            onMouseEnter={e =>
                              (e.target.style.backgroundColor = "#325999")
                            }
                            onMouseLeave={e =>
                              (e.target.style.backgroundColor = "#ce1e4d")
                            }
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <h1 style={styles.cartHeader}>No items in the cart.</h1>
            )}
          </div>
        </div>
      </div>
    );
  }
}
