import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class HotelAmenityService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveHotelAmenity(hotelAmenity) {
        return axios.post(API_URL + "/hotel-amenities/", hotelAmenity, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllHotelAmenity() {
        return axios.get(API_URL + "/hotel-amenities", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateHotelAmenity(id, hotelAmenity) {
        return axios.put(API_URL + "/hotel-amenities/" + id, hotelAmenity, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getHotelAmenityById(id) {
        return axios.get(API_URL + "/hotel-amenities/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      uploadImage(hotelAmenity) {
        return axios.post(API_URL + "/hotel-amenities/image/", hotelAmenity, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllAmenityHotelAmenityById(id) {
        return axios.get(API_URL + `/hotels/${id}/hotel-amenities`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new HotelAmenityService;