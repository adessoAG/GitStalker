export class ActiveUser {

    private userName: string;
    private userLogin: string;
    private userID: string;
    private userCommits: number;
    private userContributedToRepos: number;

    constructor(userName: string, userLogin: string, userID: string, userCommits: number, userContributedToRepos: number) {
        this.userName = userName;
        this.userLogin = userLogin;
        this.userID = userID;
        this.userCommits = userCommits;
        this.userContributedToRepos = userContributedToRepos;
    }

    public getUserContributedToRepos() {
        return this.userContributedToRepos;
    }

    public getUserName(){
        return this.userName;
    }
    
    public getUserLogin() {
        return this.userLogin;
    }

    public getUserID() {
        return this.userID;
    }

    public getCommitAmount() {
        return this.userCommits;
    }

    public setCommitAmount(commitAmount: number) {
        this.userCommits = commitAmount;
    }
}