import { redirect } from 'next/navigation';

export default function GuidebookPage({ params }: { params: { id: string } }) {
  redirect(`/guidebooks/${params.id}/view`);
}
