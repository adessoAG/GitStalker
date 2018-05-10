import { Query } from "../Objects/Query";
import { RequestStatus } from "../Requests/RequestStatus";

export class ResponseProcessingErrorCheck {

    private responseQuery: Query;

    constructor(responseQuery: Query) {
        this.responseQuery = responseQuery;
    }

    checkForErrors(): boolean {
        let errorOccurred: boolean = false;
        if (this.responseQuery.getQueryStatus() == RequestStatus.ERROR_RECIEVED) {
            errorOccurred = true;
        }
        else if (this.responseQuery.getQueryStatus() == RequestStatus.VALID_ANSWER_RECIEVED) {
            errorOccurred = false;
        }
        return errorOccurred;
    }
}