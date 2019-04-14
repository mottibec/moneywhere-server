export interface IReview {
    reviewdUserId: string;
    createdById: string;
    text: string;
    rating: string;
}

export class Review implements IReview {
    reviewdUserId: string;
    createdById: string;
    text: string;
    rating: string;

    constructor(reviewdUserId: string, createdById: string, text: string, rating: string) {
        this.text = text;
        this.rating = rating;
        this.reviewdUserId = reviewdUserId;
        this.createdById = createdById;
    }
}