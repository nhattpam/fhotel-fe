import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class FacilityService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveFacility(facility) {
        return axios.post(API_URL + "/facilities/", facility, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllFacility() {
        return axios.get(API_URL + "/facilities", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateFacility(id, facility) {
        return axios.put(API_URL + "/facilities/" + id, facility, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getFacilityById(id) {
        return axios.get(API_URL + "/facilities/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new FacilityService;