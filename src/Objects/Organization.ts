import { ChartJSData } from "./ChartJSData";

export class Organization {

    private name: string;
    private id: string;
    private location: string;
    private websiteURL: string;
    private githubURL: string;
    private description: string;
    private membersAmount: number;
    private teamsAmount: number;
    private internalRepositoriesAmount: number;
    private externalRepositoriesAmount: number;
    private externalRepositoriesChartJSData: ChartJSData;
    private internalRepositoriesChartJSData: ChartJSData;

    constructor(name: string, 
        id: string, 
        location: string, 
        websiteURL: string, 
        githubURL: string, 
        description: string, 
        membersAmount: number, 
        teamsAmount: number, 
        internalRepositoriesAmount: number,
        externalRepositoriesAmount: number,
        externalRepositoriesChartJSData: ChartJSData,
        internalRepositoriesChartJSData: ChartJSData) {

        this.name = name;
        this.id = id;
        this.location = location;
        this.websiteURL = websiteURL;
        this.githubURL = githubURL;
        this.description = description;
        this.membersAmount = membersAmount;
        this.teamsAmount = teamsAmount;
        this.internalRepositoriesAmount = internalRepositoriesAmount;
        this.externalRepositoriesAmount = externalRepositoriesAmount;
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

    getOrganizationMembersAmount(): number {
        return this.membersAmount;
    }

    getOrganizationTeamsAmount(): number {
        return this.teamsAmount;
    }

    getOrganizationInternalRepositoriesAmount(): number {
        return this.internalRepositoriesAmount;
    }

    getOrganizationExternalRepoChartJSData(): ChartJSData {
        return this.externalRepositoriesChartJSData;
    }

    getOrganizationExternalRepoAmount(): number {
        return this.externalRepositoriesAmount;
    }

    getOrganizationInternalRepoChartJSData(): ChartJSData {
        return this.internalRepositoriesChartJSData;
    }


}