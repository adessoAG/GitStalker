import { Team } from "../Objects/Team";

export class ResponseProcessingTeams {

    private organizationTeamsJSON: Array<JSON>;
    private organizationTeams: Array<Team> = new Array<Team>();

    constructor(organizationTeamsJSON: Array<JSON>) {
        this.organizationTeamsJSON = organizationTeamsJSON.organization.teams.nodes;

    }

    /**
     * Processing the response of the query for the detailed repository information of the organization.
     */
    processResponse(): Array<Team> {
        for (let team of this.organizationTeamsJSON) {
            this.organizationTeams.push(
                new Team(team.name,
                    team.description,
                    team.avatarUrl,
                    team.members.totalCount,
                    team.repositories.totalCount,
                    this.calculateTotalCountOfPreviousCommits(team.repositories.nodes)
                )
            );
        }
        return this.organizationTeams;
    }

    calculateTotalCountOfPreviousCommits(contributedReposByTeam: Array<JSON>): number {
        let totalCountOfPreviousCommits: number = 0;
        for (let contributedRepo of contributedReposByTeam) {
            totalCountOfPreviousCommits += contributedRepo.defaultBranchRef.target.history.totalCount;
        }
        return totalCountOfPreviousCommits;
    }
}