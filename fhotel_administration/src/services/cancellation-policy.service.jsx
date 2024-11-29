import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class CancellationPolicyService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveCancellationPolicy(cancellationPolicy) {
    return axios.post(API_URL + "/cancellation-policies/", cancellationPolicy, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllCancellationPolicy() {
    return axios.get(API_URL + "/cancellation-policies", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateCancellationPolicy(id, cancellationPolicy) {
    return axios.put(API_URL + "/cancellation-policies/" + id, cancellationPolicy, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getCancellationPolicyById(id) {
    return axios.get(API_URL + "/cancellation-policies/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  deleteCancellationPolicy(id) {
    return axios.delete(API_URL + "/cancellation-policies/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


}
export default new CancellationPolicyService;