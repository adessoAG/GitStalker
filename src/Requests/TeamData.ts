import { Request } from "./Request";
import { ResponseProcessingTeams } from "../ResponseProcessors/ResponseProcessingTeams";
import { Team } from "../Objects/Team";
import { Query } from "../Objects/Query";
import { RequestStatus } from "./RequestStatus";

export class TeamData extends Request {
  readonly teamQuery: string;

  /**
   * Used query to crawl the detailed information about the teams of the organization.
   * @param organizationName Selected organization to crawl information
   * @param datePrevious7Days Calculated date one week ago
   */
  constructor(organizationName: string, datePrevious7Days: Date) {
    super();
    this.teamQuery = `{
        organization(login: "`+ organizationName + `") {
          teams(first: 50) {
            totalCount
            nodes {
              name
              description
              avatarUrl
              repositories(first: 10) {
                totalCount
                nodes {
                  name
                  defaultBranchRef {
                    target {
                      ... on Commit {
                        history(first: 25, since: "`+ datePrevious7Days.toISOString() + `") {
                          totalCount
                        }
                      }
                    }
                  }
                }
              }
              members {
                totalCount
              }
            }
          }
        }
      }`;
  }

  /**
   * Returns a string which represents the query.
   */
  getQuery(): string {
    return this.teamQuery;
  }

  async crawlData(): Promise<Array<Team>> {
    return new ResponseProcessingTeams((await this.startPost(new Query(RequestStatus.CREATED,this.teamQuery))).getQueryResponse()).processResponse();
  }
}
