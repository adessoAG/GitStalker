import { ChartJSData } from "./ChartJSData";

export class Repository {

    private name: string;
    private description: string;
    private programmingLanguage: string;
    private license: string;
    private forks: number;
    private stars: number;
    private previousCommits: ChartJSData;
    private previousIssues: ChartJSData;
    private previousPullRequests: ChartJSData;

    constructor(name: string,
        description: string,
        programmingLanguage: string,
        license: string,
        forks: number,
        stars: number,
        previousCommits: ChartJSData,
        previousIssues: ChartJSData,
        previousPullRequests: ChartJSData) {

        this.name = name;
        this.description = description;
        this.programmingLanguage = programmingLanguage;
        this.license = license;
        this.forks = forks;
        this.stars = stars;
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

    getRepositoryProgrammingLanguage(): string {
        return this.programmingLanguage;
    }

    getRepositoryLicense(): string {
        return this.license;
    }

    getRepositoryNumOfFork(): number {
        return this.forks;
    }

    getRepositoryNumOfStars(): number {
        return this.stars;
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