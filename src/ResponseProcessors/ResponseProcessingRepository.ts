import { Repository } from "../Objects/Repository";
import { ChartJSData } from "../Objects/ChartJSData";

export class ResponseProcessingRepository {

    private organizationRepositoriesJSON: Array<JSON>;
    private organizationRepositories: Array<Repository> = new Array<Repository>();

    constructor(organizationRepositoriesJSON: Array<JSON>) {
        this.organizationRepositoriesJSON = organizationRepositoriesJSON.organization.repositories.nodes;

    }

    /**
     * Processing the response of the query for the detailed repository information of the organization.
     */
    processResponse(): Array<Repository> {
        for (let repository of this.organizationRepositoriesJSON) {
            this.organizationRepositories.push(
                new Repository(repository.name,
                    repository.description,
                    this.getRepositoryPrimaryLanguage(repository),
                    this.getRepositoryLicenseInfo(repository),
                    repository.forkCount,
                    repository.stargazers.totalCount,
                    this.generateChartJSDataOfRepositoryCommits(repository),
                    this.generateChartJSDataOfRepositoryIssues(repository),
                    this.generateChartJSDataOfRepositoryPullRequests(repository))
            );
        }
        return this.organizationRepositories;
    }

    /**
     * Getter for the LicenseInfo of the repository
     * @param repository JSON object of the detailed information of one repository 
     */
    private getRepositoryLicenseInfo(repository: JSON): string {
        if (repository.licenseInfo == null) {
            return "undefined";
        } else return repository.licenseInfo.name;
    }

    /**
     * Getter for the PrimaryLanguage of the repository
     * @param repository JSON object of the detailed information of one repository
     */
    private getRepositoryPrimaryLanguage(repository: JSON): string {
        if (repository.primaryLanguage == null) {
            return "undefined";
        } else return repository.primaryLanguage.name;
    }

    /**
     * Generates the ChartJSData for the Commits overview of the organization
     * @param repository JSON object of the detailed information of one repository
     */
    private generateChartJSDataOfRepositoryCommits(repository: JSON): ChartJSData {
        let committedDates: Array<Date> = new Array<Date>();
        for (let commit of repository.defaultBranchRef.target.history.nodes) {
            committedDates.push(new Date(commit.committedDate));
        }
        this.sortArrayByDate(committedDates);
        return this.generateChartJSData(committedDates);
    }

    /**
     * Generates the ChartJSData for the Issues overview of the organization
     * @param repository JSON object of the detailed information of one repository
     */
    private generateChartJSDataOfRepositoryIssues(repository: JSON): ChartJSData {
        let createdIssueDates: Array<Date> = new Array<Date>();
        for (let issue of repository.issues.nodes) {
            let createdIssueAt: Date = new Date(issue.createdAt);
            if (this.getDatePrevious7Days().getTime() <= createdIssueAt.getTime()) {
                createdIssueDates.push(createdIssueAt);
            }
        }
        this.sortArrayByDate(createdIssueDates);
        return this.generateChartJSData(createdIssueDates);
    }

    /**
     * Generates the ChartJSData for the Pull Requests overview of the organization
     * @param repository JSON object of the detailed information of one repository
     */
    private generateChartJSDataOfRepositoryPullRequests(repository: JSON): ChartJSData {
        let createdPullRequestDates: Array<Date> = new Array<Date>();
        for (let pullRequest of repository.pullRequests.nodes) {
            let createdPullRequestAt: Date = new Date(pullRequest.createdAt);
            if (this.getDatePrevious7Days().getTime() <= createdPullRequestAt.getTime()) {
                createdPullRequestDates.push(createdPullRequestAt);
            }
        }
        this.sortArrayByDate(createdPullRequestDates);
        return this.generateChartJSData(createdPullRequestDates);
    }

    /**
     * Sorts an array by the date
     * @param arrayToSort The array which should be sorted
     */
    private sortArrayByDate(arrayToSort: Array<Date>) {
        arrayToSort.sort((a: Date, b: Date) => {
            return +a.getTime() - +b.getTime();
        });
    }

    /**
     * Generates the ChartJSData out of a array of dates.
     * @param arrayofDates The dataset of dates to create ChartJSData
     */
    private generateChartJSData(arrayofDates: Array<Date>) {
        let chartJSLabels: Array<string> = new Array<string>();
        let chartJSDataset: Array<number> = new Array<number>();

        for (let date of arrayofDates) {
            let formattedDate: string = this.getFormattedDate(date);
            if (chartJSLabels.indexOf(formattedDate) == -1) {
                chartJSLabels.push(formattedDate);
                chartJSDataset.push(1);
            } else {
                chartJSDataset[chartJSLabels.indexOf(formattedDate)] = ++chartJSDataset[chartJSLabels.indexOf(formattedDate)];
            }
        }

        return new ChartJSData(chartJSLabels, chartJSDataset);
    }

    /**
     * Returns a date one week ago
     */
    private getDatePrevious7Days(): Date {
        var date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }

    /**
     * Formats the date to the layout "27/04/2018".
     * @param date Date to format
     */
    private getFormattedDate(date: Date): string {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }
}