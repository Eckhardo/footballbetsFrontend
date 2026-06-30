import http from "@/service/http-common.js";

class CompMembDataService {

    getCompetitions(commId) {
        return http.get(`/compMembs/${commId}/competitions`);
    }
}
export default new CompMembDataService();