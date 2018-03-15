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
        this.baseQuery = this.generateBaseQuery(previousData.baseQuery);
        this.baseVariable = this.generateBaseVariable(previousData.baseVariable);
        this.baseResponseKey = this.generateBaseResponseKeys(previousData.responseKeys);

        this.previousRequest = previousData;
    }

    private generateBaseVariable(previousBaseVariable: string): string {
        return previousBaseVariable.concat(this.teamsBaseVariable);
    }

    private generateBaseResponseKeys(previousBaseResponseKey: string[]): string[] {
        return previousBaseResponseKey.concat(this.teamsBaseResponseKey);
    }

    private generateBaseQuery(previousBaseQuery: string): string {
        return previousBaseQuery.replace("insertHere", this.teamsBaseQuery);
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