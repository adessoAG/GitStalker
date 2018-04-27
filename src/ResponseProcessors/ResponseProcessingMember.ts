import { Member } from "../Objects/Member";
import { ChartJSData } from "../Objects/ChartJSData";

export class ResponseProcessingMember {

    private organizationMembers: Array<Member> = new Array<Member>();
    private organizationMembersJSON: Array<JSON>;

    constructor(organizationMembersJSON: Array<JSON>) {
        this.organizationMembersJSON = organizationMembersJSON.organization.members.nodes;
    }

    processResponse(): Array<Member> {
        for (let member of this.organizationMembersJSON) {
            this.organizationMembers.push(
                new Member(member.name,
                    member.login,
                    member.avatarUrl,
                    member.url,
                    this.generateChartJSDataOfMemberCommits(member),
                    this.generateChartJSDataOfMemberIssues(member),
                    this.generateChartJSDataOfMemberPullRequests(member))
            );
        }
        return this.organizationMembers;
    }

    private generateChartJSDataOfMemberCommits(member: JSON): ChartJSData {
        let committedDates: Array<Date> = new Array<Date>();
        for (let contributedRepos of member.repositoriesContributedTo.nodes) {
            for (let commit of contributedRepos.defaultBranchRef.target.history.nodes) {
                committedDates.push(new Date(commit.committedDate));
            }
        }
        this.sortArrayByDate(committedDates);
        return this.generateChartJSData(committedDates);
    }

    private generateChartJSDataOfMemberIssues(member: JSON): ChartJSData {
        let createdIssueDates: Array<Date> = new Array<Date>();
        for (let issue of member.issues.nodes) {
            let createdIssueAt: Date = new Date(issue.createdAt);
            if (this.getDatePrevious7Days().getTime() <= createdIssueAt.getTime()) {
                createdIssueDates.push(createdIssueAt);
            }
        }
        this.sortArrayByDate(createdIssueDates);
        return this.generateChartJSData(createdIssueDates);
    }

    private generateChartJSDataOfMemberPullRequests(member: JSON): ChartJSData {
        let createdPullRequestDates: Array<Date> = new Array<Date>();
        for (let pullRequest of member.pullRequests.nodes) {
            let createdPullRequestAt: Date = new Date(pullRequest.createdAt);
            if (this.getDatePrevious7Days().getTime() <= createdPullRequestAt.getTime()) {
                createdPullRequestDates.push(createdPullRequestAt);
            }
        }
        this.sortArrayByDate(createdPullRequestDates);
        return this.generateChartJSData(createdPullRequestDates);
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

    private getDatePrevious7Days(): Date {
        var date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }

    private getFormattedDate(date: Date): string {
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    }

}