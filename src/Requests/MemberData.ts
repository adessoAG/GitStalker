export class MemberData {
    memberQuery: string;

    constructor(organizationName: string, datePrevious7Days: Date) {
        this.memberQuery = `{
            organization(login: "`+ organizationName + `") {
              members(first: 100) {
                nodes {
                  name
                  login
                  url
                  avatarUrl
                  repositoriesContributedTo(last: 10, includeUserRepositories: true, contributionTypes: COMMIT) {
                    nodes {
                      defaultBranchRef {
                        target {
                          ... on Commit {
                            history(first: 10, since: "`+ datePrevious7Days.toISOString() + `") {
                              nodes {
                                committedDate
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                  issues(last: 10) {
                    nodes {
                      createdAt
                    }
                  }
                  pullRequests(last: 10) {
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

    getQuery(): string {
        return this.memberQuery;
    }
}
