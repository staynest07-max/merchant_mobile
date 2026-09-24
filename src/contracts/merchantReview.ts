export type MerchantReviewStatus = 'Visible' | 'Reported';

export interface MerchantReviewDto {
  id: string;
  pg: { id: string; name: string };
  reviewer: { displayName: string; avatarUrl: string | null };
  rating: number;
  comment: string;
  merchantReply: string | null;
  status: MerchantReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MerchantReviewSummary {
  averageRating: number | null;
  totalReviews: number;
  ratingBreakdown: Record<'1' | '2' | '3' | '4' | '5', number>;
}

export interface MerchantReviewListParams { page?: number; limit?: number }
export interface MerchantReviewPage { items: MerchantReviewDto[]; meta: { page: number; limit: number; total: number; totalPages: number; summary: MerchantReviewSummary } }
export interface MerchantReviewReplyInput { id: string; reply: string }
