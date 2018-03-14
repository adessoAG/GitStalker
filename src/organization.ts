import { postRequest } from './postRequest';
import { Members } from './members';
import { objOrganization } from './interfaceOrganization';
import { INSPECT_MAX_BYTES } from 'buffer';

export enum CrawlOrganization {
    LOGIN,
    AVATAR_URL,
    DESCRIPTION,
    MEMBERS,

}

export class Organization extends postRequest {

    readonly baseQuery: string;
    readonly baseResponseKey: string[] = ["organization"];
    readonly baseVariable: string;


    constructor(organizationName: string) {
        super();
        this.baseQuery = `query ($organizationName: String!) {
            organization(login: $organizationName) {
              insertHere
            }
          }
          `;
        this.baseVariable = '{"organizationName": "' + organizationName + '"}';
    }

    async doPostCalls(crawlInformation: CrawlOrganization) {
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
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getOrganizationName() {
        return await this.doPostCalls(CrawlOrganization.LOGIN);
    }

    async getOrganizationAvatarURL() {
        return await this.doPostCalls(CrawlOrganization.AVATAR_URL);
    }

    async getOrganizationDescription() {
        return await this.doPostCalls(CrawlOrganization.DESCRIPTION);
    }

    generateOrganizationObject():objOrganization{
        let objOrganization: objOrganization = {
            baseQuery: this.baseQuery,
            baseVariable: this.baseVariable,
            responseKeys: this.baseResponseKey,
        }
        return objOrganization;
    }

    getOrganizationMembers(amount:number): Members {
        return new Members(amount, this.generateOrganizationObject());
    }
}