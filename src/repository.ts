import { postRequest } from "./postRequest";

export enum CrawlRepository {
    DESCRIPTION
}

export class Repository extends postRequest {

    readonly baseQuery: string;
    readonly baseResponseKey: string[];
    readonly baseVariable: string;

    constructor(owner: string, name: string) {
        super();
        this.baseQuery = `{
            repository(owner: "`+ owner + `", name: "` + name + `") {
              insertHere
            }
          }`;
        this.baseResponseKey = ["repository"];
        this.baseVariable = '';
    }

    private async doPostCalls(crawlInformation: CrawlRepository) {
        let keyValue: string;
        let responseKeyValues: string[];

        switch (crawlInformation) {
            case CrawlRepository.DESCRIPTION:
                keyValue = "description";
                responseKeyValues = ["description"];
                break;
            default:
                return Promise.reject(new Error('No suitable information found for user!'));
        }

        return await super.startPost(this.baseQuery.replace("insertHere", keyValue), this.baseVariable, this.baseResponseKey.concat(responseKeyValues), super.processResponse);
    }

    async getRepositoryDescription() {
        return await this.doPostCalls(CrawlRepository.DESCRIPTION);
    }
}