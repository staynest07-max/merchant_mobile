import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MerchantReviewListParams } from '../../../contracts/merchantReview';
import { merchantReviewService } from '../api/merchantReviewService';

export const merchantReviewKeys={all:['merchant-reviews']as const,lists:()=>['merchant-reviews','list']as const,list:(params:Omit<MerchantReviewListParams,'page'>)=>['merchant-reviews','list',params]as const};
export const useMerchantReviews=(params:Omit<MerchantReviewListParams,'page'>={})=>useInfiniteQuery({queryKey:merchantReviewKeys.list(params),initialPageParam:1,queryFn:({pageParam})=>merchantReviewService.list({...params,page:pageParam}),getNextPageParam:last=>last.meta.page<last.meta.totalPages?last.meta.page+1:undefined});
const useReviewMutation=<T>(mutationFn:(input:T)=>ReturnType<typeof merchantReviewService.reply>)=>{const client=useQueryClient();return useMutation({mutationFn,onSuccess:()=>client.invalidateQueries({queryKey:merchantReviewKeys.lists()})});};
export const useReplyToMerchantReview=()=>useReviewMutation(merchantReviewService.reply);
export const useReportMerchantReview=()=>useReviewMutation(merchantReviewService.report);
