import React, { useEffect, useReducer, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "./../Store";
import { getError } from "../utils/getError";
import axios from "axios";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from "react-bootstrap/Button";
import { FETCH_FAIL, FETCH_REQUEST, FETCH_SUCCESS } from "../const/actionsConstants";

function reducer(state, action) {
  switch (action.type) {
    case FETCH_REQUEST: {
      return { ...state,loading: true };
    }
    case FETCH_SUCCESS: {
      return { ...state, loading: false, orders: action.payload };
    }
    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      return state;
  }
}

export default function OrderHistoryScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ orders, loading, error }, dispatch] = useReducer(reducer, { loading: true, error: "" });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: FETCH_REQUEST });
      try {
        const { data } = await axios.get("/orders/mine", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_FAIL, payload: getError(error) });
      }
    };
    fetchData();
  }, [userInfo]);

  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1 className="my-3">Order History</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : "No"}</td>
                <td>
                  {order.isDelivered ? order.paidAt.substring(0, 10) : "No"}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >Details</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
