import React, { useEffect, useState } from 'react';
import { RepoCard } from '../components/RepoCard';
import { useDebounce } from '../hooks/debounce';
import {
  useLazyGetUserReposQuery,
  useSearchUsersQuery,
} from '../store/github/github.api';

export function HomePage() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);
  const [dropdown, setDropdown] = useState(false);

  const { isLoading, isError, isSuccess, data } = useSearchUsersQuery(
    debounced,
    {
      skip: debounced.length < 3, //skip - условие по которому не осущ-ся запрос
      refetchOnFocus: true, //новый запрос при возврате на страницу
    }
  );

  const [
    fetchRepos,
    { isLoading: areReposLoading, data: repos },
  ] = useLazyGetUserReposQuery();

  const clickHandler = (username: string) => {
    fetchRepos(username);
    setDropdown(false);
  };

  useEffect(() => {
    setDropdown(debounced.length > 3 && data?.length! > 0);
  }, [debounced, data]);

  return (
    <div className="flex justify-center pt-10 mx-auto h-screen w-scren">
      {isError && (
        <p className="text-center text-red-600">Something went wrong</p>
      )}
      <div className="relative w-[560px]">
        <input
          type="text"
          className="border px-2 px-4 w-full h-[42px] mb-2"
          placeholder="Search for username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {dropdown && (
          <ul className="list-none absolute top=[42px] left-0 right-0 max-h-[200px] overflow-y-scroll shadow-md bg-white">
            {isLoading && <p className="text-center">Loading...</p>}
            {data?.map((user) => (
              <li
                key={user.id}
                onClick={() => clickHandler(user.login)}
                className="py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                {user.login}
              </li>
            ))}
          </ul>
        )}
        <div className="container">
          {areReposLoading && <p className="my-8 text-center">Loading...</p>}
          {repos?.map((repo: any) => (
            <RepoCard repo={repo} key={repo.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
