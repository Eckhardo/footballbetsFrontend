import http from "@/service/http-common.js";
import CommunityWizardDataService from "./CommunityWizardDataService";



class CommMembDataService {

    getTippers(commId) {
        return http.get(`/commMembs/${commId}/tipper`);
    }

}
export default new CommMembDataService();