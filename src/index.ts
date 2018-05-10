import { BaseOrganization } from './BaseOrganization';

/**
 * Entry point for using the GitStalker library.
 */
export class Crawl {

    constructor() {
        this.createOrganization("adessoag").crawlMemberPageData().then(res => {
         console.log(res);
        }
        )
    }

    /**
     * Startpoint for the Crawler. After creating the organization information can be crawled!
     * @param organizationName Selected organization to crawl information
     */
    public createOrganization(organizationName:string):BaseOrganization{
        return new BaseOrganization(organizationName);
    }

}

new Crawl();