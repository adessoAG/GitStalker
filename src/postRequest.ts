import axios from 'axios';
import { CrawlInformation } from './CrawlInformation';
import { ActiveRespository } from './activeRepository';
import { StarredRespository } from './starredRepository';
import { PullRequest } from './Objects/PullRequest';
import { Organization } from './Objects/Organization';
import { ChartJSData } from './Objects/ChartJSData';
import { Commit } from './Objects/Commit';
import { Member } from './Objects/Member';
import { ResponseProcessingMember } from './ResponseProcessors/ResponseProcessingMember';
import { ResponseProcessingRepository } from './ResponseProcessors/ResponseProcessingRepository';

/**
 * Communicates with GitHub GraphQL API and processes responses.
 */
export abstract class postRequest {

    /**
     * Set authorization headers for http requests.
     */
    constructor() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + '01f9b0e972368e9ead58d55b8ce6ed0826d194c5';
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
            case CrawlInformation.MainPageData:
                let baseData: JSON = response.organization;
                let organizationMembersPullRequests: Array<PullRequest> = filterExternalContributedRepos(baseData.repositories.nodes, baseData.members.nodes);
                return new Organization(baseData.name,
                    baseData.id,
                    baseData.location,
                    baseData.websiteUrl,
                    baseData.url,
                    baseData.description,
                    baseData.members.totalCount,
                    baseData.teams.totalCount,
                    baseData.repositories.totalCount,
                    organizationMembersPullRequests.length,
                    calculateExternalRepoActivity(organizationMembersPullRequests),
                    calculateInternalRepoActivity(baseData.repositories.nodes));
            case CrawlInformation.MemberPageData:
                return new ResponseProcessingMember(response).processResponse();
            case CrawlInformation.RepositoryPageData:
                return new ResponseProcessingRepository(response).processResponse();
            default:
                return response;
        }
    }
}

function filterExternalContributedRepos(organizationReposIDsJSON: Array<JSON>, organizationMembersPullRequestsJSON: Array<JSON>): Array<PullRequest> {
    const organizationReposIDs: Array<string> = new Array<string>();
    const organizationMembersPullRequests: Array<PullRequest> = new Array<PullRequest>();

    for (let organizationIDs of organizationReposIDsJSON) {
        organizationReposIDs.push(organizationIDs.id);
    }

    for (let pullRequestArrays of organizationMembersPullRequestsJSON) {
        for (let pullRequestData of pullRequestArrays.pullRequests.nodes) {
            if (organizationReposIDs.indexOf(pullRequestData.repository.id) == -1) {
                organizationMembersPullRequests.push(new PullRequest(new Date(pullRequestData.createdAt), pullRequestData.repository.id, pullRequestData.repository.owner.id))
            }
        }
    }
    return organizationMembersPullRequests;
}

function filterExternalContributedRepos7Days(externalPullRequests: Array<PullRequest>) {
    let pullrequestsCopy: Array<PullRequest> = new Array<PullRequest>();
    externalPullRequests.sort((a: PullRequest, b: PullRequest) => {
        return +a.getPullRequestCreationDate().getTime() - +b.getPullRequestCreationDate().getTime();
    });

    for (let externalPullRequest of externalPullRequests) {
        if (!(getDatePrevious7Days().getTime() > externalPullRequest.getPullRequestCreationDate().getTime())) {
            pullrequestsCopy.push(externalPullRequest);
        }
    }
    return pullrequestsCopy;
}

function calculateExternalRepoActivity(externalPullRequests: Array<PullRequest>): ChartJSData {
    const externalRepoActivityDays: Array<string> = new Array<string>();
    const externalRepoActivityAmount: Array<number> = new Array<number>();

    for (let externalPullRequest of filterExternalContributedRepos7Days(externalPullRequests)) {
        let formattedDate: string = getFormattedDate(externalPullRequest.getPullRequestCreationDate());
        if (externalRepoActivityDays.indexOf(formattedDate) == -1) {
            externalRepoActivityDays.push(formattedDate);
            externalRepoActivityAmount.push(1);
        } else {
            externalRepoActivityAmount[externalRepoActivityDays.indexOf(formattedDate)] = ++externalRepoActivityAmount[externalRepoActivityDays.indexOf(formattedDate)];
        }
    }
    return new ChartJSData(externalRepoActivityDays, externalRepoActivityAmount);
}

function calculateInternalRepoActivity(internalRepoCommitActivitys: Array<JSON>) {
    const internalRepoActivitys: Array<Commit> = new Array<Commit>();
    const internalRepoActivityDays: Array<string> = new Array<string>();
    const internalRepoActivityAmount: Array<number> = new Array<number>();

    for (let internalRepoCommitActivity of internalRepoCommitActivitys) {
        let internalRepoName: string = internalRepoCommitActivity.name;
        for (let repoCommit of internalRepoCommitActivity.defaultBranchRef.target.history.nodes) {
            if (repoCommit.committer.user != null) {
                internalRepoActivitys.push(new Commit(new Date(repoCommit.committedDate), repoCommit.changedFiles, repoCommit.committer.user.name, internalRepoName));
            } else internalRepoActivitys.push(new Commit(new Date(repoCommit.committedDate), repoCommit.changedFiles, "undefined", internalRepoName));
        }
    }
    internalRepoActivitys.sort((a: Commit, b: Commit) => {
        return +a.getCommitCreationDate().getTime() - +b.getCommitCreationDate().getTime();
    });

    for (let internalRepoActivity of internalRepoActivitys) {
        let formattedDate: string = getFormattedDate(internalRepoActivity.getCommitCreationDate());
        if (internalRepoActivityDays.indexOf(formattedDate) == -1) {
            internalRepoActivityDays.push(formattedDate);
            internalRepoActivityAmount.push(1);
        } else {
            internalRepoActivityAmount[internalRepoActivityDays.indexOf(formattedDate)] = ++internalRepoActivityAmount[internalRepoActivityDays.indexOf(formattedDate)];
        }
    }
    return new ChartJSData(internalRepoActivityDays, internalRepoActivityAmount);
}

function getDatePrevious7Days(): Date {
    var date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
}

function getFormattedDate(date: Date): string {
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
}
