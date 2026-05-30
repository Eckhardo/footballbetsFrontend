import http from "@/service/http-common.js";

class FamilyDataService {
    getAll() {

        return http.get("/families");
    }

    get(id) {
        return http.get(`/families/${id}`);
    }

    create(data) {
        return http.post("/families", data);
    }

    update(id, data) {
        console.log("Update family id", id);
        console.log("Update family data", data);
        return http.put(`/families/${id}`, data);
    }

    delete(id) {
        return http.delete(`/families/${id}`);
    }

    deleteAll() {
        return http.delete(`/families`);
    }

    findByName(name) {
        console.log("family findByName", name);
        return http.get(`/families/search?name=${name}`);
    }
    findFamilyByCompId(id) {
        console.log("family findByCompId", id);
        return http.get(`/families/${id}/families`);
    }


}
export default new FamilyDataService();