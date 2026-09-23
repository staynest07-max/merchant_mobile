import { useState } from 'react';
import { useRouter } from 'expo-router';
import type { MerchantPgInput } from '@/contracts/merchantPg';
import { MerchantScreen } from '@/components/native/MerchantScreen';
import { PgForm, emptyMerchantPgInput } from '@/components/native/pg/PgForm';
import { pgErrorMessage } from '@/components/native/pg/PgUi';
import { useCreateMerchantPg } from '@/features/merchantPgs/hooks/useMerchantPgs';

export default function CreatePg() {
  const router = useRouter();
  const create = useCreateMerchantPg();
  const [error, setError] = useState('');
  const submit = (input: MerchantPgInput) => create.mutate(input, { onSuccess: () => router.back(), onError: (reason) => setError(pgErrorMessage(reason)) });
  return <MerchantScreen title="Add PG" subtitle="Create a new merchant listing" showBack><PgForm initial={emptyMerchantPgInput()} submitLabel="Create PG" submitting={create.isPending} apiError={error} onSubmit={submit} /></MerchantScreen>;
}
