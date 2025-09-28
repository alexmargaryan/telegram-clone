import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

const staleTime = 5 * 60 * 1000;
const cacheTime = 10 * 60 * 1000;

export const cachingConfig = {
  staleTime,
  cacheTime,
};

export const queryConfig = {
  retry: false,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  caching: cachingConfig,
};

export const mutationConfig = {
  retry: false,
};

export const defaultOptions = {
  queries: queryConfig,
  mutations: mutationConfig,
};

export const queryClient = new QueryClient({
  defaultOptions,
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error);
    },
  }),
});
