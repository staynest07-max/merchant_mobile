import { ApiError } from '../../api/errors';
import type { MerchantReviewPage, MerchantReviewStatus, MerchantReviewSummary } from '../../contracts/merchantReview';

export const merchantReviewError=(error:unknown)=>error instanceof ApiError?error.message:error instanceof Error?error.message:'Unable to load reviews.';
export const merchantReviewAlreadyReplied=(error:unknown)=>error instanceof ApiError&&error.status===409&&error.code==='REVIEW_ALREADY_REPLIED';
export const formatMerchantReviewDate=(value:string)=>{const date=new Date(value);return Number.isNaN(date.getTime())?'Date unavailable':date.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});};
export const merchantReviewStatusTone=(status:MerchantReviewStatus):'success'|'warning'=>status==='Reported'?'warning':'success';
export const merchantReviewStars=(rating:number)=>`${'★'.repeat(Math.max(0,Math.min(5,rating)))}${'☆'.repeat(Math.max(0,5-Math.min(5,rating)))}`;
export const merchantReviewInitial=(name:string)=>name.trim().charAt(0).toUpperCase()||'?';
export const merchantReviewSummary=(pages:MerchantReviewPage[]|undefined):MerchantReviewSummary|undefined=>pages?.[0]?.meta.summary;
