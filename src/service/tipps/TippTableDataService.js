import http from "../http-common.js";

class TippTableDataService {


    findTippTableForCommunity( commId, startMatchday, endMatchday ) {
        console.log("findTippTableForCommunity", commId, startMatchday, endMatchday);
        const voData = {
            commId: commId,
            startSpieltag: startMatchday,
            stopSpieltag: endMatchday
        };

        // Convert your object into URL search parameters
        return http.get(`/tippTable`, {
                params: voData // Axios converts this into URL parameters
            }
        );
    }
}

export default new TippTableDataService();