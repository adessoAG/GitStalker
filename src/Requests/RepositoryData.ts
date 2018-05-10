import { Request } from "./Request";
import { ResponseProcessingRepository } from "../ResponseProcessors/ResponseProcessingRepository";
import { Repository } from "../Objects/Repository";
import { Query } from "../Objects/Query";
import { RequestStatus } from "./RequestStatus";

export class RepositoryData extends Request {
  readonly repositoryQuery: string;

  /**
   * Used query to crawl the detailed information about the repositories of the organization.
   * @param organizationName Selected organization to crawl information
   * @param datePrevious7Days Calculated date one week ago
   */
  constructor(organizationName: string, datePrevious7Days: Date) {
    super();
    this.repositoryQuery = `{
            organization(login: "`+ organizationName + `") {
              repositories(first: 100) {
                nodes {
                  name
                  description
                  forkCount
                  stargazers {
                    totalCount
                  }
                  licenseInfo {
                    name
                  }
                  primaryLanguage {
                    name
                  }
                  defaultBranchRef {
                    target {
                      ... on Commit {
                        history(first: 50, since: "`+ datePrevious7Days.toISOString() + `") {
                          nodes {
                            committedDate
                          }
                        }
                      }
                    }
                  }
                  pullRequests(last: 50) {
                    nodes {
                      createdAt
                    }
                  }
                  issues(last: 50) {
                    nodes {
                      createdAt
                    }
                  }
                }
              }
            }
          }          
          `;
  }

  /**
  * Returns a string which represents the query.
  */
  getQuery(): string {
    return this.repositoryQuery;
  }

  async crawlData(): Promise<Array<Repository>> {
    return new ResponseProcessingRepository((await this.startPost(new Query(RequestStatus.CREATED,this.repositoryQuery))).getQueryResponse()).processResponse();
  }
}
