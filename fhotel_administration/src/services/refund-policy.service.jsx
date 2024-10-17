import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class RefundPolicyService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveRefundPolicy(refundPolicy) {
        return axios.post(API_URL + "/refund-policies/", refundPolicy, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllRefundPolicy() {
        return axios.get(API_URL + "/refund-policies", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateRefundPolicy(id, refundPolicy) {
        return axios.put(API_URL + "/refund-policies/" + id, refundPolicy, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getRefundPolicyById(id) {
        return axios.get(API_URL + "/refund-policies/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new RefundPolicyService;