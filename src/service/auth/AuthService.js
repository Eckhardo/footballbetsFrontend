import http from "@/service/http-common.js";

class AuthService {


    login(data) {
        console.log(data);
        return http.post("/auth/login", data);
    }
}

export default new AuthService();