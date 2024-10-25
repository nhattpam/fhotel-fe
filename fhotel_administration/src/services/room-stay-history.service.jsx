import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class RoomStayHistoryService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveRoomStayHistory(roomStayHistory) {
        return axios.post(API_URL + "/room-stay-histories/", roomStayHistory, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllRoomStayHistory() {
        return axios.get(API_URL + "/room-stay-histories", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateRoomStayHistory(id, roomStayHistory) {
        return axios.put(API_URL + "/room-stay-histories/" + id, roomStayHistory, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    


}
export default new RoomStayHistoryService;