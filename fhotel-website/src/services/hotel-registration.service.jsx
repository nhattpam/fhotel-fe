import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './api-config';  // Adjust the path as necessary

class HotelRegistrationService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveHotelRegistration(hotelRegistration) {
    return axios.post(API_URL + "/hotel-registrations/", hotelRegistration, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllHotelRegistration() {
    return axios.get(API_URL + "/hotel-registrations", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateHotelRegistration(id, hotelRegistration) {
    return axios.put(API_URL + "/hotel-registrations/" + id, hotelRegistration, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getHotelRegistrationById(id) {
    return axios.get(API_URL + "/hotel-registrations/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


}
export default new HotelRegistrationService;