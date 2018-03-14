import { postRequest } from './postRequest';
import { Members } from './members';
import { objOrganization } from './interfaceOrganization';

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

    async getOrganizationName() {
        let keyValue: string = "login";
        let responseKeyValues: string[] = ["login"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getOrganizationAvatarURL() {
        let keyValue: string = "avatarUrl";
        let responseKeyValues: string[] = ["avatarUrl"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getOrganizationDescription() {
        let keyValue: string = "description";
        let responseKeyValues: string[] = ["description"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    getOrganizationMembers(): Members {
        let objOrganization: objOrganization = {
            baseQuery: this.baseQuery,
            baseVariable: this.baseVariable,
            responseKeys: this.baseResponseKey,
        }

        let members: Members = new Members(10, objOrganization);
        return members;
    }
}