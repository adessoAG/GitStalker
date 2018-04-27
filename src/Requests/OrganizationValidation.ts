export class OrganizationValidation {
    organizationValidation: string;

    /**
     * Used query to verify if the organization is valid. Simply & fast request by trying to crawl the id of the organization.
     * @param organizationName Selected organization to crawl information
     */
    constructor(organizationName: string) {
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
}