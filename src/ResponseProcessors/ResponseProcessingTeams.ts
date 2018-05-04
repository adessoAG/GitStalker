import { Team } from "../Objects/Team";

export class ResponseProcessingTeams {

    private organizationTeamsJSON: Array<any>;
    private organizationTeams: Array<Team> = new Array<Team>();

    constructor(organizationTeamsJSON: any) {
        this.organizationTeamsJSON = organizationTeamsJSON.organization.teams.nodes;

    }

    /**
     * Processing the response of the query for the detailed team information of the organization.
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

    /**
     * Calculates the total Count of the commits in all contributed repos by the team
     * @param contributedReposByTeam Array of contributed Repos by the team
     */
    calculateTotalCountOfPreviousCommits(contributedReposByTeam: Array<JSON>): number {
        let totalCountOfPreviousCommits: number = 0;
        for (let contributedRepo of contributedReposByTeam) {
            totalCountOfPreviousCommits += contributedRepo.defaultBranchRef.target.history.totalCount;
        }
        return totalCountOfPreviousCommits;
    }
}