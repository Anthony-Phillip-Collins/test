import useSWR from 'swr';

// const API_SAMPLE = [
//   { name: 'Sydney South', state: { abbreviation: 'NSW' } },
//   { name: 'Sydney', state: { abbreviation: 'NSW' } },
//   { name: 'Sydney International Airport', state: { abbreviation: 'NSW' } },
//   { name: 'Sydney Domestic Airport', state: { abbreviation: 'NSW' } },
//   { name: 'Sydenham', state: { abbreviation: 'VIC' } },
// ];

const API: string = 'http://localhost:8010/proxy/suburbs.json?q=';
const delimiter: string = ',';

interface State {
  abbreviation: string;
}

export interface Suburb {
  name: string;
  state: State;
}

interface Error {
  status: number;
}

export interface FetchResponse {
  items: Suburb[];
  isLoading: boolean;
  isError: any;
}

export const concatSuburb = ({ name, state }: Suburb): string =>
  `${name}${delimiter} ${state.abbreviation}`;

export const findSuburbName = (str: string): string =>
  str?.includes(delimiter) ? str.substring(0, str.indexOf(delimiter)) : str;

export const findStateAbbreviation = (str: string): string =>
  str?.includes(delimiter)
    ? str.substring(str.indexOf(delimiter) + 1).trim()
    : '';

const startsWith = (query: string, items: Suburb[]) =>
  items?.filter((suburb) => {
    const result = concatSuburb(suburb);
    return result.indexOf(query) === 0 && result !== query && query !== '';
  });

export function useSuburb(query: string): FetchResponse {
  const suburb = findSuburbName(query);
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error } = useSWR<Suburb[], Error>(`${API}${suburb}`, fetcher, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      // Never retry on 404.
      if (error.status === 404) return;

      // Only retry up to 10 times.
      if (retryCount >= 10) return;
    },
  });
  return {
    items: startsWith(query, data || []),
    isLoading: !error && !data,
    isError: error,
  };
}
