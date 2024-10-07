import axios from "axios";

import { API_URL } from './api-config';  // Adjust the path as necessary


class UserService {

    token = '';

    setToken(token) {
        this.token = token;
    }

    loginUser(email, password) {
        return axios.post(API_URL + "/authentications/login", {
            email: email,
            password: password,
        });
    }


}
export default new UserService;