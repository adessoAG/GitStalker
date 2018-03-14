import { postRequest } from "./postRequest";
import { objOrganization } from "./interfaceOrganization";
import { Team } from "./team";

export enum CrawlTeams {
    TOTALCOUNT,
    TEAMS
}

export class Teams extends postRequest {

    readonly baseQuery: string;
    readonly teamsBaseQuery: string;
    readonly teamsBaseResponseKey: string[] = ["team"];
    readonly baseResponseKey: string[];
    readonly teamsBaseVariable: string;
    readonly baseVariable: string;

    readonly previousOrganization:objOrganization;

    constructor(quantity: number, organization: objOrganization) {
        super();
        this.teamsBaseQuery = ` teams(first: ` + quantity + `) {
                    insertHere
            }`;
        this.teamsBaseVariable = '';
        this.teamsBaseResponseKey = ["teams"];
        this.baseQuery = this.generateBaseQuery(organization.baseQuery);
        this.baseVariable = this.generateBaseVariable(organization.baseVariable);
        this.baseResponseKey = this.generateBaseResponseKeys(organization.responseKeys);

        this.previousOrganization = organization;
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
            organizationTeams.push(new Team(teamName.toLowerCase(),this.previousOrganization));
        });
        return organizationTeams;
    }
}