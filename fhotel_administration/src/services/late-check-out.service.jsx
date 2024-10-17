import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class LateCheckoutPolicyService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveLateCheckOutPolicy(lateCheckOutPolicy) {
        return axios.post(API_URL + "/late-check-out-policies/", lateCheckOutPolicy, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllLateCheckOutPolicy() {
        return axios.get(API_URL + "/late-check-out-policies", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateLateCheckOutPolicy(id, lateCheckOutPolicy) {
        return axios.put(API_URL + "/late-check-out-policies/" + id, lateCheckOutPolicy, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getLateCheckOutPolicyById(id) {
        return axios.get(API_URL + "/late-check-out-policies/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new LateCheckoutPolicyService;