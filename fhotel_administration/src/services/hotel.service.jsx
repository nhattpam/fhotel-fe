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
  saveHotel2(hotel) {
    return axios.post(API_URL + `/hotels/owner`, hotel, {
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

  getAllHotelVerificationByHotelId(id) {
    return axios.get(API_URL + `/hotels/${id}/hotel-verifications`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllFeedbackByHotelId(id) {
    return axios.get(API_URL + `/hotels/${id}/feedbacks`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllReservationByHotelId(id) {
    return axios.get(API_URL + `/hotels/${id}/reservations`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllRoomByHotelId(id) {
    return axios.get(API_URL + `/hotels/${id}/rooms`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllCancellationPolicyHotelById(id) {
    return axios.get(API_URL + `/hotels/${id}/cancellation-policies`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

  getAllRevenuePolicyHotelById(id) {
    return axios.get(API_URL + `/hotels/${id}/revenue-policies`, {
      headers: {
        Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
      }
    });
  }

}
export default new HotelService;