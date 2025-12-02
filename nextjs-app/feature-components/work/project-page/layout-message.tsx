'use client';

import { FC, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export const LayoutMessage: FC = () => {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [visible, setVisible] = useState(true);

  if (!message || !visible) return null;

  return (
    <div className='absolute bottom-0 left-0 mb-14 w-64 -translate-x-full rounded-xl bg-blue-600 px-4 py-2 text-sm whitespace-pre-line text-white shadow-lg'>
      <button
        aria-label='Close message'
        className='absolute top-0 right-0 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white transition-colors hover:bg-gray-700'
        onClick={() => setVisible(false)}
        type='button'
      >
        <span className='text-white'>X</span>
      </button>
      {message}
    </div>
  );
};
