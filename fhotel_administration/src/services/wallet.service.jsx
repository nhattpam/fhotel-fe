import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class walletservice {

    token = '';

    setToken(token) {
        this.token = token;
    }


    saveWallet(wallet) {
        return axios.post(API_URL + "/wallets/", wallet, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllWallet() {
        return axios.get(API_URL + "/wallets", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateWallet(id, wallet) {
        return axios.put(API_URL + "/wallets/" + id, wallet, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getWalletById(id) {
        return axios.get(API_URL + "/wallets/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllTransactionByWallet(id) {
        return axios.get(API_URL + `/wallets/${id}/transactions`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new walletservice;