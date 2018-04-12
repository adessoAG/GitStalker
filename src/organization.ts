import { postRequest } from './postRequest';
import { INSPECT_MAX_BYTES } from 'buffer';
import { ActiveUser } from './activeUser';
import { CrawlInformation } from './CrawlInformation';

export class Organization extends postRequest {

  readonly queryMostTop10StarRepos: string;
  readonly queryMostTop10ActiveRepos: string;
  readonly queryOrganizationMembersInformation: string;
  readonly queryMostTop10ActiveUsersCommits: string;
  public activeUsers: Array<ActiveUser> = new Array<ActiveUser>();


  constructor(organizationName: string) {
    super();
    this.queryMostTop10StarRepos = `query SearchMostTop10StarRepos {
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
    this.queryMostTop10ActiveRepos = `query SearchMostTop10ActiveRepos {
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
    this.queryOrganizationMembersInformation = `query SearchMostTop10ActiveUserIDs {
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
    this.queryMostTop10ActiveUsersCommits = `query SearchMostTop10ActiveUsers {
      user(login: "insertLogin") {
        login
        id
        name
        contributedRepositories(first: 100) {
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

  private async doPostCalls(query: string, crawlInformation: CrawlInformation) {
    return await super.startPost(query, super.processResponse, crawlInformation);
  }

  async getTop10StarRepos(minStarAmount: number) {
    return await this.doPostCalls(this.queryMostTop10StarRepos.replace("insertStarAmount", minStarAmount.toString()), CrawlInformation.SearchMostTop10StarRepos);
  }

  async getTop10ActiveRepos() {
    return await this.doPostCalls(this.queryMostTop10ActiveRepos.replace("insertDate", this.getDatePrevious7Days().toISOString()), CrawlInformation.SearchMostTop10ActiveRepos);
  }

  async getTop10ActiveUsers() {
    this.activeUsers = await this.doPostCalls(this.queryOrganizationMembersInformation, CrawlInformation.SearchMostTop10ActiveUserInformation);
    var commitPromises: Array<Promise<ActiveUser>> = new Array<Promise<ActiveUser>>();
    for (let activeUser of this.activeUsers) {
      commitPromises.push(this.doPostCalls(this.queryMostTop10ActiveUsersCommits
        .replace('insertLogin', activeUser.getUserLogin())
        .replace("insertDate", this.getDatePrevious7Days().toISOString())
        .replace("insertID", activeUser.getUserID())
        , CrawlInformation.SearchMostTop10ActiveUsersCommits));
    }
    this.activeUsers = [];
    await Promise.all(commitPromises).then(result => {
          for(let activeUser of result){
            this.activeUsers.push(activeUser);
          }
       });
    sortActiveUsers(this.activeUsers);
    return this.activeUsers;
  }

  getDatePrevious7Days(): Date {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }

}

function sortActiveUsers(activeUsers: Array<ActiveUser>) {
  activeUsers.sort((a, b) => {
      if (a.getCommitAmount() == b.getCommitAmount()) {
          return 0;
      } else {
          if (a.getCommitAmount() > b.getCommitAmount()) {
              return -1;
          }
          else if (a.getCommitAmount() < b.getCommitAmount()) {
              return 1;
          }
      }
  })
}