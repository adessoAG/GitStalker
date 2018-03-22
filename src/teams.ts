import { postRequest } from "./postRequest";
import { Team } from "./team";
import { previousRequestData } from "./interfaceRequestData";

export enum CrawlTeams {
    TOTALCOUNT,
    TEAMS
}

export class Teams extends postRequest {

    readonly baseQuery: string;
    readonly teamsBaseQuery: string;
    readonly teamsBaseResponseKey: string[];
    readonly baseResponseKey: string[];
    readonly teamsBaseVariable: string;
    readonly baseVariable: string;

    readonly previousRequest:previousRequestData;

    constructor(quantity: number, previousData: previousRequestData) {
        super();
        this.teamsBaseQuery = ` teams(first: ` + quantity + `) {
                    insertHere
            }`;
        this.teamsBaseVariable = '';
        this.teamsBaseResponseKey = ["teams"];
        this.baseQuery = super.generateBaseQuery(previousData.baseQuery,this.teamsBaseQuery);
        this.baseVariable = super.generateBaseVariable(previousData.baseVariable,this.teamsBaseVariable);
        this.baseResponseKey = super.generateBaseResponseKeys(previousData.responseKeys,this.teamsBaseResponseKey);

        this.previousRequest = previousData;
    }

    private async doPostCalls(crawlInformation: CrawlTeams) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlTeams.TOTALCOUNT:
                keyValue = "totalCount";
                responseKeyValues = ["totalCount"];
                break;
            case CrawlTeams.TEAMS:
                keyValue = "nodes{name}";
                responseKeyValues = ["nodes", "name"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getTeamsTotalCount() {
        return await this.doPostCalls(CrawlTeams.TOTALCOUNT);
    }

    async getTeams(): Promise<Team[]> {
        let organizationTeamsNames:string[] = await this.doPostCalls(CrawlTeams.TEAMS);
        let organizationTeams:Team[] = [];
        organizationTeamsNames.forEach(teamName => {
            organizationTeams.push(new Team(teamName.toLowerCase(),this.previousRequest));
        });
        return organizationTeams;
    }
}