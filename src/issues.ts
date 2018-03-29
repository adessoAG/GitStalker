import { previousRequestData } from "./interfaceRequestData";
import { postRequest } from "./postRequest";
import { Issue } from "./issue";

export enum CrawlIssues {
    TOTALCOUNT,
    ISSUES
}

export class Issues extends postRequest {

    readonly baseQuery: string;
    readonly teamsBaseQuery: string;
    readonly teamsBaseResponseKey: string[];
    readonly baseResponseKey: string[];

    readonly previousRequest: previousRequestData;

    constructor(amount: number, previousData: previousRequestData) {
        super();
        this.teamsBaseQuery = `issues(states: OPEN, first: ` + amount + `) {
            insertHere
          }`;
        this.teamsBaseResponseKey = ["issues"];
        this.baseQuery = super.generateBaseQuery(previousData.baseQuery, this.teamsBaseQuery);
        this.baseResponseKey = super.generateBaseResponseKeys(previousData.responseKeys, this.teamsBaseResponseKey);

        this.previousRequest = previousData;
    }

    private async doPostCalls(crawlInformation: CrawlIssues) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlIssues.TOTALCOUNT:
                keyValue = "totalCount";
                responseKeyValues = ["totalCount"];
                break;
            case CrawlIssues.ISSUES:
                keyValue = "nodes{number}";
                responseKeyValues = ["nodes", "number"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }


    async getIssues() : Promise<Issue[]> {
        let repositoryIssues: number[] = (await this.doPostCalls(CrawlIssues.ISSUES)).map(Number);
        let repositoryIssuesCollection: Issue[] = [];
        repositoryIssues.forEach(issueNumber => {
            repositoryIssuesCollection.push(new Issue(issueNumber, this.previousRequest));
        });
        return repositoryIssuesCollection;
    }

    async getTotalCount() {
        return await this.doPostCalls(CrawlIssues.TOTALCOUNT);
    }
}