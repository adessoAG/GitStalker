export class MemberDataBuffer {
    private hasNextPage: boolean;
    private endCursor: string;
    private memberIDs: Array<string>;

    constructor(hasNextPage: boolean,
        endCursor: string,
        memberIDs: Array<string>) {
        this.hasNextPage = hasNextPage;
        this.endCursor = endCursor;
        this.memberIDs = memberIDs;
    }

    getHasNextPage() {
        return this.hasNextPage;
    }

    getEndCursor() {
        return this.endCursor;
    }

    getMemberIDs() {
        return this.memberIDs;
    }
}