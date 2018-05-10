import { Request } from "./Request";
import { Member } from "../Objects/Member";
import { ResponseProcessingMember } from "../ResponseProcessors/ResponseProcessingMember";
import { Query } from "../Objects/Query";
import { RequestStatus } from "./RequestStatus";
import { ResponseProcessingErrorCheck } from "../ResponseProcessors/ResponseProcessingErrorCheck";

export class MemberData extends Request {
  readonly memberQuery: string;
  private memberDataPromises: Array<Promise<Query>>;

  /**
   * Used query to crawl the detailed information about the member of the organization.
   * @param organizationName Selected organization to crawl information
   * @param datePrevious7Days Calculated date one week ago
   */
  constructor(memberIDs: Array<string>, datePrevious7Days: Date) {
    super();
    this.memberQuery = `{
      nodes(ids: [insertIDs]) {
        ... on User {
          name
          login
          url
          avatarUrl
          repositoriesContributedTo(last: 25, includeUserRepositories: true, contributionTypes: COMMIT) {
            nodes {
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 25, since: "`+ datePrevious7Days.toISOString() + `") {
                      nodes {
                        committedDate
                      }
                    }
                  }
                }
              }
            }
          }
          issues(last: 25) {
            nodes {
              createdAt
            }
          }
          pullRequests(last: 25) {
            nodes {
              createdAt
            }
          }
        }
      }
    }`;
    this.memberDataPromises = this.generateMemberDataPromises(memberIDs);
  }

  /**
   * Returns a string which represents the query.
   */
  getQuery(): string {
    return this.memberQuery;
  }

  generateMemberDataPromises(memberIDs: Array<string>) {
    let memberDataPromises: Array<Promise<Query>> = new Array<Promise<Query>>();
    while (memberIDs.length != 0) {
      memberDataPromises.push(this.startPost(new Query(RequestStatus.CREATED, this.memberQuery.replace("insertIDs", memberIDs.splice(0, 10).toString()))));
    }

    return memberDataPromises;
  }
  async crawlData() {
    let totalMember: Array<Member> = new Array<Member>();
    for (let promise of this.memberDataPromises) {
      let resolvedQuery: Query = await Promise.resolve(promise);
      if (new ResponseProcessingErrorCheck(resolvedQuery).checkForErrors()) {
        super.tryPreviousRequestAgain();
      }
      totalMember = totalMember.concat(new ResponseProcessingMember(resolvedQuery.getQueryResponse()).processResponse());
    }
    return totalMember;
  }
}
