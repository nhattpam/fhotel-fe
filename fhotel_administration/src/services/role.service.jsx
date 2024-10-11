import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class RoleService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveRole(role) {
        return axios.post(API_URL + "/roles/", role, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllRole() {
        return axios.get(API_URL + "/roles", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateRole(id, role) {
        return axios.put(API_URL + "/roles/" + id, role, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getRoleById(id) {
        return axios.get(API_URL + "/roles/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new RoleService;