import { describe, expect, it } from 'vitest';
import { ApiError } from '../../api/errors';
import type { MerchantReviewDto, MerchantReviewPage } from '../../contracts/merchantReview';
import { formatMerchantReviewDate, merchantReviewAlreadyReplied, merchantReviewError, merchantReviewInitial, merchantReviewStars, merchantReviewStatusTone, merchantReviewSummary } from './presentation';
import { merchantReviewReplySchema } from './validation';

const review={id:'REV-1',pg:{id:'PG-1',name:'StayNest House'},reviewer:{displayName:'Asha',avatarUrl:null},rating:4,comment:'Comfortable stay',merchantReply:null,status:'Visible',createdAt:'2026-08-05T10:00:00.000Z',updatedAt:'2026-08-05T10:00:00.000Z'} satisfies MerchantReviewDto;
const summary={averageRating:3,totalReviews:8,ratingBreakdown:{'1':1,'2':1,'3':2,'4':2,'5':2}};
const page={items:[review],meta:{page:1,limit:1,total:8,totalPages:8,summary}} satisfies MerchantReviewPage;
describe('merchant review presentation and validation',()=>{
  it('preserves all canonical review fields including nullable data',()=>{expect(review).toMatchObject({reviewer:{displayName:'Asha',avatarUrl:null},pg:{name:'StayNest House'},rating:4,comment:'Comfortable stay',merchantReply:null,status:'Visible'});expect({...review,status:'Reported'}).toMatchObject({status:'Reported'})});
  it('uses backend page metadata for the merchant-wide summary',()=>{expect(merchantReviewSummary([page])).toEqual(summary);expect(merchantReviewSummary([page])?.totalReviews).not.toBe(page.items.length);expect(merchantReviewSummary(undefined)).toBeUndefined()});
  it('supports every rating breakdown bucket and a null zero-review average',()=>{expect(Object.keys(summary.ratingBreakdown)).toEqual(['1','2','3','4','5']);expect(merchantReviewSummary([{...page,meta:{...page.meta,summary:{averageRating:null,totalReviews:0,ratingBreakdown:{'1':0,'2':0,'3':0,'4':0,'5':0}}}}])?.averageRating).toBeNull()});
  it('formats stars, status, initials and valid dates safely',()=>{expect(merchantReviewStars(4)).toBe('★★★★☆');expect(merchantReviewStatusTone('Visible')).toBe('success');expect(merchantReviewStatusTone('Reported')).toBe('warning');expect(merchantReviewInitial(' asha')).toBe('A');expect(formatMerchantReviewDate(review.createdAt)).not.toBe('Date unavailable');expect(formatMerchantReviewDate('invalid')).toBe('Date unavailable')});
  it('trims valid replies and rejects blank, overlength, and unknown fields',()=>{expect(merchantReviewReplySchema.parse({reply:'  Thank you  '})).toEqual({reply:'Thank you'});expect(merchantReviewReplySchema.safeParse({reply:'   '}).success).toBe(false);expect(merchantReviewReplySchema.safeParse({reply:'x'.repeat(1001)}).success).toBe(false);expect(merchantReviewReplySchema.safeParse({reply:'valid',merchantId:'m'}).success).toBe(false);expect(merchantReviewReplySchema.safeParse({reply:'valid',status:'Reported'}).success).toBe(false)});
  it('recognizes backend duplicate-reply conflicts and API messages',()=>{const conflict=new ApiError('Already replied','REVIEW_ALREADY_REPLIED',409);expect(merchantReviewAlreadyReplied(conflict)).toBe(true);expect(merchantReviewAlreadyReplied(new ApiError('Conflict','OTHER',409))).toBe(false);expect(merchantReviewError(conflict)).toBe('Already replied')});
});
