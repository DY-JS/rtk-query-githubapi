import { IUser, ServerResponse, IRepo } from './../../components/models/models';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const githubApi = createApi({
  reducerPath: 'github/api', // тут будут храниться закэшированные данные
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.github.com/',
  }),
  refetchOnFocus: true, //для повторного запроса
  endpoints: (build) => ({
    searchUsers: build.query<IUser[], string>({
      //searchUsers - запрос для поиска юзеров по поиску
      //ServerResponse - тип ответа, string - тип запроса
      //build.query  станд. ф-ция RTKQueries для получения данных(ещё есть build.mutation )
      query: (search: string) => ({
        url: 'search/users',
        params: {
          q: search,
          per_page: 10,
        },
      }),
      transformResponse: (response: ServerResponse<IUser>) => response.items, //взяли из всего ответа только поле items
    }),

    getUserRepos: build.query<IRepo[], string>({
      query: (username: string) => ({
        url: `users/${username}/repos`,
      }),
    }),

    createUser: build.mutation<any, void>({
      //для мутации
      query: () => `someUrl/newUser`,
    }),
  }),
});

export const {
  useSearchUsersQuery,
  useLazyGetUserReposQuery,
  useCreateUserMutation,
} = githubApi; //hook
//useGetUserReposQuery -cразу сработает  useLazyGetUserReposQuery-не сразу, а когда захотим
//useCreateUserMutation - когда мутации
