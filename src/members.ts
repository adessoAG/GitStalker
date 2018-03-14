import { postRequest } from './postRequest';
import { objOrganization } from './interfaceOrganization';

export class Members extends postRequest{

    readonly membersBaseQuery:string;
    readonly baseQuery:string;
    readonly membersBaseResponseKey:string[] = ["members"];
    readonly baseResponseKey:string[];
    readonly membersBaseVariable:string;
    readonly baseVariable:string;

    constructor(quantity:number,organization:objOrganization){
        super();
        this.membersBaseQuery = `members(first: ` + quantity + `) {
                insertHere
          }`;
        this.membersBaseVariable = '';
        this.baseQuery = this.generateBaseQuery(organization.baseQuery);
        this.baseResponseKey = this.generateBaseResponseKeys(organization.responseKeys);
        this.baseVariable = organization.baseVariable;
    }


    generateBaseVariable(previousBaseVariable:string):string {
        return previousBaseVariable.concat(this.membersBaseVariable);
    }

    generateBaseResponseKeys(previousBaseResponseKey:string[]):string[] {
        return previousBaseResponseKey.concat(this.membersBaseResponseKey);
    }

    generateBaseQuery(previousBaseQuery:string):string{
        return previousBaseQuery.replace("insertHere",this.membersBaseQuery);
    }

    async getMembersTotalCount(){
        let keyValue: string = "totalCount";
        let responseKeyValues: string[] = ["totalCount"];
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getMembersNames(){
        let keyValue: string = "nodes{login}";
        let responseKeyValues: string[] = ["nodes", "login"];
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }


    async getMembersAvatarURL(){
        let keyValue: string = "nodes{avatarUrl}";
        let responseKeyValues: string[] = ["nodes", "avatarUrl"];
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }
}