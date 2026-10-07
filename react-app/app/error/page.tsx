import { useSearchParams } from 'react-router-dom';
export default function ErrorPage() {
  const [params] = useSearchParams();
  return (
    <p role='alert' className='mt-8 text-center text-red-600'>
      Sorry, something went wrong: {params.get('reason')}
    </p>
  );
}
