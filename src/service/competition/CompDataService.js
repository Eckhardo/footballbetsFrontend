import http from "@/service/http-common.js";

class CompetitionDataService {
    getAll() {
        console.log("Getting all Competitions");
        return http.get("/competitions");
    }

    get(id) {
        return http.get(`/competitions/${id}`);
    }

    create(data) {
        console.log("create new Competition", JSON.stringify(data));
        return http.post("/competitions", data);
    }

    update(id, data) {
        console.log("Update competition id", id);
        return http.put(`/competitions/${id}`, data);
    }

    delete(id) {
        return http.delete(`/competitions/${id}`);
    }

    deleteAll() {
        return http.delete(`/competitions`);
    }

    findByName(name) {
        return http.get(`/competitions?name=${name}`);
    }

   findAllCompsByFamId(familyId) {
        return http.get(`/competitions/${familyId}/competitions`);
    }
}
export default new CompetitionDataService();