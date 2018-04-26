export class MainPageData {
  mainPageQuery: string;

  constructor(organizationName: string, datePrevious7Days: Date) {
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
}
