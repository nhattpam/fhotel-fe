import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class HolidayPricingRuleService {

    token = '';

    setToken(token) {
        this.token = token;
    }


    saveHolidayPricingRule(holidayPricingRule) {
        return axios.post(API_URL + "/holiday-pricing-rules/", holidayPricingRule, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
      getAllHolidayPricingRule() {
        return axios.get(API_URL + "/holiday-pricing-rules", {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      updateHolidayPricingRule(id, holidayPricingRule) {
        return axios.put(API_URL + "/holiday-pricing-rules/" + id, holidayPricingRule, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }
    
    
      getHolidayPricingRuleById(id) {
        return axios.get(API_URL + "/holiday-pricing-rules/" + id, {
          headers: {
            Authorization: `Bearer ${this.token}` // Include the bearer token in the headers
          }
        });
      }


}
export default new HolidayPricingRuleService;