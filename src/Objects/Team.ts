export class Team {

    private name: string;
    private description: string;
    private avatarURL: string;
    private numOfMembers: number;
    private numOfRepositories: number;
    private numOfPreviousCommits: number;

    constructor(name: string,
        description: string,
        avatarURL: string,
        numOfMembers: number,
        numOfRepositories: number,
        numOfPreviousCommits: number) {

        this.name = name;
        this.description = description;
        this.avatarURL = avatarURL;
        this.numOfMembers = numOfMembers;
        this.numOfRepositories = numOfRepositories;
        this.numOfPreviousCommits = numOfPreviousCommits;
    }

}