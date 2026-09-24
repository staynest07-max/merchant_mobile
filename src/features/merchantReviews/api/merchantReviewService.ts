import { apiClient } from '../../../api/client';
import type { MerchantReviewDto, MerchantReviewListParams, MerchantReviewPage, MerchantReviewReplyInput } from '../../../contracts/merchantReview';

const query=(params:MerchantReviewListParams)=>{const search=new URLSearchParams();search.set('page',String(params.page??1));search.set('limit',String(params.limit??20));return search.toString();};
export const merchantReviewService={
  list:async(params:MerchantReviewListParams={}):Promise<MerchantReviewPage>=>{const response=await apiClient.get<MerchantReviewDto[]>(`/merchants/reviews?${query(params)}`);return{items:response.data,meta:response.meta as MerchantReviewPage['meta']};},
  reply:async({id,reply}:MerchantReviewReplyInput)=>(await apiClient.post<MerchantReviewDto,{reply:string}>(`/merchants/reviews/${id}/reply`,{reply})).data,
  report:async(id:string)=>(await apiClient.post<MerchantReviewDto,Record<string,never>>(`/merchants/reviews/${id}/report`,{})).data,
};
