import { postRequest } from "./postRequest";
import { objOrganization } from "./interfaceOrganization";

export enum CrawlTeam {
    NAME,
    AVATAR_URL
}

export class Team extends postRequest{

    readonly baseQuery: string;
    readonly teamBaseQuery: string;
    readonly teamBaseResponseKey: string[];
    readonly baseResponseKey: string[];
    readonly teamBaseVariable: string;
    readonly baseVariable: string;

    constructor(slug: string, organization: objOrganization) {
        super();
        this.teamBaseQuery = `team(slug: "`+ slug +`") {
            insertHere
          }`;
        this.teamBaseVariable = '';
        this.teamBaseResponseKey = ["team"];
        this.baseQuery = this.generateBaseQuery(organization.baseQuery);
        this.baseVariable = this.generateBaseVariable(organization.baseVariable);
        this.baseResponseKey = this.generateBaseResponseKeys(organization.responseKeys);
    }

    private generateBaseVariable(previousBaseVariable: string): string {
        return previousBaseVariable.concat(this.teamBaseVariable);
    }

    private generateBaseResponseKeys(previousBaseResponseKey: string[]): string[] {
        return previousBaseResponseKey.concat(this.teamBaseResponseKey);
    }

    private generateBaseQuery(previousBaseQuery: string): string {
        return previousBaseQuery.replace("insertHere", this.teamBaseQuery);
    }

    private async doPostCalls(crawlInformation: CrawlTeam) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlTeam.NAME:
                keyValue = "name";
                responseKeyValues = ["name"];
                break;
            case CrawlTeam.AVATAR_URL:
                keyValue = "avatarUrl";
                responseKeyValues = ["avatarUrl"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getTeamName() {
        return await this.doPostCalls(CrawlTeam.NAME);
    }

    async getTeamAvatarUrl() {
        return await this.doPostCalls(CrawlTeam.AVATAR_URL);
    }
}