import { postRequest } from './postRequest';
import { Members } from './members';

export class Organization extends postRequest{

    private organizationName: string;
    readonly baseQuery:string;
    readonly baseResponseKey:string[] = ["organization"];

    constructor(organizationName:string){
        super();
        this.organizationName = organizationName;
        this.baseQuery = `{
            organization(login: "`+ this.organizationName +`") {
                insertHere
            }
          }`;
    }

    getOrganizationName(){
        super.addResponseKey(this.baseResponseKey);
        super.addResponseKey(["login"]);
        super.startPost(this.baseQuery.replace("insertHere", "login"),super.processResponse);

    }

    getOrganizationAvatarURL(){
        super.addResponseKey(this.baseResponseKey);
        super.addResponseKey(["avatarUrl"]);
        super.startPost(this.baseQuery.replace("insertHere", "avatarUrl"),super.processResponse);
    }

    getOrganizationDescription(){
        super.addResponseKey(this.baseResponseKey);
        super.addResponseKey(["description"]);
        super.startPost(this.baseQuery.replace("insertHere", "description"),super.processResponse);
    }

    getOrganizationMembers(){
        super.addResponseKey(this.baseResponseKey);
        let mem = new Members(10);
        mem.generateQuery(this.baseQuery);
        mem.getMembersNames();
    }
}