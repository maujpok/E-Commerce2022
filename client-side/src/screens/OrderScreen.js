import React, { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { Store } from "./../Store";
import LoadingBox from "./../components/LoadingBox";
import MessageBox from "./../components/MessageBox";
import { getError } from "../utils/getError";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import {
  FETCH_FAIL,
  FETCH_REQUEST,
  FETCH_SUCCESS,
  PAY_FAIL,
  PAY_REQUEST,
  PAY_RESET,
  PAY_SUCCESS,
} from "./../const/actionsConstants";
import { resetOptions, setLoadingStatus } from "./../const/paypalConstants";
import { toast } from "react-toastify";

function reducer(state, action) {
  switch (action.type) {
    case FETCH_REQUEST: {
      return { ...state, loading: true };
    }
    case FETCH_SUCCESS: {
      return { ...state, loading: false, order: action.payload };
    }
    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }
    case PAY_REQUEST: {
      return { ...state, loadingPay: true };
    }
    case PAY_SUCCESS: {
      return { ...state, loadingPay: false, successPay: true };
    }
    case PAY_RESET: {
      return { ...state, loadingPay: false, successPay: false };
    }
    case PAY_FAIL: {
      return { ...state, loadingPay: false, errorPay: action.payload };
    }
    default:
      return state;
  }
}

export default function OrderScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: orderId } = params;
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
      successPay: false,
      loadingPay: false,
    });
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: PAY_REQUEST });
        const { data } = await axios.put(`/orders/${order._id}/pay`, details, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: PAY_SUCCESS, payload: data });
        toast.success("Order is paid!");
      } catch (error) {
        dispatch({ type: PAY_FAIL, payload: getError(error) });
        toast.error(getError(error));
      }
    });
  };

  const onError = (error) => {
    toast.error(getError(error));
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: FETCH_REQUEST });
        const { data } = await axios.get(`/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_FAIL, payload: getError(error) });
      }
    };
    if (!userInfo) {
      return navigate("/login");
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: PAY_RESET });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: resetOptions,
          value: { "client-id": clientId, currency: "USD" },
        });
        paypalDispatch({ type: setLoadingStatus, value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, navigate, orderId, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order #{orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroupItem key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{" "}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address:</strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not delivered yet</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.shippingAddress.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt.substring(0,16).replace("T", " ")}hs
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not paid yet</MessageBox>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroupItem>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroupItem>
                {!order.isPaid && (
                  <ListGroupItem>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingBox />}
                  </ListGroupItem>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
