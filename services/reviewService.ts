import { ReviewRepository } from "../database/ReviewRepository";
import { Review } from "../models/review";
import { UserService } from "./userService";

export class ReviewService {
    private _reviewRepository!: ReviewRepository;
    private _userService!: UserService;

    getUserReviews(userId: string): Promise<Review> {
        return this._reviewRepository.findOne(userId);
    }
    saveReview(review: Review): void {
        this._reviewRepository.create(review);
    }
    async calculateUserRating(review: Review): Promise<void> {
        const user = await this._userService.getUser(review.reviewdUserId);
        if (user) {
            var rating = +review.rating * user.rating;
        }
    }

}