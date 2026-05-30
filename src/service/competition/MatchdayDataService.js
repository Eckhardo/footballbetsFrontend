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
        return http.get(`/competitions/${compId}/matchdays`);
    }

    getMatchdaysByRoundId(roundId) {
        return http.get(`/rounds/${roundId}/matchdays`);
    }e
}
export default new MatchdayDataService();