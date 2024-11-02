import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './api-config';  // Adjust the path as necessary

class PaymentMethodService {

    token = '';

    setToken(token) {
        this.token = token;
    }
    savePaymentMethod(paymentMethod) {
        return axios.post(API_URL + "/payment-methods/", paymentMethod, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }
    getAllPaymentMethod() {
        return axios.get(API_URL + "/payment-methods", {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }


    updatePaymentMethod(id, paymentMethod) {
        return axios.put(API_URL + "/payment-methods/" + id, paymentMethod, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }


    getPaymentMethodById(id) {
        return axios.get(API_URL + "/payment-methods/" + id, {
            headers: {
                Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
            }
        });
    }


}

export default new PaymentMethodService;