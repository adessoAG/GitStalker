export class Commit {

    private committedAt: Date;
    private changedFiles: number;
    private committerName: string;
    private repositoryName: string;

    constructor(committedAt: Date,
        changedFiles: number,
        committerName: string,
        repositoryName: string ) {

        this.committedAt = committedAt;
        this.changedFiles = changedFiles;
        this.committerName = committerName;
        this.repositoryName = repositoryName;
    }

    getCommitCreationDate(): Date {
        return this.committedAt;
    }

    getAmountOfChangedFiles(): number {
        return this.changedFiles;
    }

    getCommitterName(): string {
        return this.committerName;
    }

    getCommittedToRepositoryName(): string {
        return this.repositoryName;
    }
}