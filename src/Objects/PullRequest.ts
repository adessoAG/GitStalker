export class PullRequest {

    private createdAt: Date;
    private repositoryID: string;
    private repositoryOwnerID: string;

    constructor(createdAt: Date,
        repositoryID: string,
        repositoryOwnerID: string, ) {

        this.createdAt = createdAt;
        this.repositoryID = repositoryID;
        this.repositoryOwnerID = repositoryOwnerID;
    }

    getPullRequestCreationDate(): Date {
        return this.createdAt;
    }

    getPullRequestRepositoryID(): string {
        return this.repositoryID;
    }

    getPullRequestRepositoryOwnerID(): string {
        return this.repositoryOwnerID;
    }
}