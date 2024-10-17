import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class ServiceTypeService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveServiceType(serviceType) {
        return axios.post(API_URL + "/service-types/", serviceType, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllServiceType() {
        return axios.get(API_URL + "/service-types", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateServiceType(id, serviceType) {
        return axios.put(API_URL + "/service-types/" + id, serviceType, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getServiceTypeById(id) {
        return axios.get(API_URL + "/service-types/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new ServiceTypeService;