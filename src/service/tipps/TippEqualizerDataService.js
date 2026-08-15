import http from "../http-common.js";

class TippEqualizerDataService {

    equalizeTippForMatchday(matchdayId) {
        console.log("equalizeTippForMatchday", matchdayId);
        return http.get(`/equalize/${matchdayId}`);
    }


}

export default new TippEqualizerDataService();