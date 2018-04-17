import { postRequest } from './postRequest';
import { ActiveUser } from './activeUser';
import { CrawlInformation } from './CrawlInformation';
import { MostStarRepos } from './Requests/MostStarRepos';
import { MostActiveRepos } from './Requests/MostActiveRepos';
import { Members } from './Requests/Members';
import { MostActiveUserCommits } from './Requests/MostActiveUserCommits';
import { OrganizationValidation } from './Requests/OrganizationValidation';

export class Organization extends postRequest {

  readonly queryMostTop10StarRepos: string;
  readonly queryMostTop10ActiveRepos: string;
  readonly queryOrganizationMembersInformation: string;
  readonly queryMostTop10ActiveUsersCommits: string;
  readonly queryCheckIfOrganizationValid: string;
  public activeUsers: Array<ActiveUser> = new Array<ActiveUser>();


  constructor(organizationName: string) {
    super();
    this.queryMostTop10StarRepos = new MostStarRepos(organizationName).getQuery();
    this.queryMostTop10ActiveRepos = new MostActiveRepos(organizationName).getQuery();
    this.queryOrganizationMembersInformation = new Members(organizationName).getQuery();
    this.queryMostTop10ActiveRepos = new MostActiveRepos(organizationName).getQuery();
    this.queryMostTop10ActiveUsersCommits = new MostActiveUserCommits(organizationName).getQuery();
    this.queryCheckIfOrganizationValid = new OrganizationValidation(organizationName).getQuery();
  }

  private async doPostCalls(query: string, crawlInformation: CrawlInformation) {
    return await super.startPost(query, super.processResponse, crawlInformation);
  }

  async checkIfOrganizationValid(): Promise<boolean> {
    return this.doPostCalls(this.queryCheckIfOrganizationValid, CrawlInformation.SearchIfOrganizationValid).then(result => {
      if (result) {
        return true;
      } else return false;
    });
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
      for (let activeUser of result) {
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