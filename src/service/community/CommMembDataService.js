import http from "@/service/http-common.js";

class CommMembDataService {
    getTippers(commId) {
        return http.get(`/commMembs/${commId}/tipper`);
    }
   getCommunities(username) {
       return http.get(`/communities/${username}/communities`);
    }
    findByCommIdAndTipperId(commId, tipperId) {
        return http.get(`/commMembs?communityId=${commId}&tipperId=${tipperId}`);
    }
}
export default new CommMembDataService();