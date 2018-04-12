import { Organization } from './organization';
import { INSPECT_MAX_BYTES } from 'buffer';

export class Crawl {

    constructor() {
        // let organization: Organization = new Organization("adessoAG");
        // // organization.getTop10StarRepos(1).then(result =>{
        // //      console.log(result);
        // // });

        // // organization.getTop10ActiveRepos().then(result =>{
        // //     console.log(result);
        // // });
        // organization.getTop10ActiveUsers().then(result => {
        //     console.log(result);
        // });;
    }

    public createOrganization(organizationName:string):Organization{
        return new Organization(organizationName);
    }

}

new Crawl();