import http from "../http-common.js";

class TippModusDataService {
    getModi(id) {
        return http.get(`/tippModus/types/${id}`);
    }
 
}
export default new TippModusDataService();