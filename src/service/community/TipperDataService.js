import http from "@/service/http-common.js";

class TipperDataService {
    getAll() {
        console.log("Getting all tippers");
        return http.get("/tipper");
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

    findByName(username) {
        console.log("findByName", username);
        return http.get(`/tipper/${username}`);
    }
}
export default new TipperDataService();