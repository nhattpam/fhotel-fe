import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class HotelService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveHotel(hotel) {
        return axios.post(API_URL + "/hotels/", hotel, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllHotel() {
        return axios.get(API_URL + "/hotels", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateHotel(id, hotel) {
        return axios.put(API_URL + "/hotels/" + id, hotel, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getHotelById(id) {
        return axios.get(API_URL + "/hotels/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      uploadImage(hotel) {
        return axios.post(API_URL + "/hotels/image/", hotel, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllAmenityHotelById(id) {
        return axios.get(API_URL + `/hotels/${id}/hotel-amenities`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


      getAllRoomTypeByHotelId(id) {
        return axios.get(API_URL + `/hotels/${id}/room-types`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllHotelStaffByHotelId(id) {
        return axios.get(API_URL + `/hotels/${id}/hotel-staffs`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllHotelImageByHotelId(id) {
        return axios.get(API_URL + `/hotels/${id}/hotel-images`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllHotelDocumentByHotelId(id) {
        return axios.get(API_URL + `/hotels/${id}/hotel-documents`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

}
export default new HotelService;