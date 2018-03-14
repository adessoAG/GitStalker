import { Organization } from './organization';
import { User } from './user';

class Crawl {

    constructor(){
        let test:Organization = new Organization("adessoAG");
        let user:User = new User("FrederikSchlemmer");
        // test.getOrganizationName().then(function(results){
        //     console.log(results)
        // })
        test.getOrganizationMembers().getMembersNames().then(function(results){
            let asd:User = new User(results[0]);
            asd.getUserContributedRepositories().then(function(results){
                console.log(results)
            });
        });
        test.getOrganizationAvatarURL().then(function(results){
            console.log(results)
        });
        user.getUserAvatarUrl().then(function(results){
            console.log(results)
        });
        user.getUserCompany().then(function(results){
            console.log(results)
        });
        user.getUserEmail().then(function(results){
            console.log(results)
        });
        user.isHireable().then(function(results){
            console.log(results)
        });

    }
}

new Crawl();