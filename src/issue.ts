import { postRequest } from "./postRequest";
import { previousRequestData } from "./interfaceRequestData";

export enum CrawlIssue {
    TITLE
}

export class Issue extends postRequest{

    readonly baseQuery: string;
    readonly issueBaseQuery: string;
    readonly issueBaseResponseKey: string[];
    readonly baseResponseKey: string[];
    readonly issueBaseVariable: string;
    readonly baseVariable: string;

    constructor(number: number, previousData: previousRequestData) {
        super();
        this.issueBaseQuery = `issue(number: `+ number +`) {
            insertHere
          }`;
        this.issueBaseVariable = '';
        this.issueBaseResponseKey = ["issue"];
        this.baseQuery = super.generateBaseQuery(previousData.baseQuery,this.issueBaseQuery);
        this.baseVariable = super.generateBaseVariable(previousData.baseVariable,this.issueBaseVariable);
        this.baseResponseKey = super.generateBaseResponseKeys(previousData.responseKeys,this.issueBaseResponseKey);
    }

    private async doPostCalls(crawlInformation: CrawlIssue) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlIssue.TITLE:
                keyValue = "title";
                responseKeyValues = ["title"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getIssueTitle() {
        return await this.doPostCalls(CrawlIssue.TITLE);
    }
}