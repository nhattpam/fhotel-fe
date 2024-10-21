import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class HotelStaffService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveHotelStaff(hotelStaff) {
        return axios.post(API_URL + "/hotel-staffs/", hotelStaff, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllHotelStaff() {
        return axios.get(API_URL + "/hotel-staffs", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateHotelStaff(id, hotelStaff) {
        return axios.put(API_URL + "/hotel-staffs/" + id, hotelStaff, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getHotelStaffById(id) {
        return axios.get(API_URL + "/hotel-staffs/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new HotelStaffService;