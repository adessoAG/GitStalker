import { Request } from "./Request";
import { ResponseProcessingMainPage } from "../ResponseProcessors/ResponseProcessingMainPage";
import { Organization } from "../Objects/Organization";
import { Query } from "../Objects/Query";
import { RequestStatus } from "./RequestStatus";

export class MainPageData extends Request {
  readonly mainPageQuery: string;

  /**
   * Used query to crawl the information for the starting dashboard of the organization.
   * @param organizationName Selected organization to crawl information
   * @param datePrevious7Days Calculated date one week ago
   */
  constructor(organizationName: string, datePrevious7Days: Date) {
    super();
    this.mainPageQuery = `query {
            organization(login: "`+ organizationName + `") {
              name
              id
              location
              websiteUrl
              url
              description
              members(first: 100) {
                totalCount
                nodes {
                  pullRequests(last: 25, states: [MERGED, OPEN]) {
                    nodes {
                      createdAt
                      repository {
                        id
                        owner {
                          id
                        }
                      }
                    }
                  }
                }
              }
              teams(first: 1) {
                totalCount
              }
              repositories(first: 100) {
                totalCount
                nodes {
                  id
                  name
                  defaultBranchRef {
                    target {
                      ... on Commit {
                        history(first: 50, since: "`+ datePrevious7Days.toISOString() + `") {
                          nodes {
                            committedDate
                            changedFiles
                            committer {
                              user {
                                name
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          `;
  }

  getQuery(): string {
    return this.mainPageQuery;
  }

  async crawlData(): Promise<Organization> {
    return new ResponseProcessingMainPage((await this.startPost(new Query(RequestStatus.CREATED, this.mainPageQuery))).getQueryResponse()).processResponse();
  }
}
