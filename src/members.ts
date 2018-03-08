import { postRequest } from './postRequest';

export class Members extends postRequest{

    private memberAmount: number;
    private generatedQuery:string;
    readonly baseQuery:string;
    readonly baseResponseKey:string[] = ["members"];

    constructor(memberAmount:number){
        super();
        this.baseQuery = `members(first: ` + memberAmount + `) {
            nodes{
                insertHere
            }
          }`;
    }

    generateQuery(parentQuery:string){
        this.generatedQuery = parentQuery.replace("insertHere", this.baseQuery);
    }

    getMembersNames(){
        super.addResponseKey(this.baseResponseKey);
        super.addResponseKey(["nodes", "login"]);
        super.startPost(this.generatedQuery.replace("insertHere", "login"),super.processResponse);
    }

    getMembersAvaterURL(){
        super.addResponseKey(this.baseResponseKey);
        super.addResponseKey(["nodes", "avatarUrl"]);
        super.startPost(this.generatedQuery.replace("insertHere", "avatarUrl"),super.processResponse);
    }
}