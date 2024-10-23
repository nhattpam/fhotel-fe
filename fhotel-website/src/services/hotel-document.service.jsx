import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './api-config';  // Adjust the path as necessary

class HotelDocumentService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveHotelDocument(hotelDocument) {
    return axios.post(API_URL + "/hotel-documents/", hotelDocument, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllHotelDocument() {
    return axios.get(API_URL + "/hotel-documents", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateHotelDocument(id, hotelDocument) {
    return axios.put(API_URL + "/hotel-documents/" + id, hotelDocument, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getHotelDocumentById(id) {
    return axios.get(API_URL + "/hotel-documents/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  uploadDocument(hotel) {
    return axios.post(API_URL + "/hotels/image/", hotel, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }



}
export default new HotelDocumentService;