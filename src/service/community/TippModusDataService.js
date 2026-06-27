import http from "../http-common.js";

class TippModusDataService {
    getModi() {
        return http.get(`/tippModus/types`);
    }
 
}
export default new TippModusDataService();