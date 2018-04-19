import { postRequest } from './postRequest';
import { ActiveUser } from './activeUser';
import { CrawlInformation } from './CrawlInformation';
import { MostStarRepos } from './Requests/MostStarRepos';
import { MostActiveRepos } from './Requests/MostActiveRepos';
import { Members } from './Requests/Members';
import { MostActiveUserCommits } from './Requests/MostActiveUserCommits';
import { OrganizationValidation } from './Requests/OrganizationValidation';

/**
 * Defines request queries and sends requests to GitHub GraphQL API via parent class 'postRequest';
 */
export class Organization extends postRequest {

  readonly queryMostStarRepos: string;
  readonly queryMostActiveRepos: string;
  readonly queryOrganizationMembersInformation: string;
  readonly queryMostActiveUsersCommits: string;
  readonly queryCheckIfOrganizationValid: string;
  public activeUsers: Array<ActiveUser> = new Array<ActiveUser>();


  /**
   * 
   * @param organizationName 
   * Initialize the search querys that are used to retrieve data from the GitHub GraphQL API
   */
  constructor(organizationName: string) {
    super();
    this.queryMostTop10StarRepos = new MostStarRepos(organizationName).getQuery();
    this.queryMostTop10ActiveRepos = new MostActiveRepos(organizationName).getQuery();
    this.queryOrganizationMembersInformation = new Members(organizationName).getQuery();
    this.queryMostTop10ActiveRepos = new MostActiveRepos(organizationName).getQuery();
    this.queryMostTop10ActiveUsersCommits = new MostActiveUserCommits(organizationName).getQuery();
    this.queryCheckIfOrganizationValid = new OrganizationValidation(organizationName).getQuery();
  }

  /**
   * 
   * @param query String that is sent to the GitHub API endpoint
   * @param crawlInformation Enum that is used to specify response handling the the 'postRequest' class
   * Uses parent class 'postRequest' to send requests with above mentioned parameters.
   */
  private async doPostCalls(query: string, crawlInformation: CrawlInformation) {
    return await super.startPost(query, super.processResponse, crawlInformation);
  }

  /**
   * Checks if an organization exists by asking for its ID via a query. No response = return false = organization doesn't exist.
   */
  async checkIfOrganizationValid(): Promise<boolean> {
    return this.doPostCalls(this.queryCheckIfOrganizationValid, CrawlInformation.SearchIfOrganizationValid).then(result => {
      if (result) {
        return true;
      } else return false;
    });
  }

  /**
   * 
   * @param minStarAmount Minimum amount of stars to filter by. Required field in GraphQL search query
   * Sends query to retrieve data about stars on repositories.
   */
  async getMostStarRepos(minStarAmount: number) {
    let newQuery = this.queryMostStarRepos.replace("insertStarAmount", minStarAmount.toString());
    return await this.doPostCalls(newQuery, CrawlInformation.SearchMostStarRepos);
  }

  /**
   * Sends query to retrieve data about commits on repositories from the last 7 days.
   */
  async getMostActiveRepos() {
    let newQuery = this.queryMostActiveRepos.replace("insertDate", this.getDatePrevious7Days().toISOString());
    return await this.doPostCalls(newQuery, CrawlInformation.SearchMostActiveRepos);
  }

  /**
   * Send query request to get intial user data --> use initial user data to build 2nd query --> send 2nd query request to get complete user data.
   */
  async getMostActiveUsers() {

    // Send first query request.
    this.activeUsers = await this.doPostCalls(this.queryOrganizationMembersInformation, CrawlInformation.SearchMostActiveUserInformation);
    var commitPromises: Array<Promise<ActiveUser>> = new Array<Promise<ActiveUser>>();

    // Create new query for each user, send requests, stash retrieved promises.
    for (let activeUser of this.activeUsers) {

      // Create query for each user.
      let newQuery = this.queryMostActiveUsersCommits
        .replace('insertLogin', activeUser.getUserLogin())
        .replace("insertDate", this.getDatePrevious7Days().toISOString())
        .replace("insertID", activeUser.getUserID());

      // Send each user request and stash response promises.
      commitPromises.push(this.doPostCalls(newQuery, CrawlInformation.SearchMostActiveUsersCommits));
    }

    this.activeUsers = [];
    // When a request has returned a response, store data.
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