import { Request } from "./Request";
import { Query } from "../Objects/Query";
import { RequestStatus } from "./RequestStatus";

export class OrganizationValidation extends Request{
    readonly organizationValidation: string;

    /**
     * Used query to verify if the organization is valid. Simply & fast request by trying to crawl the id of the organization.
     * @param organizationName Selected organization to crawl information
     */
    constructor(organizationName: string) {
        super();
        this.organizationValidation = `{
            organization(login: "`+ organizationName + `") {
              id
            }
          }`;
    }

    /**
     * Returns a string which represents the query.
     */
    getQuery(): string {
        return this.organizationValidation;
    }

    async crawlData(): Promise<boolean> {
        if ((await this.startPost(new Query(RequestStatus.CREATED, this.organizationValidation))).getQueryResponse()) {
            return true;
          } else return false;
      }
}