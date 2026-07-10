import http from "@/service/http-common.js";

class CommMembDataService {
    getTippers(commId) {
        return http.get(`/commMembs/${commId}/tipper`);
    }
   getCommunities(username) {
       return http.get(`/commMembs/${username}/communities`);
    }
    getCommunity(commName) {
        return http.get(`/commMembs/${commName}/communities`);
    }
}
export default new CommMembDataService();