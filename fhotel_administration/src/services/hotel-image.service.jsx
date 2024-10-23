import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './api-config';  // Adjust the path as necessary

class HotelImageService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveHotelImage(hotelImage) {
    return axios.post(API_URL + "/hotel-images/", hotelImage, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllHotelImage() {
    return axios.get(API_URL + "/hotel-images", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateHotelImage(id, hotelImage) {
    return axios.put(API_URL + "/hotel-images/" + id, hotelImage, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getHotelImageById(id) {
    return axios.get(API_URL + "/hotel-images/" + id, {
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
export default new HotelImageService;