import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class BillService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveBill(bill) {
    return axios.post(API_URL + "/bills/", bill, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllBill() {
    return axios.get(API_URL + "/bills", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateBill(id, bill) {
    return axios.put(API_URL + "/bills/" + id, bill, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getBillById(id) {
    return axios.get(API_URL + "/bills/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  payBill(id) {
    return axios.post(API_URL + `/bills/${id}/pay`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  deleteBillById(id) {
    return axios.delete(API_URL + "/bills/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



}
export default new BillService;