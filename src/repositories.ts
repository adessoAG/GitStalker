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
    readonly repositoriesBaseVariable: string;
    readonly baseVariable: string;

    constructor(quantity: number, previousData: previousRequestData) {
        super();
        this.repositoriesBaseQuery = `repositories(first: ` + quantity + `) {
            insertHere
          }`;
        this.repositoriesBaseVariable = '';
        this.repositoriesBaseResponseKey = ["repositories"];
        this.baseQuery = this.generateBaseQuery(previousData.baseQuery);
        this.baseVariable = this.generateBaseVariable(previousData.baseVariable);
        this.baseResponseKey = this.generateBaseResponseKeys(previousData.responseKeys);

    }

    private generateBaseVariable(previousBaseVariable: string): string {
        return previousBaseVariable.concat(this.repositoriesBaseVariable);
    }

    private generateBaseResponseKeys(previousBaseResponseKey: string[]): string[] {
        return previousBaseResponseKey.concat(this.repositoriesBaseResponseKey);
    }

    private generateBaseQuery(previousBaseQuery: string): string {
        return previousBaseQuery.replace("insertHere", this.repositoriesBaseQuery);
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

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
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