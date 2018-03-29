import { postRequest } from "./postRequest";
import { Repository } from "./repository";
import { previousRequestData } from "./interfaceRequestData";

export enum CrawlRepositories {
    TOTALCOUNT,
    REPOSITORIES
}

export class Repositories extends postRequest {

    readonly baseQuery: string;
    readonly repositoriesBaseQuery: string;
    readonly repositoriesBaseResponseKey: string[] = ["repositories"];
    readonly baseResponseKey: string[];

    constructor(quantity: number, previousData: previousRequestData) {
        super();
        this.repositoriesBaseQuery = `repositories(first: ` + quantity + `) {
            insertHere
          }`;
        this.repositoriesBaseResponseKey = ["repositories"];
        this.baseQuery = super.generateBaseQuery(previousData.baseQuery,this.repositoriesBaseQuery);
        this.baseResponseKey = super.generateBaseResponseKeys(previousData.responseKeys,this.repositoriesBaseResponseKey);

    }

    private async doPostCalls(crawlInformation: CrawlRepositories) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlRepositories.TOTALCOUNT:
                keyValue = "totalCount";
                responseKeyValues = ["totalCount"];
                break;
            case CrawlRepositories.REPOSITORIES:
                keyValue = "nodes{nameWithOwner}";
                responseKeyValues = ["nodes", "nameWithOwner"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getRepositoriesTotalCount() {
        return await this.doPostCalls(CrawlRepositories.TOTALCOUNT);
    }

    async getRepositories(): Promise<Repository[]> {
        let repositoriesNameWithOwner: string[] = await this.doPostCalls(CrawlRepositories.REPOSITORIES);
        let repositories: Repository[] = [];

        repositoriesNameWithOwner.forEach(repoNameAndOwner => {
            let splittedOwnerAndName: string[];
            splittedOwnerAndName = repoNameAndOwner.split("/", 2);
            repositories.push(new Repository(splittedOwnerAndName[0], splittedOwnerAndName[1]));
        });
        return repositories;
    }
}