import axios from 'axios';
import { Query } from '../Objects/Query';
import { RequestStatus } from './RequestStatus';

/**
 * Communicates with GitHub GraphQL API and processes responses.
 */
export abstract class Request {

    static previousQuerys: Array<Query> = new Array<Query>();

    /**
     * Set authorization headers for http requests.
     */
    constructor() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + '';
    }

    /**
     * Creates the Post-Request for the GraphQL GitHub API.
     * @param queryContent GraphQL query that is sent to the GitHub API
     * @param callback function that handles the returned response
     * @param crawlInformation 'metadata' passed to callback function for response handling
     */
    async startPost(query: Query) {
        this.resetQuery(query);
        return axios.post('https://api.github.com/graphql', {
            query: query.getQueryContent()
        })
            .then(async function (response) {
                // 'response.data.data' accesses the relevant data in the nested JSON.
                //Response is a JSON of Axios, where the data is fitted in the field "data" and GraphQL also fits the data in the field "data"
                query.setQueryStatus(RequestStatus.VALID_ANSWER_RECIEVED);
                query.setQueryResponse(response.data.data);
                Request.previousQuerys.push(query);
                return query;
            })
            .catch(function (error) {
                query.setQueryStatus(RequestStatus.ERROR_RECIEVED);
                query.setQueryError(error);
                Request.previousQuerys.push(query);
                return query;
            });
    }

    resetQuery(queryToReset: Query) {
        queryToReset.setQueryError("");
        queryToReset.setQueryResponse("");
        queryToReset.setQueryStatus(RequestStatus.CREATED);
    }

    async tryPreviousRequestAgain() {
        const lastQuery: Query | undefined = Request.previousQuerys.pop();
        if (lastQuery != undefined) {
            return await this.startPost(lastQuery);
        }
    }
}