import { Organization } from './organization';

/**
 * Entry point for using the GitStalker library.
 */
export class Crawl {

    constructor() {
        new Organization("adessoAG").crawlRepositoryPageData().then(function(value) {
            console.log(value);
          });
    }

    public createOrganization(organizationName:string):Organization{
        return new Organization(organizationName);
    }

}

new Crawl();