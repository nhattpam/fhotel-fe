import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './api-config';  // Adjust the path as necessary

class HotelService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveHotel(hotel) {
    return axios.post(API_URL + "/hotels/", hotel, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllHotel() {
    return axios.get(API_URL + "/hotels", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateHotel(id, hotel) {
    return axios.put(API_URL + "/hotels/" + id, hotel, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getHotelById(id) {
    return axios.get(API_URL + "/hotels/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  uploadImage(hotel) {
    return axios.post(API_URL + "/hotels/image/", hotel, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new HotelService;