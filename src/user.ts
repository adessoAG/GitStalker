import { postRequest } from "./postRequest";

export enum CrawlUser {
    LOGIN,
    AVATAR_URL,
    COMPANY,
    HIREABLE,
    EMAIL,
    CONTRIBUTED_REPOSITORIES,
    CONTRIBUTED_REPOSITORIES_TOTALCOUNT,
}

export class User extends postRequest {

    readonly baseQuery: string;
    readonly baseResponseKey: string[];
    readonly baseVariable: string;

    constructor(userLogin: String) {
        super();
        this.baseQuery = `query ($userLogin: String!){
            user(login: $userLogin){
                insertHere
            }
            }`;
        this.baseResponseKey = ["user"];
        this.baseVariable = '{"userLogin":"' + userLogin + '"}'
    }

    private async doPostCalls(crawlInformation: CrawlUser) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlUser.LOGIN:
                keyValue = "login";
                responseKeyValues = ["login"];
                break;
            case CrawlUser.AVATAR_URL:
                keyValue = "avatarUrl";
                responseKeyValues = ["avatarUrl"];
                break;
            case CrawlUser.COMPANY:
                keyValue = "company";
                responseKeyValues = ["company"];
                break;
            case CrawlUser.HIREABLE:
                keyValue = "isHireable";
                responseKeyValues = ["isHireable"];
                break;
            case CrawlUser.EMAIL:
                keyValue = "email";
                responseKeyValues = ["email"];
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

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
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