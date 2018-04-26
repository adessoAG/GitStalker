import { ChartJSData } from "./ChartJSData";

export class Member {

    private name: string;
    private login: string;
    private avatarURL: string;
    private githubURL: string;
    private previousCommits: ChartJSData;
    private previousIssues: ChartJSData;
    private previousPullRequests: ChartJSData;

    constructor(name: string,
        login: string,
        avatarURL: string,
        githubURL: string,
        previousCommits: ChartJSData,
        previousIssues: ChartJSData,
        previousPullRequests: ChartJSData) {

        this.name = name;
        this.login = login;
        this.avatarURL = avatarURL;
        this.githubURL = githubURL;
        this.previousCommits = previousCommits;
        this.previousIssues = previousIssues;
        this.previousPullRequests = previousPullRequests;
    }

    getMemberName(): string {
        return this.name;
    }

    getMemberLogin(): string {
        return this.login;
    }

    getMemberAvatarURL(): string {
        return this.avatarURL;
    }

    getMemberGitHubURL(): string {
        return this.githubURL;
    }

    getMemberPreviousCommits(): ChartJSData {
        return this.previousCommits;
    }

    getMemberPreviousIssues(): ChartJSData {
        return this.previousIssues;
    }

    getMemberPreviousPullRequests(): ChartJSData {
        return this.previousPullRequests;
    }
}