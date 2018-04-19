export class MostActiveRepos {
    mostActiveRepos: string;

    constructor(organizationName: string) {
        this.mostActiveRepos = `query SearchMostTop10ActiveRepos {
            search(query: "user:`+ organizationName + `", type: REPOSITORY, first: 100) {
              repositoryCount
              edges {
                node {
                  ... on Repository {
                    name
                    description
                    defaultBranchRef {
                      target {
                        ... on Commit {
                          history(first: 100, since: "insertDate") {
                            totalCount
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

    getQuery() {
        return this.mostActiveRepos;
    }
}