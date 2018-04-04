export class StarredRespository {

    private repositoryName: string;
    private repositoryDescription: string;
    private repositoryStars: number;

    constructor(repositoryName: string, repositoryDescription: string, repositoryStars: number) {
        this.repositoryName = repositoryName;
        this.repositoryDescription = repositoryDescription;
        this.repositoryStars = repositoryStars;
    }

    public getStarAmount() {
        return this.repositoryStars;
    }
}