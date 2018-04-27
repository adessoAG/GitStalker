import { Organization } from "../Objects/Organization";
import { PullRequest } from "../Objects/PullRequest";
import { ChartJSData } from "../Objects/ChartJSData";
import { Commit } from "../Objects/Commit";

export class ResponseProcessingMainPage {

    private organizationJSON: Array<JSON>;

    constructor(organizationJSON: Array<JSON>) {
        this.organizationJSON = organizationJSON.organization;
    }

    processResponse(): Organization {
        let organizationMembersPullRequests: Array<PullRequest> = this.filterExternalContributedRepos(this.organizationJSON.repositories.nodes, this.organizationJSON.members.nodes);
        return new Organization(this.organizationJSON.name,
            this.organizationJSON.id,
            this.organizationJSON.location,
            this.organizationJSON.websiteUrl,
            this.organizationJSON.url,
            this.organizationJSON.description,
            this.organizationJSON.members.totalCount,
            this.organizationJSON.teams.totalCount,
            this.organizationJSON.repositories.totalCount,
            organizationMembersPullRequests.length,
            this.generateChartJSData(this.filterExternalContributedRepos7Days(organizationMembersPullRequests)),
            this.calculateInternalRepoActivity(this.organizationJSON.repositories.nodes));
    }

    private filterExternalContributedRepos(organizationReposIDsJSON: Array<JSON>, organizationMembersPullRequestsJSON: Array<JSON>): Array<PullRequest> {
        const organizationReposIDs: Array<string> = this.getOrganizationsReposIDs(organizationReposIDsJSON);
        const organizationMembersPullRequests: Array<PullRequest> = new Array<PullRequest>();

        for (let pullRequestArrays of organizationMembersPullRequestsJSON) {
            for (let pullRequestData of pullRequestArrays.pullRequests.nodes) {
                if (organizationReposIDs.indexOf(pullRequestData.repository.id) == -1) {
                    organizationMembersPullRequests.push(new PullRequest(new Date(pullRequestData.createdAt), pullRequestData.repository.id, pullRequestData.repository.owner.id))
                }
            }
        }
        return organizationMembersPullRequests;
    }

    private getOrganizationsReposIDs(organizationReposIDsJSON: Array<JSON>): Array<string> {
        const organizationReposIDs: Array<string> = new Array<string>();

        for (let organizationRepoIDs of organizationReposIDsJSON) {
            organizationReposIDs.push(organizationRepoIDs.id);
        }

        return organizationReposIDs;
    }

    private filterExternalContributedRepos7Days(externalPullRequests: Array<PullRequest>): Array<Date> {
        let externalContributionsWithinRange: Array<Date> = new Array<Date>();

        for (let externalPullRequest of externalPullRequests) {
            if (this.getDatePrevious7Days().getTime() <= externalPullRequest.getPullRequestCreationDate().getTime()) {
                externalContributionsWithinRange.push(externalPullRequest.getPullRequestCreationDate());
            }
        }
        this.sortArrayByDate(externalContributionsWithinRange);
        return externalContributionsWithinRange;
    }

    private sortArrayByDate(arrayToSort: Array<Date>) {
        arrayToSort.sort((a: Date, b: Date) => {
            return +a.getTime() - +b.getTime();
        });
    }

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

    private calculateInternalRepoActivity(internalRepoCommitActivitys: Array<JSON>) {
        const internalRepoActivitys: Array<Commit> = new Array<Commit>();
        const internalRepoActivityDays: Array<string> = new Array<string>();
        const internalRepoActivityAmount: Array<number> = new Array<number>();

        for (let internalRepoCommitActivity of internalRepoCommitActivitys) {
            for (let repoCommit of internalRepoCommitActivity.defaultBranchRef.target.history.nodes) {
                if (repoCommit.committer.user != null) {
                    internalRepoActivitys.push(new Commit(new Date(repoCommit.committedDate), repoCommit.changedFiles, repoCommit.committer.user.name, internalRepoCommitActivity.name));
                } else internalRepoActivitys.push(new Commit(new Date(repoCommit.committedDate), repoCommit.changedFiles, "undefined", internalRepoCommitActivity.name));
            }
        }
        internalRepoActivitys.sort((a: Commit, b: Commit) => {
            return +a.getCommitCreationDate().getTime() - +b.getCommitCreationDate().getTime();
        });

        for (let internalRepoActivity of internalRepoActivitys) {
            let formattedDate: string = this.getFormattedDate(internalRepoActivity.getCommitCreationDate());
            if (internalRepoActivityDays.indexOf(formattedDate) == -1) {
                internalRepoActivityDays.push(formattedDate);
                internalRepoActivityAmount.push(1);
            } else {
                internalRepoActivityAmount[internalRepoActivityDays.indexOf(formattedDate)] = ++internalRepoActivityAmount[internalRepoActivityDays.indexOf(formattedDate)];
            }
        }
        return new ChartJSData(internalRepoActivityDays, internalRepoActivityAmount);
    }

    private getDatePrevious7Days(): Date {
        var date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }

    private getFormattedDate(date: Date): string {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }
}