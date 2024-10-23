import axios from "axios";

// const API_URL = "https://localhost:7215/api";
import { API_URL } from './api-config';  // Adjust the path as necessary

class DocumentService {

  token = '';

  setToken(token) {
    this.token = token;
  }
  saveDocument(document) {
    return axios.post(API_URL + "/documents/", document, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }
  getAllDocument() {
    return axios.get(API_URL + "/documents", {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  updateDocument(id, document) {
    return axios.put(API_URL + "/documents/" + id, document, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


  getDocumentById(id) {
    return axios.get(API_URL + "/documents/" + id, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }


}
export default new DocumentService;