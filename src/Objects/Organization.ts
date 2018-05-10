import { ChartJSData } from "./ChartJSData";

export class Organization {

    private name: string;
    private id: string;
    private location: string;
    private websiteURL: string;
    private githubURL: string;
    private description: string;
    private numOfMembers: number;
    private numOfTeams: number;
    private numOfInternalRepos: number;
    private numOfExternalRepos: number;
    private externalRepositoriesChartJSData: ChartJSData;
    private internalRepositoriesChartJSData: ChartJSData;

    constructor(name: string,
        id: string,
        location: string,
        websiteURL: string,
        githubURL: string,
        description: string,
        numOfMembers: number,
        numOfTeams: number,
        numOfInternalRepos: number,
        numOfExternalRepos: number,
        externalRepositoriesChartJSData: ChartJSData,
        internalRepositoriesChartJSData: ChartJSData) {

        this.name = name;
        this.id = id;
        this.location = location;
        this.websiteURL = websiteURL;
        this.githubURL = githubURL;
        this.description = description;
        this.numOfMembers = numOfMembers;
        this.numOfTeams = numOfTeams;
        this.numOfInternalRepos = numOfInternalRepos;
        this.numOfExternalRepos = numOfExternalRepos;
        this.externalRepositoriesChartJSData = externalRepositoriesChartJSData;
        this.internalRepositoriesChartJSData = internalRepositoriesChartJSData;
    }

    getOrganizationName(): string {
        return this.name;
    }

    getOrganizationID(): string {
        return this.id;
    }

    getOrganizationLocation(): string {
        return this.location;
    }

    getOrganizationWebsiteURL(): string {
        return this.websiteURL;
    }

    getOrganizationGitHubURL(): string {
        return this.githubURL;
    }

    getOrganizationDescription(): string {
        return this.description;
    }

    getOrganizationNumOfMembers(): number {
        return this.numOfMembers;
    }

    getOrganizationNumOfTeams(): number {
        return this.numOfTeams;
    }

    getOrganizationNumOfInternalRepositories(): number {
        return this.numOfInternalRepos;
    }

    getOrganizationExternalRepoChartJSData(): ChartJSData {
        return this.externalRepositoriesChartJSData;
    }

    getOrganizationNumOfExternalRepositories(): number {
        return this.numOfExternalRepos;
    }

    getOrganizationInternalRepoChartJSData(): ChartJSData {
        return this.internalRepositoriesChartJSData;
    }


}