export class TeamData {
    teamQuery: string;
  
    /**
     * Used query to crawl the detailed information about the teams of the organization.
     * @param organizationName Selected organization to crawl information
     * @param datePrevious7Days Calculated date one week ago
     */
    constructor(organizationName: string, datePrevious7Days: Date) {
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
  }
  