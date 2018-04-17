export class Members {
    organizationMembers: string;

    constructor(organizationName: string) {
        this.organizationMembers = `query SearchMostTop10ActiveUserIDs {
            organization(login: "`+ organizationName + `") {
              members(first: 100) {
                totalCount
                edges {
                  cursor
                }
                nodes {
                  id
                  login
                  name
                }
              }
            }
          }
          `;
    }

    getQuery() {
        return this.organizationMembers;
    }
}