import http from "@/service/http-common.js";

class AuthService {


    login(data) {
        return http.post("/login", data);
    }
}

export default new AuthService();