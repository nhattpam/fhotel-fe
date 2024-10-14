import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './api-config';  // Adjust the path as necessary

class CityService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveCity(city) {
    return axios.post(API_URL + "/cities/", city, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllCity() {
    return axios.get(API_URL + "/cities", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateCity(id, city) {
    return axios.put(API_URL + "/cities/" + id, city, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getCityById(id) {
    return axios.get(API_URL + "/cities/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


}
export default new CityService;