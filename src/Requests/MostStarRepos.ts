export class MostStarRepos {
    readonly mostStarRepos: string;

    constructor(organizationName: string) {
        this.mostStarRepos = `query SearchMostTop10StarRepos {
        search(query: "user:`+ organizationName + ` stars:>=insertStarAmount", type: REPOSITORY, first: 10) {
          edges {
            node {
              ... on Repository {
                name
                description
                stargazers {
                  totalCount
                }
              }
            }
          }
        }
      }
      `;
    }

    getQuery() {
        return this.mostStarRepos;
    }
}