import { LoanDetailView } from '@/features/loans/components/LoanDetailView';

export default async function LoanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LoanDetailView id={id} />;
}
