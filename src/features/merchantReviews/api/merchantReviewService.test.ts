import { beforeEach, describe, expect, it, vi } from 'vitest';
const get=vi.hoisted(()=>vi.fn());const post=vi.hoisted(()=>vi.fn());
vi.mock('../../../api/client',()=>({apiClient:{get,post}}));
import { merchantReviewService as service } from './merchantReviewService';

const summary={averageRating:4.5,totalReviews:2,ratingBreakdown:{'1':0,'2':0,'3':0,'4':1,'5':1}};
describe('merchant review service',()=>{
  beforeEach(()=>{vi.clearAllMocks();get.mockResolvedValue({data:[{id:'REV-1'}],meta:{page:1,limit:20,total:1,totalPages:1,summary}});post.mockResolvedValue({data:{id:'REV-1'}})});
  it('lists only with canonical page and limit',async()=>{await expect(service.list()).resolves.toEqual({items:[{id:'REV-1'}],meta:{page:1,limit:20,total:1,totalPages:1,summary}});expect(get).toHaveBeenCalledWith('/merchants/reviews?page=1&limit=20');await service.list({page:2,limit:10});expect(get).toHaveBeenLastCalledWith('/merchants/reviews?page=2&limit=10')});
  it('preserves the backend summary instead of deriving it from page items',async()=>{const result=await service.list();expect(result.items).toHaveLength(1);expect(result.meta.summary).toEqual(summary);expect(result.meta.summary.totalReviews).toBe(2)});
  it('sends a reply-only payload to the canonical endpoint',async()=>{await service.reply({id:'REV-1',reply:'Thanks'});expect(post).toHaveBeenCalledWith('/merchants/reviews/REV-1/reply',{reply:'Thanks'});for(const field of['merchantId','accountId','userId','actorId','status','reason'])expect(post.mock.calls[0][1]).not.toHaveProperty(field)});
  it('reports using an empty body',async()=>{await service.report('REV-1');expect(post).toHaveBeenCalledWith('/merchants/reviews/REV-1/report',{});expect(Object.keys(post.mock.calls[0][1])).toHaveLength(0)});
  it('propagates list and mutation errors',async()=>{const error=new Error('failed');get.mockRejectedValueOnce(error);await expect(service.list()).rejects.toBe(error);post.mockRejectedValueOnce(error);await expect(service.reply({id:'REV-1',reply:'Thanks'})).rejects.toBe(error);post.mockRejectedValueOnce(error);await expect(service.report('REV-1')).rejects.toBe(error)});
});
