import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class ServiceService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveService(service) {
        return axios.post(API_URL + "/services/", service, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllService() {
        return axios.get(API_URL + "/services", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateService(id, service) {
        return axios.put(API_URL + "/services/" + id, service, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getServiceById(id) {
        return axios.get(API_URL + "/services/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      uploadImage(service) {
        return axios.post(API_URL + "/services/image/", service, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new ServiceService;