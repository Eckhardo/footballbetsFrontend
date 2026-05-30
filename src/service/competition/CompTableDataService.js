import http from "@/service/http-common.js";

class CompTableDataService {


    findByCompId(compId, startSpieltag, endSpieltag, isHeimOrGast) {
        return http.get(`/compTable/search`,
            {
                params: {
                    compId: compId,
                    startSpieltag: startSpieltag,
                    endSpieltag: endSpieltag,
                    isHeimOrGast: isHeimOrGast
                }
            }
        )
    }
}

export default new CompTableDataService();