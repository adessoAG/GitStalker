import { postRequest } from './postRequest';
import { CrawlInformation } from './CrawlInformation';
import { OrganizationValidation } from './Requests/OrganizationValidation';
import { MainPageData } from './Requests/MainPageData';
import { MemberData } from './Requests/MemberData';

/**
 * Defines request queries and sends requests to GitHub GraphQL API via parent class 'postRequest';
 */
export class Organization extends postRequest {

  readonly queryCheckIfOrganizationValid: string;
  readonly queryMainPageData: string;
  readonly queryMemberData: string;


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

  async crawlMainPageData() {
    return this.doPostCalls(this.queryMainPageData, CrawlInformation.MainPageData);
  }

  async crawlMemberPageData() {
    return this.doPostCalls(this.queryMemberData, CrawlInformation.MemberPageData);
  }

  getDatePrevious7Days(): Date {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }

}