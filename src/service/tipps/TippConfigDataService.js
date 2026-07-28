import http from "../http-common.js";

class TippConfigDataService {

    getRowsForCompMemb(id) {
        return http.get(`/tippConfig/rows/${id}`);
    }


    update(id, data) {
        console.log("Update tipp config id", id);
        return http.put(`/tippConfig/${id}`, data);
    }
}
export default new TippConfigDataService();