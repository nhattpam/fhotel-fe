import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class UserDocumentService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveUserDocument(userDocument) {
        return axios.post(API_URL + "/user-documents/", userDocument, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllUserDocument() {
        return axios.get(API_URL + "/user-documents", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateUserDocument(id, userDocument) {
        return axios.put(API_URL + "/user-documents/" + id, userDocument, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getUserDocumentById(id) {
        return axios.get(API_URL + "/user-documents/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      deleteUserDocumentById(id) {
        return axios.delete(API_URL + "/user-documents/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new UserDocumentService;