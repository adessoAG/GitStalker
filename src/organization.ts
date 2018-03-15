import { postRequest } from './postRequest';
import { Members } from './members';
import { objOrganization } from './interfaceOrganization';
import { INSPECT_MAX_BYTES } from 'buffer';
import { Teams } from './teams';
import { Repositories } from './repositories';

export enum CrawlOrganization {
    LOGIN,
    AVATAR_URL,
    DESCRIPTION,
    MEMBERS,
    DATABASE_ID,
    ID,
    LOCATION,
    NAME,

}

export class Organization extends postRequest {

    readonly baseQuery: string;
    readonly baseResponseKey: string[];
    readonly baseVariable: string;


    constructor(organizationName: string) {
        super();
        this.baseQuery = `query ($organizationName: String!) {
            organization(login: $organizationName) {
              insertHere
            }
          }
          `;
        this.baseResponseKey = ["organization"];
        this.baseVariable = '{"organizationName": "' + organizationName + '"}';
    }

    private async doPostCalls(crawlInformation: CrawlOrganization) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlOrganization.LOGIN:
                keyValue = "login";
                responseKeyValues = ["login"];
                break;
            case CrawlOrganization.AVATAR_URL:
                keyValue = "avatarUrl";
                responseKeyValues = ["avatarUrl"];
                break;
            case CrawlOrganization.DESCRIPTION:
                keyValue = "description";
                responseKeyValues = ["description"];
                break;
            case CrawlOrganization.ID:
                keyValue = "id";
                responseKeyValues = ["id"];
                break;
                case CrawlOrganization.LOCATION:
                keyValue = "location";
                responseKeyValues = ["location"];
                break;
                case CrawlOrganization.NAME:
                keyValue = "name";
                responseKeyValues = ["name"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    private generateOrganizationObject(): objOrganization {
        let objOrganization: objOrganization = {
            baseQuery: this.baseQuery,
            baseVariable: this.baseVariable,
            responseKeys: this.baseResponseKey,
        }
        return objOrganization;
    }

    async getOrganizationLogin() {
        return await this.doPostCalls(CrawlOrganization.LOGIN);
    }

    async getOrganizationAvatarURL() {
        return await this.doPostCalls(CrawlOrganization.AVATAR_URL);
    }

    async getOrganizationDescription() {
        return await this.doPostCalls(CrawlOrganization.DESCRIPTION);
    }

    async getOrganizationID() {
        return await this.doPostCalls(CrawlOrganization.ID);
    }

    async getOrganizationLocation() {
        return await this.doPostCalls(CrawlOrganization.LOCATION);
    }

    async getOrganizationName() {
        return await this.doPostCalls(CrawlOrganization.NAME);
    }

    getOrganizationMembers(amount: number): Members {
        return new Members(amount, this.generateOrganizationObject());
    }

    getOrganizationTeams(amount: number): Teams {
        return new Teams(amount,this.generateOrganizationObject());
    }

    getOrganizationRepositories(amount: number): Repositories {
        return new Repositories(amount,this.generateOrganizationObject());
    }
}