import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class HotelVerificationService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveHotelVerification(hotelVerification) {
        return axios.post(API_URL + "/hotel-verifications/", hotelVerification, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllHotelVerification() {
        return axios.get(API_URL + "/hotel-verifications", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateHotelVerification(id, hotelVerification) {
        return axios.put(API_URL + "/hotel-verifications/" + id, hotelVerification, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getHotelVerificationById(id) {
        return axios.get(API_URL + "/hotel-verifications/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }



}
export default new HotelVerificationService;