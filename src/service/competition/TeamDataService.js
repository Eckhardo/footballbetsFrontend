import http from "@/service/http-common.js";

class TeamDataService {

    getAllForClubs() {
        console.log("Getting all teams");
        return http.get("/teams?hasClubs=true");
    }
    getAllForNations() {
        console.log("Getting all nation teams");
        return http.get("/teams?hasClubs=false");
    }
    get(id) {
        return http.get(`/teams/${id}`);
    }

    create(data) {
          return http.post("/teams", data);
    }

    update(id, data) {
        console.log("Update team id", id);
        return http.put(`/teams/${id}`, data);
    }

    delete(id) {
        return http.delete(`/teams/${id}`);
    }
}

export default new TeamDataService();