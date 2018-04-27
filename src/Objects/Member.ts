import { ChartJSData } from "./ChartJSData";

export class Member {

    private name: string;
    private username: string;
    private avatarURL: string;
    private githubURL: string;
    private previousCommits: ChartJSData;
    private previousIssues: ChartJSData;
    private previousPullRequests: ChartJSData;

    constructor(name: string,
        username: string,
        avatarURL: string,
        githubURL: string,
        previousCommits: ChartJSData,
        previousIssues: ChartJSData,
        previousPullRequests: ChartJSData) {

        this.name = name;
        this.username = username;
        this.avatarURL = avatarURL;
        this.githubURL = githubURL;
        this.previousCommits = previousCommits;
        this.previousIssues = previousIssues;
        this.previousPullRequests = previousPullRequests;
    }

    getMemberName(): string {
        return this.name;
    }

    getMemberUsername(): string {
        return this.username;
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