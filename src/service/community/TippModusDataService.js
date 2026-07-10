import http from "../http-common.js";

class TippModusDataService {
    getModiTypes(id) {
        return http.get(`/tippModus/types/${id}`);
    }
    getModiForCommunity(communityId) {
        return http.get(`/tippModus/community/${communityId}`);
    }
 
}
export default new TippModusDataService();