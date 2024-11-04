import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class HolidayService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    saveHoliday(holiday) {
        return axios.post(API_URL + "/holidays/", holiday, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllHoliday() {
        return axios.get(API_URL + "/holidays", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateHoliday(id, holiday) {
        return axios.put(API_URL + "/holidays/" + id, holiday, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getHolidayById(id) {
        return axios.get(API_URL + "/holidays/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }

      getAllHolidayPricingRuleById(id) {
        return axios.get(API_URL + `/holidays/${id}/holiday-pricing-rules` , {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new HolidayService;