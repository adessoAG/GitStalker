import { request } from './Request';
import { CrawlInformation } from './CrawlInformation';
import { OrganizationValidation } from './Requests/OrganizationValidation';
import { MainPageData } from './Requests/MainPageData';
import { RepositoryData } from './Requests/RepositoryData';
import { Member } from './Objects/Member';
import { Repository } from './Objects/Repository';
import { MemberData } from './Requests/MemberData';
import { TeamData } from './Requests/TeamData';
import { Team } from './Objects/Team';

/**
 * Defines request queries and sends requests to GitHub GraphQL API via parent class 'Request';
 */
export class Organization extends request {

  readonly queryCheckIfOrganizationValid: string;
  readonly queryMainPageData: string;
  readonly queryMemberData: string;
  readonly queryRepositoryData: string;
  readonly queryTeamData: string;


  /**
   * 
   * @param organizationName 
   * Initialize the search querys that are used to retrieve data from the GitHub GraphQL API
   */
  constructor(organizationName: string) {
    super();
    this.queryCheckIfOrganizationValid = new OrganizationValidation(organizationName).getQuery();
    this.queryMainPageData = new MainPageData(organizationName, this.getDatePrevious7Days()).getQuery();
    this.queryMemberData = new MemberData(organizationName, this.getDatePrevious7Days()).getQuery();
    this.queryRepositoryData = new RepositoryData(organizationName, this.getDatePrevious7Days()).getQuery();
    this.queryTeamData = new TeamData(organizationName, this.getDatePrevious7Days()).getQuery();
  }

  /**
   * 
   * @param query String that is sent to the GitHub API endpoint
   * @param crawlInformation Enum that is used to specify response handling the the 'Request' class
   * Uses parent class 'Request' to send requests with above mentioned parameters.
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
   * Crawls the necessary data for the dashboard of the selected organization
   */
  async crawlMainPageData(): Promise<Organization> {
    return this.doPostCalls(this.queryMainPageData, CrawlInformation.MainPageData);
  }

  /**
   * Crawls the necessary data for the detailed overview of the members in the organization
   */
  async crawlMemberPageData(): Promise<Array<Member>> {
    return this.doPostCalls(this.queryMemberData, CrawlInformation.MemberPageData);
  }

  /**
   * Crawls the necessary data for the detailed overview of the repositories by the organization
   */
  async crawlRepositoryPageData(): Promise<Array<Repository>> {
    return this.doPostCalls(this.queryRepositoryData, CrawlInformation.RepositoryPageData);
  }

  /**
   * Crawls the necessary data for the overview of the teams in the organization
   */
  async crawlTeamPageData(): Promise<Array<Team>> {
    return this.doPostCalls(this.queryTeamData, CrawlInformation.TeamPageData);
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