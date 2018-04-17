export class OrganizationValidation {
    organizationValidation: string;

    constructor(organizationName: string) {
        this.organizationValidation = `{
            organization(login: "`+ organizationName + `") {
              id
            }
          }`;
    }

    getQuery() {
        return this.organizationValidation;
    }
}