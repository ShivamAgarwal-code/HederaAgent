import { QueryClient } from '@tanstack/react-query';

/**
 * Check if response is ok, otherwise throw
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorText;
    try {
      const errorData = await res.json();
      errorText = errorData.message || `Status code ${res.status}`;
    } catch {
      errorText = `Status code ${res.status}`;
    }
    throw new Error(errorText);
  }
}

/**
 * Make an API request
 */
export async function apiRequest<T>({
  url,
  method = 'GET',
  data,
  headers = {},
}: {
  url: string;
  method?: string;
  data?: any;
  headers?: Record<string, string>;
}): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  await throwIfResNotOk(response);
  const result = await response.json();
  return result as T;
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Create a query function for TanStack Query
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
  url: string;
}) => () => Promise<T | null> = ({ on401, url }) => {
  return async () => {
    try {
      const response = await fetch(url);
      
      if (response.status === 401) {
        if (on401 === "throw") {
          throw new Error("Unauthorized");
        }
        return null;
      }
      
      await throwIfResNotOk(response);
      return response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  };
};

/**
 * TanStack Query client
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});