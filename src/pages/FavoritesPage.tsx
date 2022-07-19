import { useAppSelector } from '../hooks/redux';

export function FavoritesPage() {
  const { favorites } = useAppSelector((state) => state.github);
  console.log(favorites);

  if (!favorites.length) {
    return <p className="text-center pt-4">No Items</p>;
  }

  return (
    <div className="flex justify-center pt-10 mx-auto h-screen w-scren">
      <ul className="list-none ">
        {favorites.map((f) => (
          <li key={f}>
            <a href={f} target="_blank">
              {f}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
