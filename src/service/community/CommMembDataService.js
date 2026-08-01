import http from "@/service/http-common.js";

class CommMembDataService {
    getTippers(commId) {
        return http.get(`/commMembs/${commId}/tipper`);
    }
   getCommunities(username) {
       return http.get(`/commMembs/${username}/communities`);
    }
    findByCommIdAndTipperId(commId, tipperId) {
        return http.get(`/commMembs/${commId}/tipper/${tipperId}`);
    }
}
export default new CommMembDataService();