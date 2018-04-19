import { Organization } from './organization';

/**
 * Entry point for using the GitStalker library.
 */
export class Crawl {

    constructor() { }

    public createOrganization(organizationName:string):Organization{
        return new Organization(organizationName);
    }

}