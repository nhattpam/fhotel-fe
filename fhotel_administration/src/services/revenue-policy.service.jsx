import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class RevenuePolicyService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveRevenuePolicy(revenuePolicy) {
    return axios.post(API_URL + "/revenue-policies/", revenuePolicy, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllRevenuePolicy() {
    return axios.get(API_URL + "/revenue-policies", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateRevenuePolicy(id, revenuePolicy) {
    return axios.put(API_URL + "/revenue-policies/" + id, revenuePolicy, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getRevenuePolicyById(id) {
    return axios.get(API_URL + "/revenue-policies/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  deleteRevenuePolicy(id) {
    return axios.delete(API_URL + "/revenue-policies/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



}
export default new RevenuePolicyService;