import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class ReservationService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveReservation(reservation) {
        return axios.post(API_URL + "/reservations/", reservation, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllReservation() {
        return axios.get(API_URL + "/reservations", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateReservation(id, reservation) {
        return axios.put(API_URL + "/reservations/" + id, reservation, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getReservationById(id) {
        return axios.get(API_URL + "/reservations/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      


}
export default new ReservationService;