import http from "../http-common.js";

class TippModusDataService {
    getModiTypes() {
        return http.get(`/tippModus/types`);
    }
    getModiForCommunity(communityId) {
        return http.get(`/tippModus/community/${communityId}`);
    }
 
}
export default new TippModusDataService();