import { useEffect, useState } from 'react';
export function useRequest<T>(load: () => Promise<T>) {
  const [state, setState] = useState<{
    data?: T;
    error?: string;
    loading: boolean;
  }>({ loading: true });
  useEffect(() => {
    let active = true;
    setState({ loading: true });
    load()
      .then(data => {
        if (active) setState({ data, loading: false });
      })
      .catch(error => {
        if (active)
          setState({
            error:
              error instanceof Error ? error.message : 'Unable to load data.',
            loading: false,
          });
      });
    return () => {
      active = false;
    };
  }, [load]);
  return state;
}
