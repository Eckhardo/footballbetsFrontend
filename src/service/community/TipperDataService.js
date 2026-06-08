import http from "@/service/http-common.js";

class TipperDataService {
    getAll() {
        console.log("Getting all tippers");
        return http.get("/tipper");
    }

    get(id) {
        return http.get(`/tipper/${id}`);
    }

    create(data) {
        console.log("create new tipper", JSON.stringify(data));
        return http.post("/tipper", data);
    }

    update(id, data) {
        console.log("Update tipper id", id);
        return http.put(`/tipper/${id}`, data);
    }

    delete(id) {
        console.log("Delete tipper id", id);
        return http.delete(`/tipper/${id}`);
    }

    findByName(name) {
        return http.get(`/tipper?name=${name}`);
    }
}
export default new TipperDataService();