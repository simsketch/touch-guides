import { redirect } from 'next/navigation';

export default async function GuidebookPage(request: any) {
  const params = await request.params;
  const id = params?.id;
  if (!id) {
    throw new Error('No ID found in URL');
  }
  redirect(`/guidebooks/${id}/view`);
}
