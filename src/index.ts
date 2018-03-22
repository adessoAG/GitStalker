import { Organization } from './organization';
import { User } from './user';
import { INSPECT_MAX_BYTES } from 'buffer';

class Crawl {

    constructor() {
        let test: Organization = new Organization("adessoAG");
        let user: User = new User("FrederikSchlemmer");

        test.getOrganizationRepositories(INSPECT_MAX_BYTES).getRepositories().then(function(results){
                results[0].getRepositoryIssues(1).getIssues().then(function(result){
                    result[0].getIssueTitle().then(function(result1){
                        console.log(result1);
                    });
                });
        });
        // test.getOrganizationLocation().then(function(results){
        //     console.log(results)
        // })
        // test.getOrganizationMembers(INSPECT_MAX_BYTES).getMembers().then(function(results){
        //     results.forEach(user => {
        //         user.getUserName().then(function(results){
        //             console.log(results)
        //         });
        //     });
        // });
        // test.getOrganizationTeams(INSPECT_MAX_BYTES).getTeams().then(function (results) {
        //     results.forEach(team => {
        //         team.getTeamName().then(function(results){
        //             console.log(results)
        //         });
        //     });
        // });
        // test.getOrganizationMembers(INSPECT_MAX_BYTES).getMembers().then(function(results){
        //     let asd:User = results[0];
        //     asd.getUserContributedRepositories().then(function(results){
        //         console.log(results)
        //     });
        // });
        // test.getOrganizationAvatarURL().then(function(results){
        //     console.log(results)
        // });
        // user.getUserAvatarUrl().then(function(results){
        //     console.log(results)
        // });
        // user.getUserCompany().then(function(results){
        //     console.log(results)
        // });
        // user.getUserEmail().then(function(results){
        //     console.log(results)
        // });
        // user.isHireable().then(function(results){
        //     console.log(results)
        // });

    }
}

new Crawl();