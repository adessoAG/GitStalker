import { postRequest } from "./postRequest";

export enum CrawlUser {
    LOGIN = "login",
    AVATAR_URL = "avatarUrl",
    COMPANY = "company",
    HIREABLE = "isHireable",
    EMAIL = "email",
    CONTRIBUTED_REPOSITORIES = "contributed_Repos",
    CONTRIBUTED_REPOSITORIES_TOTALCOUNT  = "contributed_Repos_Count",
}

export class User extends postRequest {

    readonly baseQuery: string;
    readonly baseResponseKey: string[];

    constructor(userLogin: String) {
        super();
        this.baseQuery = `query {
            user(login: "`+ userLogin + `"){
                insertHere
            }
            }`;
        this.baseResponseKey = ["user"];
    }

    private async doPostCalls(crawlInformation: CrawlUser) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlUser.LOGIN:
                keyValue = CrawlUser.LOGIN.valueOf();
                responseKeyValues = [CrawlUser.LOGIN.valueOf()];
                break;
            case CrawlUser.AVATAR_URL:
                keyValue = CrawlUser.AVATAR_URL.valueOf();
                responseKeyValues = [CrawlUser.AVATAR_URL.valueOf()];
                break;
            case CrawlUser.COMPANY:
                keyValue = CrawlUser.COMPANY.valueOf();
                responseKeyValues = [CrawlUser.COMPANY.valueOf()];
                break;
            case CrawlUser.HIREABLE:
                keyValue = CrawlUser.HIREABLE.valueOf();
                responseKeyValues = [CrawlUser.HIREABLE.valueOf()];
                break;
            case CrawlUser.EMAIL:
                keyValue = CrawlUser.EMAIL.valueOf();
                responseKeyValues = [CrawlUser.EMAIL.valueOf()];
                break;
            case CrawlUser.CONTRIBUTED_REPOSITORIES:
                keyValue = "contributedRepositories(first: 10){nodes{name}}";
                responseKeyValues = ["contributedRepositories", "nodes", "name"];
                break;
            case CrawlUser.CONTRIBUTED_REPOSITORIES_TOTALCOUNT:
                keyValue = "contributedRepositories(first: 10){totalCount}";
                responseKeyValues = ["contributedRepositories", "totalCount"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getUserName() {
        return await this.doPostCalls(CrawlUser.LOGIN);
    }

    async getUserAvatarUrl() {
        return await this.doPostCalls(CrawlUser.AVATAR_URL);
    }

    async getUserCompany() {
        return await this.doPostCalls(CrawlUser.COMPANY);
    }

    async isHireable() {
        return await this.doPostCalls(CrawlUser.HIREABLE);
    }

    async getUserEmail() {
        return await this.doPostCalls(CrawlUser.EMAIL);
    }

    async getUserContributedRepositories() {
        return await this.doPostCalls(CrawlUser.CONTRIBUTED_REPOSITORIES);
    }

    async getUserContributedRepositoriesTotalCount() {
        return await this.doPostCalls(CrawlUser.CONTRIBUTED_REPOSITORIES_TOTALCOUNT);
    }
}