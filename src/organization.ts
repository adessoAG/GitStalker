import { postRequest } from './postRequest';
import { Members } from './members';
import { INSPECT_MAX_BYTES } from 'buffer';
import { Teams } from './teams';
import { Repositories } from './repositories';
import { previousRequestData } from './interfaceRequestData';

export enum CrawlOrganization {
    LOGIN = "login",
    AVATAR_URL = "avatarUrl",
    DESCRIPTION = "description",
    MEMBERS = "members",
    DATABASE_ID = "avatarUrl",
    ID = "id",
    LOCATION = "location",
    NAME = "name",

}

export class Organization extends postRequest {

    readonly baseQuery: string;
    readonly baseResponseKey: string[];


    constructor(organizationName: string) {
        super();
        this.baseQuery = `query {
            organization(login: "`+ organizationName + `") {
              insertHere
            }
          }
          `;
        this.baseResponseKey = ["organization"];
    }

    private async doPostCalls(crawlInformation: CrawlOrganization) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlOrganization.LOGIN:
                keyValue = CrawlOrganization.LOGIN.valueOf();
                responseKeyValues = [CrawlOrganization.LOGIN.valueOf()];
                break;
            case CrawlOrganization.AVATAR_URL:
                keyValue = CrawlOrganization.AVATAR_URL.valueOf();
                responseKeyValues = [CrawlOrganization.AVATAR_URL.valueOf()];
                break;
            case CrawlOrganization.DESCRIPTION:
                keyValue = CrawlOrganization.DESCRIPTION.valueOf();
                responseKeyValues = [CrawlOrganization.DESCRIPTION.valueOf()];
                break;
            case CrawlOrganization.ID:
                keyValue = CrawlOrganization.ID.valueOf();
                responseKeyValues = [CrawlOrganization.ID.valueOf()];
                break;
            case CrawlOrganization.LOCATION:
                keyValue = CrawlOrganization.LOCATION.valueOf();
                responseKeyValues = [CrawlOrganization.LOCATION.valueOf()];
                break;
            case CrawlOrganization.NAME:
                keyValue = CrawlOrganization.NAME.valueOf();
                responseKeyValues = [CrawlOrganization.NAME.valueOf()];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseResponseKey.concat(responseKeyValues), super.processResponse);
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
        return new Members(amount, super.generateRequestDataObject(this.baseQuery, this.baseResponseKey));
    }

    getOrganizationTeams(amount: number): Teams {
        return new Teams(amount, super.generateRequestDataObject(this.baseQuery, this.baseResponseKey));
    }

    getOrganizationRepositories(amount: number): Repositories {
        return new Repositories(amount, super.generateRequestDataObject(this.baseQuery, this.baseResponseKey));
    }
}