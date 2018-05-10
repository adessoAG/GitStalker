import { Request } from "./Request";
import { ResponseProcessingMemberIDs } from "../ResponseProcessors/ResponseProcessingMemberIDs";
import { MemberDataBuffer } from "../Objects/MemberDataBuffer";
import { Query } from "../Objects/Query";
import { RequestStatus } from "./RequestStatus";
import { ResponseProcessingErrorCheck } from "../ResponseProcessors/ResponseProcessingErrorCheck";

export class MemberID extends Request {

  readonly memberIDQuery: string;
  readonly organizationName: string;
  private followingMemberIDQuery: string = "";

  constructor(organizationName: string) {
    super();
    this.organizationName = organizationName;
    this.memberIDQuery = `{
            organization(login: "`+ organizationName + `") {
              members(first: 100) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  id
                }
              }
            }
          }`;
  }

  createFollowingMemberIDQuery(organizationName: string, endCursor: string): string {
    return this.followingMemberIDQuery = `{
            organization(login: "`+ organizationName + `") {
              members(first: 100 after:"`+ endCursor + `") {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  id
                }
              }
            }
          }
          `;
  }

  async crawlData(): Promise<Array<string>> {
    const responseQuery: Query = await this.startPost(new Query(RequestStatus.CREATED, this.memberIDQuery));
    let memberIDs: Array<string> = new Array<string>();
    if (new ResponseProcessingErrorCheck(responseQuery).checkForErrors()) {
      super.tryPreviousRequestAgain();
    }
    return await this.processThroughAllMembers(responseQuery);
  }

  private async processThroughAllMembers(responseQuery: Query): Promise<Array<string>> {
    let memberIDs: Array<string>;
    let memberDataBuffer: MemberDataBuffer = new ResponseProcessingMemberIDs(responseQuery.getQueryResponse()).processResponse();
    memberIDs = memberDataBuffer.getMemberIDs();
    while (memberDataBuffer.getHasNextPage()) {
      memberDataBuffer = new ResponseProcessingMemberIDs((await this.startPost(new Query(RequestStatus.CREATED, this.createFollowingMemberIDQuery(this.organizationName, memberDataBuffer.getEndCursor())))).getQueryResponse()).processResponse();
      memberIDs = memberIDs.concat(memberDataBuffer.getMemberIDs());
    }
    return memberIDs;
  }
}
