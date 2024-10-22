import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class RoomFacilityService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveRoomFacility(roomFacility) {
        return axios.post(API_URL + "/room-facilities/", roomFacility, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllRoomFacility() {
        return axios.get(API_URL + "/room-facilities", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateRoomFacility(id, roomFacility) {
        return axios.put(API_URL + "/room-facilities/" + id, roomFacility, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getRoomFacilityById(id) {
        return axios.get(API_URL + "/room-facilities/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


      deleteRoomFacilityById(id) {
        return axios.delete(API_URL + "/room-facilities/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

}
export default new RoomFacilityService;