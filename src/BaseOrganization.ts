import { OrganizationValidation } from './Requests/OrganizationValidation';
import { MainPageData } from './Requests/MainPageData';
import { RepositoryData } from './Requests/RepositoryData';
import { Member } from './Objects/Member';
import { Repository } from './Objects/Repository';
import { MemberData } from './Requests/MemberData';
import { TeamData } from './Requests/TeamData';
import { Team } from './Objects/Team';
import { Organization } from "./Objects/Organization";
import { MemberID } from './Requests/MemberID';

/**
 * Defines request queries and sends requests to GitHub GraphQL API via parent class 'Request';
 */
export class BaseOrganization {

  readonly organizationName: string;


  /**
   * 
   * @param organizationName 
   * Initialize the search querys that are used to retrieve data from the GitHub GraphQL API
   */
  constructor(organizationName: string) {
    this.organizationName = organizationName;
  }

  // /**
  //  * 
  //  * @param query String that is sent to the GitHub API endpoint
  //  * @param crawlInformation Enum that is used to specify response handling the the 'Request' class
  //  * Uses parent class 'Request' to send requests with above mentioned parameters.
  //  */
  // private async doPostCalls(query: string, crawlInformation: CrawlInformation) {
  //   return await super.startPost(query, super.processResponse, crawlInformation);
  // }

  /**
   * Checks if an organization exists by asking for its ID via a query. No response = return false = organization doesn't exist.
   */
  async checkIfOrganizationValid(): Promise<boolean> {
    return new OrganizationValidation(this.organizationName).crawlData();
  }

  async crawlMemberPageData() {
   return new MemberData(await new MemberID(this.organizationName).crawlData(),this.getDatePrevious7Days()).crawlData();
  }
  /**
   * Crawls the necessary data for the dashboard of the selected organization
   */
  async crawlMainPageData(): Promise<Organization> {
    return new MainPageData(this.organizationName,this.getDatePrevious7Days()).crawlData();
  }

  // /**
  //  * Crawls the necessary data for the detailed overview of the members in the organization
  //  */
  // async crawlMemberPageData() {
  //   return new MemberData(this.organizationName,this.getDatePrevious7Days()).crawlData();
  // }

  /**
   * Crawls the necessary data for the detailed overview of the repositories by the organization
   */
  async crawlRepositoryPageData(): Promise<Array<Repository>> {
    return new RepositoryData(this.organizationName,this.getDatePrevious7Days()).crawlData();
  }

  /**
   * Crawls the necessary data for the overview of the teams in the organization
   */
  async crawlTeamPageData(): Promise<Array<Team>> {
    return new TeamData(this.organizationName,this.getDatePrevious7Days()).crawlData();
  }

  /**
   * Returns the date one week ago. Also uses the current time!
   */
  private getDatePrevious7Days(): Date {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }

}