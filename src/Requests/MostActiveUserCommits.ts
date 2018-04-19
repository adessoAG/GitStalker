export class MostActiveUserCommits {
    mostActiveUserCommits: string;

    constructor(organizationName: string) {
        this.mostActiveUserCommits = `query SearchMostTop10ActiveUsers {
            user(login: "insertLogin") {
              login
              id
              name
              repositoriesContributedTo(first: 100) {
                totalCount
                nodes {
                  defaultBranchRef {
                    target {
                      ... on Commit {
                        history(first: 100, since: "insertDate", author: {id: "insertID"}) {
                          totalCount
                        }
                      }
                    }
                  }
                }
              }
            }
            rateLimit {limit cost remaining resetAt}
          }
          `;
    }

    getQuery() {
        return this.mostActiveUserCommits;
    }
}
