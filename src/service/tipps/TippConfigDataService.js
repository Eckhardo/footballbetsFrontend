import http from "../http-common.js";

class TippConfigDataService {

    getRowsForCompMemb(id) {
        return http.get(`/tippConfig/rows/${id}`);
    }


}
export default new TippConfigDataService();