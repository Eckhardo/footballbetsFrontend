import http from "../http-common.js";

class TippConfigDataService {

    getRowsForCompMemb(id) {
        return http.get(`/tippConfig/rows/${id}`);
    }


    update(id, data) {
        console.log("Update tipp config id", id);
        return http.put(`/tippConfig/${id}`, data);
    }

    findOne(id) {
        return http.get(`/config/${id}`);

    }
    findByMatchdayAndCompMemb(matchdayId, compMembId) {
        console.log("findByMatchdayAndCompMemb:", matchdayId);
        const dto = http.get(`/config/${matchdayId}/compMemb/${compMembId}`);
        console.log("dto:", JSON.stringify(dto));
        return dto;
    }
}

export default new TippConfigDataService();