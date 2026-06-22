import http from "@/service/http-common.js";

class CommunityWizardDataService {
    getAll() {
        console.log("Getting all communities");
        return http.get("/commWizard");
    }

    get(id) {
        return http.get(`/commWizard/${id}`);
    }

    create(data) {
        console.log("create new CommunityWizard");
        return http.post("/commWizard", data);
    }

    update(id, data) {
        console.log("Update Community id", id);
        return http.put(`/commWizard/${id}`, data);
    }

    delete(id) {
        console.log("Delete Community id", id);
        return http.delete(`/commWizard/${id}`);
    }
}
export default new CommunityWizardDataService();