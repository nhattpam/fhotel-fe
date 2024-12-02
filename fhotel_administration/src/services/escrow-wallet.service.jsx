import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class EscrowWalletService {

  token = '';

  setToken(token) {
    this.token = token;
  }

  saveEscrowWallet(escrowWallet) {
    return axios.post(API_URL + "/escrow-wallets/", escrowWallet, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllEscrowWallet() {
    return axios.get(API_URL + "/escrow-wallets", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateEscrowWallet(id, escrowWallet) {
    return axios.put(API_URL + "/escrow-wallets/" + id, escrowWallet, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getEscrowWalletById(id) {
    return axios.get(API_URL + "/escrow-wallets/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllTransactionByEscrowWallet() {
    return axios.get(API_URL + "/escrow-wallets/transactions", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }




}
export default new EscrowWalletService;