import { postRequest } from "./postRequest";

export class User extends postRequest{

    readonly baseQuery:string;
    readonly baseResponseKey:string[] = ["user"];
    readonly baseVariable:string;

    constructor(userLogin:String){
        super();
        this.baseQuery = `query ($userLogin: String!){
            user(login: $userLogin){
                insertHere
            }
            }`;
        this.baseVariable = '{"userLogin":"'+ userLogin + '"}'
    }

    async getUserName(){
        let keyValue: string = "login";
        let responseKeyValues: string[] = ["login"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getUserAvatarUrl(){
        let keyValue: string = "avatarUrl";
        let responseKeyValues: string[] = ["avatarUrl"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getUserCompany(){
        let keyValue: string = "company";
        let responseKeyValues: string[] = ["company"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async isHireable(){
        let keyValue: string = "isHireable";
        let responseKeyValues: string[] = ["isHireable"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getUserEmail(){
        let keyValue: string = "email";
        let responseKeyValues: string[] = ["email"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getUserContributedRepositories(){
        let keyValue: string = "contributedRepositories(first: 10){nodes{name}}";
        let responseKeyValues: string[] = ["contributedRepositories","nodes","name"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getUserContributedRepositoriesTotalCount(){
        let keyValue: string = "contributedRepositories(first: 10){totalCount}";
        let responseKeyValues: string[] = ["contributedRepositories","totalCount"]
        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }
}