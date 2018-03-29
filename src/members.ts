import { postRequest } from './postRequest';
import { User } from './user';
import { previousRequestData } from './interfaceRequestData';

export enum CrawlMembers {
    TOTALCOUNT,
    MEMBERS
}

export class Members extends postRequest {

    readonly membersBaseQuery: string;
    readonly baseQuery: string;
    readonly membersBaseResponseKey: string[];
    readonly baseResponseKey: string[];

    constructor(quantity: number, previousData: previousRequestData) {
        super();
        this.membersBaseQuery = `members(first: ` + quantity + `) {
                insertHere
          }`;
        this.membersBaseResponseKey = ["members"]; 
        this.baseQuery = super.generateBaseQuery(previousData.baseQuery,this.membersBaseQuery);
        this.baseResponseKey = super.generateBaseResponseKeys(previousData.responseKeys,this.membersBaseResponseKey);
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

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseResponseKey.concat(responseKeyValues), super.processResponse);
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