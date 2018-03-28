import { Organization } from './organization';
import { User } from './user';
import { INSPECT_MAX_BYTES } from 'buffer';

class Crawl {

    constructor() {
        let test: Organization = new Organization("adessoAG");
        let user: User = new User("FrederikSchlemmer");

        this.getMembersRepositories().then(function(results){
                 console.log(results)
             })
        // test.getOrganizationRepositories(INSPECT_MAX_BYTES).getRepositories().then(function(results){
        //         results[0].getRepositoryIssues(1).getIssues().then(function(result){
        //             result[0].getIssueTitle().then(function(result1){
        //                 console.log(result1);
        //             });
        //         });
        // });
        // test.getOrganizationLocation().then(function(results){
        //     console.log(results)
        // })
        // test.getOrganizationMembers(INSPECT_MAX_BYTES).getMembers().then(function(results){
        //     results.forEach(user => {
        //         user.getUserName().then(function(results){
        //             if(results.toString() == "AlexanderBrockmann"){
        //                 console.log("Hurra")
        //                 let userTest:User = new User(results.toString());
        //                 userTest.getUserContributedRepositories().then(function(results){
        //                     console.log(results);
        //                 });
        //             }
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

    async getMembersRepositories():Promise<string[]>{
        let userInfo:string[] = [];
        let test: Organization = new Organization("adessoAG");
        let user: User[] = await test.getOrganizationMembers(INSPECT_MAX_BYTES).getMembers();
        for (let userEinzeln of user) {
            console.log(await userEinzeln.getUserName())
            console.log(await userEinzeln.getUserAvatarUrl())
            console.log(await userEinzeln.getUserCompany())
            console.log(await userEinzeln.getUserEmail())
            // userInfo = userInfo.concat(await userEinzeln.getUserContributedRepositories())
            console.log("HI")
          }

          return userInfo;

    }
    async getUserInformation():Promise<string[]>{
        let userInfo:string[] = [];
        let user: User = new User("FrederikSchlemmer");
        userInfo = userInfo.concat(await user.getUserAvatarUrl());
        userInfo = userInfo.concat(await user.getUserName());
        userInfo = userInfo.concat(await user.getUserCompany());

        return userInfo;
    }
}

new Crawl();