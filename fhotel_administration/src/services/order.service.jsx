import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class OrderService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveOrder(order) {
    return axios.post(API_URL + "/orders/", order, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllOrder() {
    return axios.get(API_URL + "/orders", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateOrder(id, order) {
    return axios.put(API_URL + "/orders/" + id, order, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getOrderById(id) {
    return axios.get(API_URL + "/orders/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllOrderDetailByOrder(id) {
    return axios.get(API_URL + `/orders/${id}/order-details`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  acceptRefund(orderId) {
    return axios.post(
        API_URL + "/orders/accept-refund",
        { orderId: orderId }, // Send the orderId as a JSON object
        {
            headers: {
                Authorization: `Bearer ${this.token}`, // Include the bearer token in the headers
                'Content-Type': 'application/json',    // Specify the content type
            },
        }
    );
}



}
export default new OrderService;