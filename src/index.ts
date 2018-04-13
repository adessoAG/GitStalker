import { Organization } from './organization';

export class Crawl {

    constructor() { }

    public createOrganization(organizationName:string):Organization{
        return new Organization(organizationName);
    }

}

new Crawl();