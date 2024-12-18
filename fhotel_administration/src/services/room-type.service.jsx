import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class RoomTypeService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveRoomType(rommType) {
        return axios.post(API_URL + "/room-types/", rommType, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllRoomType() {
        return axios.get(API_URL + "/room-types", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateRoomType(id, rommType) {
        return axios.put(API_URL + "/room-types/" + id, rommType, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getRoomTypeById(id) {
        return axios.get(API_URL + "/room-types/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllRoomImagebyRoomTypeId(id) {
        return axios.get(API_URL + `/room-types/${id}/room-images`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getTodayPricebyRoomTypeId(id) {
        return axios.get(API_URL + `/room-types/${id}/today-price`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllRoombyRoomTypeId(id) {
        return axios.get(API_URL + `/room-types/${id}/rooms`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      
      getAllFacilityByRoomTyeId(id) {
        return axios.get(API_URL + `/room-types/${id}/room-facilities`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllReservationByRoomTypeId(id) {
        return axios.get(API_URL + `/room-types/${id}/reservations`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      deleteRoomTypeById(id) {
        return axios.delete(API_URL + "/room-types/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      checkAvailableRoomByRoomTypeId(id, checkInDate, checkOutDate) {
        return axios.get(API_URL + `/room-types/${id}/available-on-date?checkinDate=${checkInDate}&checkoutDate=${checkOutDate}`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new RoomTypeService;