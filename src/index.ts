import { Organization } from './organization';

/**
 * Entry point for using the GitStalker library.
 */
export class Crawl {

    constructor() {}

    /**
     * Startpoint for the Crawler. After creating the organization information can be crawled!
     * @param organizationName Selected organization to crawl information
     */
    public createOrganization(organizationName:string):Organization{
        return new Organization(organizationName);
    }

}