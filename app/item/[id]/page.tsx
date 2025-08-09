import ItemDetail from './ItemDetail';

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }];
}

export default function ItemPage({ params }: { params: { id: string } }) {
  return <ItemDetail itemId={params.id} />;
}
