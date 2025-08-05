import ItemDetail from './ItemDetail';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemPage({ params }: PageProps) {
  const { id } = await params;
  return <ItemDetail itemId={id} />;
}