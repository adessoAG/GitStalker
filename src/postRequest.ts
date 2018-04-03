import axios from 'axios';
import config from './config'
import { CrawlOrganization } from './organization';
import { ActiveRespository } from './activeRepository';

export abstract class postRequest {

    constructor() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.AUTH_TOKEN;
    }

    async startPost(queryContent: string, callback: any, crawlInformation: CrawlOrganization): Promise<string[]> {
        return axios.post(config.URL_PATH, {
            query: queryContent,
        })
            .then(async function (response) {
                return await callback(response.data.data, crawlInformation);

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    async processResponse(response: any, crawlInformation: CrawlOrganization): Promise<string[]> {
        // responseKeys.every(function(keys) {
        //     response = response[keys];
        //     return !isArray(response);
        // });

        // let responseData:string[] = [];
        // if(isArray(response)){
        //     response.forEach(element => {
        //         responseData = responseData.concat(element[responseKeys[responseKeys.length-1]]);
        //     })
        // } else responseData.push(response);

        // return responseData;

        switch (crawlInformation) {
            case CrawlOrganization.SearchMostTop10StarRepos:

                break;
            case CrawlOrganization.SearchMostTop10ActiveRepos:
            var activeRepositories:Array<ActiveRespository> = new Array<ActiveRespository>();
                response.search.edges.forEach(element => {
                    activeRepositories.push(new ActiveRespository(element.node.name,element.node.description,element.node.defaultBranchRef.target.history.totalCount));
                });
                sortActiveRepositories(activeRepositories);
                console.log(activeRepositories);
            break;
        }
        return response;
    }
}

function sortActiveRepositories(activeRespositories:Array<ActiveRespository>){
    activeRespositories.sort((a,b) => {
        if(a.getCommitAmount() == b.getCommitAmount()){
            return 0;
        } else {
            if(a.getCommitAmount() > b.getCommitAmount() ) {
                return -1;
            }
            else if (a.getCommitAmount() < b.getCommitAmount()) {
                return 1;
            }
        }
    })
}
// function isArray(jsonData:JSON):boolean {
//     return Object.prototype.toString.call(jsonData) === '[object Array]';
// }
