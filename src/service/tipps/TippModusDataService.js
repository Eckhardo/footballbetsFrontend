import http from "../http-common.js";

class TippModusDataService {
    getModiTypes() {
        return http.get(`/tippModus/types`);
    }
    getModiForCommunity(communityId) {
        return http.get(`/tippModus/community/${communityId}`);
    }
    create(modus) {
        modus.id=null;
        console.log("create new Modus", JSON.stringify(modus));
        if(modus.type==='ResultTipp'){
            return http.post("/tippModus/result", modus);
        }
        else if(modus.type==='PointTipp'){
            return http.post("/tippModus/point", modus);
        }
        else if(modus.type==='TotoTipp'){
            return http.post("/tippModus/toto", modus);
        }

    }

    update(id, modus) {
        console.log("Update modus id", id);
        if(modus.type==='ResultTipp'){
            return http.put(`/tippModus/result/${id}`, modus);
        }
        else if(modus.type==='PointTipp'){
            return http.put(`/tippModus/point/${id}`, modus);
        }
        else if(modus.type==='TotoTipp'){
            return http.put(`/tippModus/toto/${id}`, modus);
        }


    }

    delete(id) {
        return http.delete(`/tippModus/${id}`);
    }


}
export default new TippModusDataService();