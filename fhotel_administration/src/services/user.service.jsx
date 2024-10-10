import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class UserService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    loginUser(email, password) {
        return axios.post(API_URL + "/authentications/login", {
            email: email,
            password: password,
        });
    }

    saveUser(user) {
        return axios.post(API_URL + "/users/", user, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllUser() {
        return axios.get(API_URL + "/users", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateUser(id, user) {
        return axios.put(API_URL + "/users/" + id, user, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getUserById(id) {
        return axios.get(API_URL + "/users/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new UserService;