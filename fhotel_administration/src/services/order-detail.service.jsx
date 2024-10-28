import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class OrderDetailService {

    token = '';

    setToken(token) {
        this.token = token;
    }


    saveOrderDetail(orderDetail) {
        return axios.post(API_URL + "/order-details/", orderDetail, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllOrderDetail() {
        return axios.get(API_URL + "/order-details", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateOrderDetail(id, orderDetail) {
        return axios.put(API_URL + "/order-details/" + id, orderDetail, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getOrderDetailById(id) {
        return axios.get(API_URL + "/order-details/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }



}
export default new OrderDetailService;