import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class FeedbackService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveFeedback(feedback) {
        return axios.post(API_URL + "/feedbacks/", feedback, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllFeedback() {
        return axios.get(API_URL + "/feedbacks", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateFeedback(id, feedback) {
        return axios.put(API_URL + "/feedbacks/" + id, feedback, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getFeedbackById(id) {
        return axios.get(API_URL + "/feedbacks/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new FeedbackService;