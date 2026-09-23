import { FeaturePlaceholder } from '@/components/native/MerchantScreen';
import { merchantRoutes } from '@/navigation/merchantRoutes';
export default function MerchantHome() { return <FeaturePlaceholder title="Home" description="Your Merchant dashboard will be migrated here without changing its existing business behavior." actions={[{ label: 'Add PG', href: merchantRoutes.addPg }, { label: 'View notifications', href: merchantRoutes.notifications }]} />; }
