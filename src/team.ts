import { postRequest } from "./postRequest";
import { previousRequestData } from "./interfaceRequestData";

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

    constructor(slug: string, previousData: previousRequestData) {
        super();
        this.teamBaseQuery = `team(slug: "`+ slug +`") {
            insertHere
          }`;
        this.teamBaseVariable = '';
        this.teamBaseResponseKey = ["team"];
        this.baseQuery = this.generateBaseQuery(previousData.baseQuery);
        this.baseVariable = this.generateBaseVariable(previousData.baseVariable);
        this.baseResponseKey = this.generateBaseResponseKeys(previousData.responseKeys);
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