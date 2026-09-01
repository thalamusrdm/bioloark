import { notFound } from 'next/navigation';
import { getShopPolicies } from '../../../lib/commerce';
import { localPolicies } from '../../../lib/local-policies';

export default async function PolicyPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const localPolicy = localPolicies.find((item) => item.handle === handle);
  const policy = localPolicy || (await getShopPolicies()).find((item) => item.handle === handle);
  if (!policy) notFound();
  return <main className="internal-page policy-page"><p className="eyebrow dark">STORE POLICY</p><h1>{policy.title}</h1><div dangerouslySetInnerHTML={{ __html: policy.body }} /></main>;
}
