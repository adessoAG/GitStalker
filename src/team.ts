import { postRequest } from "./postRequest";
import { previousRequestData } from "./interfaceRequestData";

export enum CrawlTeam {
    NAME = "name",
    AVATAR_URL = "avatarUrl"
}

export class Team extends postRequest{

    readonly baseQuery: string;
    readonly teamBaseQuery: string;
    readonly teamBaseResponseKey: string[];
    readonly baseResponseKey: string[];

    constructor(slug: string, previousData: previousRequestData) {
        super();
        this.teamBaseQuery = `team(slug: "`+ slug +`") {
            insertHere
          }`;
        this.teamBaseResponseKey = ["team"];
        this.baseQuery = super.generateBaseQuery(previousData.baseQuery,this.teamBaseQuery);
        this.baseResponseKey = super.generateBaseResponseKeys(previousData.responseKeys,this.teamBaseResponseKey);
    }

    private async doPostCalls(crawlInformation: CrawlTeam) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlTeam.NAME:
                keyValue = CrawlTeam.NAME.valueOf();
                responseKeyValues = [CrawlTeam.NAME.valueOf()];
                break;
            case CrawlTeam.AVATAR_URL:
                keyValue = CrawlTeam.AVATAR_URL.valueOf();
                responseKeyValues = [CrawlTeam.AVATAR_URL.valueOf()];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getTeamName() {
        return await this.doPostCalls(CrawlTeam.NAME);
    }

    async getTeamAvatarUrl() {
        return await this.doPostCalls(CrawlTeam.AVATAR_URL);
    }
}