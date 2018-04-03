export class ActiveRespository {
   
    private repositoryName:string;
    private repositoryDescription:string;
    private repositoryCommits:number;

    constructor(repositoryName:string, repositoryDescription:string, repositoryCommits:number){
        this.repositoryName = repositoryName;
        this.repositoryDescription = repositoryDescription;
        this.repositoryCommits = repositoryCommits;
    }

    public getCommitAmount(){
        return this.repositoryCommits;
    }
}