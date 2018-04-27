import { ChartJSData } from "./ChartJSData";

export class Repository {

    private name: string;
    private description: string;
    private primaryLanguage: string;
    private licenseInfo: string;
    private forkCount: number;
    private starCount: number;
    private previousCommits: ChartJSData;
    private previousIssues: ChartJSData;
    private previousPullRequests: ChartJSData;

    constructor(name: string,
        description: string,
        primaryLanguage: string,
        licenseInfo: string,
        forkCount: number,
        starCount: number,
        previousCommits: ChartJSData,
        previousIssues: ChartJSData,
        previousPullRequests: ChartJSData) {

        this.name = name;
        this.description = description;
        this.primaryLanguage = primaryLanguage;
        this.licenseInfo = licenseInfo;
        this.forkCount = forkCount;
        this.starCount = starCount;
        this.previousCommits = previousCommits;
        this.previousIssues = previousIssues;
        this.previousPullRequests = previousPullRequests;
    }

    getRepositoryName(): string {
        return this.name;
    }

    getRepositoryDescription(): string {
        return this.description;
    }

    getRepositoryPrimaryLanguage(): string {
        return this.primaryLanguage;
    }

    getRepositoryLicenseInfo(): string {
        return this.licenseInfo;
    }

    getRepositoryForkCount(): number {
        return this.forkCount;
    }

    getRepositoryStarCount(): number {
        return this.starCount;
    }

    getRepositoryPreviousCommits(): ChartJSData {
        return this.previousCommits;
    }

    getRepositoryPreviousIssues(): ChartJSData {
        return this.previousIssues
    }

    getRepositoryPreviousPullRequests(): ChartJSData {
        return this.previousPullRequests;
    }
}