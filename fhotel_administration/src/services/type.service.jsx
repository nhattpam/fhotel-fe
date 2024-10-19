import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class TypeService {

    token = '';

    setToken(token) {
        this.token = token;
    }


    saveType(type) {
        return axios.post(API_URL + "/types/", type, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllType() {
        return axios.get(API_URL + "/types", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateType(id, type) {
        return axios.put(API_URL + "/types/" + id, type, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getTypeById(id) {
        return axios.get(API_URL + "/types/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new TypeService;