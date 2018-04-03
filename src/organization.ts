import { postRequest } from './postRequest';
import { INSPECT_MAX_BYTES } from 'buffer';

export enum CrawlOrganization {
    SearchMostTop10StarRepos,
    SearchMostTop10ActiveRepos,
    SearchMostTop10ActiveUsers
}

export class Organization extends postRequest {

    private mostTop10StarRepos: string;
    private mostTop10ActiveRepos: string;
    private mostTop10ActiveUsersIDs: string;


    constructor(organizationName: string) {
        super();
        this.mostTop10StarRepos = `query SearchMostTop10StarRepos {
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
        this.mostTop10ActiveRepos = `query SearchMostTop10ActiveRepos {
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

    private async doPostCalls(crawlInformation: CrawlOrganization) {
        let query: string;

        switch (crawlInformation) {
            case CrawlOrganization.SearchMostTop10StarRepos:
                query = this.mostTop10StarRepos;
                break;
            case CrawlOrganization.SearchMostTop10ActiveRepos:
                query = this.mostTop10ActiveRepos;
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(query, super.processResponse, crawlInformation);
    }

    async getTop10StarRepos(minStarAmount: number) {
        this.mostTop10StarRepos = this.mostTop10StarRepos.replace("insertStarAmount", minStarAmount.toString());
        return await this.doPostCalls(CrawlOrganization.SearchMostTop10StarRepos);
    }

    async getTop10ActiveRepos() {
        this.mostTop10ActiveRepos = this.mostTop10ActiveRepos.replace("insertDate",this.getDatePrevious7Days().toISOString());
        return await this.doPostCalls(CrawlOrganization.SearchMostTop10ActiveRepos);
    }

    getDatePrevious7Days():Date {
        var date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }


}