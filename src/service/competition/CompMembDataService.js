import http from "@/service/http-common.js";

class CompMembDataService {
    getAll() {
        console.log("Getting all Rounds");
        return http.get("/compMembs");
    }

    get(id) {
        return http.get(`/compMembs/${id}`);
    }

    delete(id) {
        return http.delete(`/rounds/${id}`);
    }


    findCompetitions(commId) {
        return http.get(`/compMembs/${commId}/competitions`);
    }

    findCurrentCompetition(commId) {
        return http.get(`/compMembs/${commId}/competition`);
    }


}

export default new CompMembDataService();