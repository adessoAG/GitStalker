import { postRequest } from './postRequest';
import { Organization } from './organization';

class Crawl {

    constructor(){
        var organ = new Organization("adessoAG");
        organ.getOrganizationMembers();
    }
}

new Crawl();