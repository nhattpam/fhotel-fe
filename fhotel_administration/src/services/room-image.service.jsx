import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class RoomImageService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveRoomImage(roomImage) {
        return axios.post(API_URL + "/room-images/", roomImage, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllRoomImage() {
        return axios.get(API_URL + "/room-images", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateRoomImage(id, roomImage) {
        return axios.put(API_URL + "/room-images/" + id, roomImage, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getRoomImageById(id) {
        return axios.get(API_URL + "/room-images/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      deleteRoomImageById(id) {
        return axios.delete(API_URL + "/room-images/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      uploadImage(roomImage) {
        return axios.post(API_URL + "/room-images/image/", roomImage, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    


}
export default new RoomImageService;