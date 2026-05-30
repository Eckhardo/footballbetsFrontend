import http from "@/service/http-common.js";

class MatchDataService {


    get(id) {
        return http.get(`/matches/${id}`);
    }

    create(data) {
         return http.post("/matches", data);
    }

    createBatch(data) {
        return http.post("/matches/batch", data);
    }
    update(id, data) {
        return http.put(`/matches/${id}`, data);
    }

    delete(id) {
        return http.delete(`/matches/${id}`);
    }

    getAllByMatchdayId(matchdayId) {
        return http.get(`/matchdays/${matchdayId}/matches`);
    }
}

export default new MatchDataService();