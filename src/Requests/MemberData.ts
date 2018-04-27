export class MemberData {
  memberQuery: string;

  /**
   * Used query to crawl the detailed information about the member of the organization.
   * @param organizationName Selected organization to crawl information
   * @param datePrevious7Days Calculated date one week ago
   */
  constructor(organizationName: string, datePrevious7Days: Date) {
    this.memberQuery = `{
            organization(login: "`+ organizationName + `") {
              members(first: 100) {
                nodes {
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
            }
          }
          `;
  }

  /**
   * Returns a string which represents the query.
   */
  getQuery(): string {
    return this.memberQuery;
  }
}
