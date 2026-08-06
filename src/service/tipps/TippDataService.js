import http from "../http-common.js";

class TippDataService {

    findTippRowsForTipper(matchdayId, commMembId) {
        console.log("findTippRowsForTipper", matchdayId, commMembId);
        return http.get(`/tipps/${matchdayId}/container/${commMembId}`);
    }

    create(data) {
        console.log("Create tipps");

        return http.post(`/tipps`, data);
    }

    update(spieltagId, data) {
        console.log("Update tipp config id", spieltagId);
        return http.put(`/tipps/${spieltagId}`, data);
    }
}
export default new TippDataService();