import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class TypePricingService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    loginTypePricing(email, password) {
        return axios.post(API_URL + "/authentications/login", {
            email: email,
            password: password,
        });
    }

    saveTypePricing(typePricing) {
        return axios.post(API_URL + "/type-pricings/", typePricing, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllTypePricing() {
        return axios.get(API_URL + "/type-pricings", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateTypePricing(id, typePricing) {
        return axios.put(API_URL + "/type-pricings/" + id, typePricing, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getTypePricingById(id) {
        return axios.get(API_URL + "/type-pricings/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllHotelByTypePricingId(id) {
        return axios.get(API_URL + `/type-pricings/${id}/hotels`, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      deleteTypePricing(id) {
        return axios.delete(API_URL + "/type-pricings/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    


}
export default new TypePricingService;