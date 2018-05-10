import { RequestStatus } from "../Requests/RequestStatus";

export class Query {

    private queryStatus: RequestStatus;
    private queryContent: string;
    private queryResponse: string = "";
    private queryError: string = "";

    constructor(queryStatus: RequestStatus,
        queryContent: string) {

        this.queryStatus = queryStatus;
        this.queryContent = queryContent;
    }

    getQueryContent(): string {
        return this.queryContent;
    }

    getQueryStatus(): RequestStatus {
        return this.queryStatus;
    }

    getQueryResponse(): string {
        return this.queryResponse;
    }

    getQueryError(): string {
        return this.queryError;
    }

    setQueryError(queryError: string) {
        this.queryError = queryError;
    }

    setQueryResponse(queryResponse: string) {
        this.queryResponse = queryResponse;
    }

    setQueryStatus(queryStatus: RequestStatus) {
        this.queryStatus = queryStatus;
    }

}