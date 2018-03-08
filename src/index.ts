import { Organization } from './organization';

class Crawl {

    constructor(){
        var organ = new Organization("adessoAG");
        organ.getOrganizationName();
    }
}

new Crawl();