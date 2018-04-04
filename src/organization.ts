import { postRequest } from './postRequest';
import { INSPECT_MAX_BYTES } from 'buffer';
import { ActiveUser } from './activeUser';
import { WSAVERNOTSUPPORTED } from 'constants';

export enum CrawlOrganization {
  SearchMostTop10StarRepos,
  SearchMostTop10ActiveRepos,
  SearchMostTop10ActiveUserInformation,
  SearchMostTop10ActiveUsersCommits
}

export class Organization extends postRequest {

  readonly queryMostTop10StarRepos: string;
  readonly queryMostTop10ActiveRepos: string;
  readonly queryOrganizationMembersInformation: string;
  readonly queryMostTop10ActiveUsersCommits: string;
  public static activeUsers: Array<ActiveUser> = new Array<ActiveUser>();


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

  private async doPostCalls(query: string, crawlInformation: CrawlOrganization) {
    return await super.startPost(query, super.processResponse, crawlInformation);
  }

  async getTop10StarRepos(minStarAmount: number) {
    return await this.doPostCalls(this.queryMostTop10StarRepos.replace("insertStarAmount", minStarAmount.toString()), CrawlOrganization.SearchMostTop10StarRepos);
  }

  async getTop10ActiveRepos() {
    return await this.doPostCalls(this.queryMostTop10ActiveRepos.replace("insertDate", this.getDatePrevious7Days().toISOString()), CrawlOrganization.SearchMostTop10ActiveRepos);
  }

  async getTop10ActiveUsers() {
    Organization.activeUsers = await this.doPostCalls(this.queryOrganizationMembersInformation, CrawlOrganization.SearchMostTop10ActiveUserInformation);
    console.log(Organization.activeUsers.length)
    var commitPromises: Array<Promise<any>> = new Array<Promise<any>>();
    for (let activeUser of Organization.activeUsers) {
      commitPromises.push(this.doPostCalls(this.queryMostTop10ActiveUsersCommits
        .replace('insertLogin', activeUser.getUserLogin())
        .replace("insertDate", this.getDatePrevious7Days().toISOString())
        .replace("insertID", activeUser.getUserID())
        , CrawlOrganization.SearchMostTop10ActiveUsersCommits));
    }

    await Promise.all(commitPromises);
    return Organization.activeUsers;
  }

  getDatePrevious7Days(): Date {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }

}