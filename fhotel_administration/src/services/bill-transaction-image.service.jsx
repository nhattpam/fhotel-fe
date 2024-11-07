import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class BillTransactionImageService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveBillTransactionImage(billTransactionImage) {
        return axios.post(API_URL + "/bill-transaction-images/", billTransactionImage, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllBillTransactionImage() {
        return axios.get(API_URL + "/bill-transaction-images", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateBillTransactionImage(id, billTransactionImage) {
        return axios.put(API_URL + "/bill-transaction-images/" + id, billTransactionImage, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getBillTransactionImageById(id) {
        return axios.get(API_URL + "/bill-transaction-images/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      deleteBillTransactionImageById(id) {
        return axios.delete(API_URL + "/bill-transaction-images/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

}
export default new BillTransactionImageService;