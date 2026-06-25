import http from "@/service/http-common.js";

class CommunityDataService {
    getAll() {
        console.log("Getting all communities");
        return http.get("/communities");
    }

    get(commId) {
        return http.get(`/communities/${commId}`);
    }

    create(data) {
        console.log("create new Community", JSON.stringify(data));
        return http.post("/communities", data);
    }

    update(id, data) {
        console.log("Update Community id", id);
        return http.put(`/communities/${id}`, data);
    }

    delete(id) {
        console.log("Delete Community id", id);
        return http.delete(`/communities/${id}`);
    }
}
export default new CommunityDataService();