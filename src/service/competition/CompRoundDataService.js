import http from "@/service/http-common.js";

class CompRoundDataService {
    getAll() {
        console.log("Getting all Rounds");
        return http.get("/rounds");
    }

    get(id) {
        return http.get(`/rounds/${id}`);
    }

    create(data) {
        return http.post("/rounds", data);
    }

    update(id, data) {
        console.log("Update Round id", id);

        return http.put(`/rounds/${id}`, data);
    }

    delete(id) {
        return http.delete(`/rounds/${id}`);
    }


    findByCompId(compId) {
        console.log("Getting rounds for compId", compId);
        return http.get(`/competitions/${compId}/rounds`);
    }


}

export default new CompRoundDataService();