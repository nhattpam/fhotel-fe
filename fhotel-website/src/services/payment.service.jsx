import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './api-config';  // Adjust the path as necessary

class PaymentService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  savePayment(payments) {
    return axios.post(API_URL + "/payments/", payments, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllPayment() {
    return axios.get(API_URL + "/payments", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updatePayment(id, payments) {
    return axios.put(API_URL + "/payments/" + id, payments, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getPaymentById(id) {
    return axios.get(API_URL + "/payments/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

 


}
export default new PaymentService;