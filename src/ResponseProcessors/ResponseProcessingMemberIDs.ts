import { MemberID } from "../Requests/MemberID";
import { MemberDataBuffer } from "../Objects/MemberDataBuffer";

export class ResponseProcessingMemberIDs {

    private organizationMembersIDs: Array<string> = new Array<string>();
    private organizationMembersIDsJSON: any;

    constructor(organizationMembersIDsJSON: any) {
        this.organizationMembersIDsJSON = organizationMembersIDsJSON.organization.members;
    }

    processResponse() {
        return new MemberDataBuffer(this.organizationMembersIDsJSON.pageInfo.hasNextPage, this.organizationMembersIDsJSON.pageInfo.endCursor, this.generateMemberIDs(this.organizationMembersIDsJSON.nodes))
    }

    generateMemberIDs(memberIDs: any) {
        for (let memberID of memberIDs) {
            this.organizationMembersIDs.push("\"" + memberID.id + "\"")
        }
        return this.organizationMembersIDs;
    }
}