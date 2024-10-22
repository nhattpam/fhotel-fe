import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class RoomService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveRoom(room) {
        return axios.post(API_URL + "/rooms/", room, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllRoom() {
        return axios.get(API_URL + "/rooms", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateRoom(id, room) {
        return axios.put(API_URL + "/rooms/" + id, room, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getRoomById(id) {
        return axios.get(API_URL + "/rooms/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new RoomService;