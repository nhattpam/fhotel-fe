import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class DistrictService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveDistrict(district) {
        return axios.post(API_URL + "/districts/", district, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllDistrict() {
        return axios.get(API_URL + "/districts", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateDistrict(id, district) {
        return axios.put(API_URL + "/districts/" + id, district, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getDistrictById(id) {
        return axios.get(API_URL + "/districts/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new DistrictService;