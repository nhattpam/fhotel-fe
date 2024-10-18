import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class AmenityService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveAmenity(amenity) {
        return axios.post(API_URL + "/amenities/", amenity, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllAmenity() {
        return axios.get(API_URL + "/amenities", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateAmenity(id, amenity) {
        return axios.put(API_URL + "/amenities/" + id, amenity, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getAmenityById(id) {
        return axios.get(API_URL + "/amenities/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new AmenityService;