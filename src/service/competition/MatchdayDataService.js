import http from "@/service/http-common.js";

class MatchdayDataService {
    getAll() {
        return http.get("/matchdays");
    }

    get(id) {
        return http.get(`/matchdays/${id}`);
    }

    create(data) {
         return http.post("/matchdays", data);
    }

    createBatch(data) {
        return http.post("/matchdays/batch", data);
    }

    update(id, data) {
        return http.put(`/matchdays/${id}`, data);
    }

    delete(id) {
        return http.delete(`/matchdays/${id}`);
    }
    getMatchdaysByCompId(compId) {
        console.log("Getting all matchdays by compId", compId);
        return http.get(`/matchdays?competitionId=${compId}`);
    }

    getMatchdaysByRoundId(roundId) {
        console.log("Getting all matchdays by roundId", roundId);
        return http.get(`/matchdays?competitionRoundId=${roundId}`);
    }e
}
export default new MatchdayDataService();