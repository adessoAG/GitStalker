import axios from 'axios';
import config from './config'
import { CrawlOrganization, Organization } from './organization';
import { ActiveRespository } from './activeRepository';
import { StarredRespository } from './starredRepository';
import { ActiveUser } from './activeUser';

export abstract class postRequest {

    constructor() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + config.AUTH_TOKEN;
    }

    async startPost(queryContent: string, callback: any, crawlInformation: CrawlOrganization) {
        return axios.post(config.URL_PATH, {
            query: queryContent,
        })
            .then(async function (response) {
                return callback(response.data.data, crawlInformation);

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    processResponse(response: any, crawlInformation: CrawlOrganization) {
        switch (crawlInformation) {
            case CrawlOrganization.SearchMostTop10ActiveUsersCommits:
                var commitAmount: number = 0;
                for (let commitInfo of response.user.contributedRepositories.nodes) {
                    if (commitInfo.defaultBranchRef != null) {
                        commitAmount = + commitInfo.defaultBranchRef.target.history.totalCount;
                    }
                }
                var activeUser: ActiveUser | null = functiontofindIndexByKeyValue(Organization.activeUsers, "login", response.user.login);
                if (activeUser != null) {
                    activeUser.setCommitAmount(commitAmount)
                }
                sortActiveUsers(Organization.activeUsers);
                break;

            case CrawlOrganization.SearchMostTop10ActiveUserInformation:
                var activeUsers: Array<ActiveUser> = new Array<ActiveUser>();
                for (let userInfo of response.organization.members.nodes) {
                    activeUsers.push(new ActiveUser(userInfo.name, userInfo.login, userInfo.id, 0));
                }
                return activeUsers;

            case CrawlOrganization.SearchMostTop10StarRepos:
                var starredRepositories: Array<StarredRespository> = new Array<StarredRespository>();
                for (let repoInfo of response.search.edges) {
                    starredRepositories.push(new StarredRespository(repoInfo.node.name, repoInfo.node.description, repoInfo.node.stargazers.totalCount));
                }
                return starredRepositories;

            case CrawlOrganization.SearchMostTop10ActiveRepos:
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

function sortActiveUsers(activeUsers: Array<ActiveUser>) {
    activeUsers.sort((a, b) => {
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

function functiontofindIndexByKeyValue(arraytosearch: Array<ActiveUser>, key: string, valuetosearch: string) {

    for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i].getUserLogin() == valuetosearch) {
            return arraytosearch[i];
        }
    }
    return null;
}
