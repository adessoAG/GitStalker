import { postRequest } from './postRequest';
import { objOrganization } from './interfaceOrganization';

export class Members extends postRequest{

    readonly baseQuery:string;
    readonly generatedBaseQuery:string;
    readonly baseResponseKey:string[] = ["members"];
    readonly generatedBaseResponseKeys:string[];
    readonly generatedVariables:string;

    constructor(quantity:number,organization:objOrganization){
        super();
        this.baseQuery = `members(first: ` + quantity + `) {
                insertHere
          }`;
        this.generatedBaseQuery = this.generateBaseQuery(organization.baseQuery);
        this.generatedBaseResponseKeys = this.generateBaseResponseKeys(organization.responseKeys);
        this.generatedVariables = organization.baseVariable;
    }


    generateBaseResponseKeys(previousBaseResponseKey:string[]):string[] {
        return previousBaseResponseKey.concat(this.baseResponseKey);
    }

    generateBaseQuery(previousBaseQuery:string):string{
        return previousBaseQuery.replace("insertHere",this.baseQuery);
    }

    //TODO Change generated variables to fit the standard call of startPost

    async getMembersTotalCount(){
        let keyValue: string = "totalCount";
        let responseKeyValues: string[] = ["totalCount"];
        return await super.startPost(this.generatedBaseQuery.replace("insertHere", keyValue), this.generatedVariables, this.generatedBaseResponseKeys.concat(responseKeyValues), super.processResponse);
    }

    async getMembersNames(){
        let keyValue: string = "nodes{login}";
        let responseKeyValues: string[] = ["nodes", "login"];
        return await super.startPost(this.generatedBaseQuery.replace("insertHere", keyValue), this.generatedVariables, this.generatedBaseResponseKeys.concat(responseKeyValues), super.processResponse);
    }


    async getMembersAvatarURL(){
        let keyValue: string = "nodes{avatarUrl}";
        let responseKeyValues: string[] = ["nodes", "avatarUrl"];
        return await super.startPost(this.generatedBaseQuery.replace("insertHere", keyValue), this.generatedVariables, this.generatedBaseResponseKeys.concat(responseKeyValues), super.processResponse);
    }
}