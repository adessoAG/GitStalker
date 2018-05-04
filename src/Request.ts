import axios from 'axios';
import { CrawlInformation } from './CrawlInformation';
import { ResponseProcessingMember } from './ResponseProcessors/ResponseProcessingMember';
import { ResponseProcessingRepository } from './ResponseProcessors/ResponseProcessingRepository';
import { ResponseProcessingMainPage } from './ResponseProcessors/ResponseProcessingMainPage';
import { ResponseProcessingTeams } from './ResponseProcessors/ResponseProcessingTeams';

/**
 * Communicates with GitHub GraphQL API and processes responses.
 */
export abstract class request {

    /**
     * Set authorization headers for http requests.
     */
    constructor() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + 'dba9bad08c933b8fdcba882cb062d025bf9a6b3a';
    }

    /**
     * Creates the Post-Request for the GraphQL GitHub API.
     * @param queryContent GraphQL query that is sent to the GitHub API
     * @param callback function that handles the returned response
     * @param crawlInformation 'metadata' passed to callback function for response handling
     */
    async startPost(queryContent: string, callback: any, crawlInformation: CrawlInformation) {
        return axios.post('https://api.github.com/graphql', {
            query: queryContent,
        })
            .then(async function (response) {
                // 'response.data.data' accesses the relevant data in the nested JSON.
                //Response is a JSON of Axios, where the data is fitted in the field "data" and GraphQL also fits the data in the field "data"
                return callback(response.data.data, crawlInformation);

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /**
     * 
     * @param response Data that is returned from API request
     * @param crawlInformation 'Metadata' used for response processing handling
     * Processes responses returned from GitHub API requests. Returns processed data.
     * Chooses suitable processor to work through the nested JSON.
     */
    processResponse(response: any, crawlInformation: CrawlInformation) {
        switch (crawlInformation) {
            case CrawlInformation.SearchIfOrganizationValid:
                return response.organization;
            case CrawlInformation.MainPageData:
                return new ResponseProcessingMainPage(response).processResponse();
            case CrawlInformation.MemberPageData:
                return new ResponseProcessingMember(response).processResponse();
            case CrawlInformation.RepositoryPageData:
                return new ResponseProcessingRepository(response).processResponse();
            case CrawlInformation.TeamPageData:
                return new ResponseProcessingTeams(response).processResponse();
            default:
                return response;
        }
    }
}