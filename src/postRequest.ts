import axios from 'axios';
import { CrawlInformation } from './CrawlInformation';
import { ActiveRespository } from './activeRepository';
import { StarredRespository } from './starredRepository';
import { ActiveUser } from './activeUser';

/**
 * Communicates with GitHub GraphQL API and processes responses.
 */
export abstract class postRequest {

    /**
     * Set authorization headers for http requests.
     */
    constructor() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + '8e5418de6adba926f72e9dd91cfa5cd0d4042664';
    }

    /**
     * 
     * @param queryContent GraphQL query that is sent to the GitHub API
     * @param callback function that handles the returned response
     * @param crawlInformation 'metadata' passed to callback function for response handling
     */
    async startPost(queryContent: string, callback: any, crawlInformation: CrawlInformation) {
        return axios.post('https://api.github.com/graphql', {
            query: queryContent,
        })
            .then(async function (response) {
                // 'response.data.data' accesses the relevant data in the nested JSON
                return callback(response.data.data, crawlInformation);

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /**
     * 
     * @param response Data that is returned from API request
     * @param crawlInformation 'Metadata' used for response handling
     * Processes responses returned from GitHub API requests. Returns processed data.
     * Walks through nested JSON responses using according keys to access relevant data.
     */
    processResponse(response: any, crawlInformation: CrawlInformation) {
        switch (crawlInformation) {
            case CrawlInformation.SearchIfOrganizationValid:
                return response.organization;
            case CrawlInformation.SearchMostActiveUsersCommits:
                var commitAmount: number = 0;
                // For each user, add up all commits from all repositories that the user has committed to
                for (let commitInfo of response.user.repositoriesContributedTo.nodes) {
                    if (commitInfo.defaultBranchRef != null) {
                        commitAmount = + commitInfo.defaultBranchRef.target.history.totalCount;
                    }
                }

                return new ActiveUser(response.user.name, response.user.login, response.user.id, commitAmount, response.user.repositoriesContributedTo.totalCount);

            case CrawlInformation.SearchMostActiveUserInformation:
                var activeUsers: Array<ActiveUser> = new Array<ActiveUser>();
                for (let userInfo of response.organization.members.nodes) {
                    activeUsers.push(new ActiveUser(userInfo.name, userInfo.login, userInfo.id, 0, userInfo.repositoriesContributedTo));
                }

                return activeUsers;

            case CrawlInformation.SearchMostStarRepos:
                var starredRepositories: Array<StarredRespository> = new Array<StarredRespository>();
                for (let repoInfo of response.search.edges) {
                    starredRepositories.push(new StarredRespository(repoInfo.node.name, repoInfo.node.description, repoInfo.node.stargazers.totalCount));
                }

                return starredRepositories;

            case CrawlInformation.SearchMostActiveRepos:
                var activeRepositories: Array<ActiveRespository> = new Array<ActiveRespository>();
                for (let repoInfo of response.search.edges) {
                    activeRepositories.push(new ActiveRespository(repoInfo.node.name, repoInfo.node.description, repoInfo.node.defaultBranchRef.target.history.totalCount));
                }

                sortActiveRepositories(activeRepositories);

                return activeRepositories;

            default:
                return response;
        }
    }
}

function sortActiveRepositories(activeRespositories: Array<ActiveRespository>) {
    activeRespositories.sort((a, b) => {
        if (a.getCommitAmount() == b.getCommitAmount()) {
            return 0;
        } else {
            if (a.getCommitAmount() > b.getCommitAmount()) {
                return -1;
            }
            else if (a.getCommitAmount() < b.getCommitAmount()) {
                return 1;
            }
        }
    })
}
