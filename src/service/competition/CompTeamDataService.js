import http from "@/service/http-common.js";

class TeamDataService {
    getAll() {
        console.log("Getting all teams");
        return http.get("/teams");
    }

    get(id) {
        return http.get(`/compTeam/${id}`);
    }

    create(data) {
        console.log("post compTeams", JSON.stringify(data));
        return http.post("/compTeams", data);
    }

    update(id, data) {
        console.log("Update team id", id);
        return http.put(`/compTeam/${id}`, data);
    }

    delete(id) {
        return http.delete(`/compTeam/${id}`);
    }

    deleteAll(ids) {
        return http.delete(`/compTeams${ids}`);
    }

    findAllForComp(compId) {
        return http.get(`/compTeams/${compId}`);
    }

    findAllRegAndUnregForComp(compId) {
        return http.get(`/compTeams/${compId}/teams`);
    }
    findByName(name) {

        return http.get(`/teams?name=${name}`);
    }
}

export default new TeamDataService();