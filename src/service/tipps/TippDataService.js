import http from "../http-common.js";

class TippDataService {

    findTippRowsForTipper(matchdayId, commMembId) {
        console.log("findTippRowsForTipper", matchdayId, commMembId);
        return http.get(`/tippRows/${matchdayId}/container/${commMembId}`);
    }


    findTippRowsForCommunity(matchdayId, commId) {
        console.log("findTippRowsForCommunity", matchdayId, commId);
        const voData = {
            commId: commId,
            spieltagId: matchdayId
        };

// Convert your object into URL search parameters

        return http.get(`/tippRows`, {
                params: voData // Axios converts this into URL parameters
            }
        );
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