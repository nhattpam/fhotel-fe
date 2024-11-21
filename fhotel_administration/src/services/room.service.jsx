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
      updateRoom2(id, roomData) {
        return axios.put(
          `${API_URL}/rooms/${id}/room-number`, // URL endpoint
          {
            roomId: id,               // Pass the ID
            roomNumber: roomData.roomNumber, // New room number to update
            roomTypeId: roomData.roomTypeId, // Include room type if required
            status: roomData.status,  // Current status of the room
            createdDate: roomData.createdDate, // Preserve created date
            updatedDate: new Date().toISOString(), // Set updated date to now
            note: roomData.note,      // Include note if applicable
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`, // Include authentication token
            },
          }
        );
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