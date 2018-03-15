import { postRequest } from './postRequest';
import { objOrganization } from './interfaceOrganization';
import { User } from './user';

export enum CrawlMembers {
    TOTALCOUNT,
    MEMBERS
}

export class Members extends postRequest {

    readonly membersBaseQuery: string;
    readonly baseQuery: string;
    readonly membersBaseResponseKey: string[];
    readonly baseResponseKey: string[];
    readonly membersBaseVariable: string;
    readonly baseVariable: string;

    constructor(quantity: number, organization: objOrganization) {
        super();
        this.membersBaseQuery = `members(first: ` + quantity + `) {
                insertHere
          }`;
        this.membersBaseVariable = '';
        this.membersBaseResponseKey = ["members"]; 
        this.baseQuery = this.generateBaseQuery(organization.baseQuery);
        this.baseResponseKey = this.generateBaseResponseKeys(organization.responseKeys);
        this.baseVariable = organization.baseVariable;
    }


    private generateBaseVariable(previousBaseVariable: string): string {
        return previousBaseVariable.concat(this.membersBaseVariable);
    }

    private generateBaseResponseKeys(previousBaseResponseKey: string[]): string[] {
        return previousBaseResponseKey.concat(this.membersBaseResponseKey);
    }

    private generateBaseQuery(previousBaseQuery: string): string {
        return previousBaseQuery.replace("insertHere", this.membersBaseQuery);
    }

    private async doPostCalls(crawlInformation: CrawlMembers) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlMembers.TOTALCOUNT:
                keyValue = "totalCount";
                responseKeyValues = ["totalCount"];
                break;
            case CrawlMembers.MEMBERS:
                keyValue = "nodes{login}";
                responseKeyValues = ["nodes", "login"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getMembersTotalCount() {
        return await this.doPostCalls(CrawlMembers.TOTALCOUNT);
    }

    async getMembers():Promise<User[]> {
        let membersLogin:string[] = await this.doPostCalls(CrawlMembers.MEMBERS);
        let membersUser:User[] = [];
        membersLogin.forEach(memberLogin => {
            membersUser.push(new User(memberLogin));
        });
        return membersUser;
    }

}