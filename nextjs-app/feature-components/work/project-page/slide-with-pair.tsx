import React from 'react';
import Image from 'next/image';

interface SlideProps {
  images: [string, string];
  index: number;
}

export const SlideWithPair: React.FC<SlideProps> = ({ images, index }) => {
  const [img1, img2] = images;

  return (
    <div className='flex w-full gap-4 items-center'>
      <div className='w-2/3'>
        <Image
          src={img1}
          alt={`Feature image ${index + 1}`}
          className='rounded-lg object-cover w-full h-auto'
          width={600}
          height={400}
        />
      </div>
      <div className='w-1/3 flex items-center'>
        <Image
          src={img2}
          alt={`Feature image ${index + 2}`}
          className='rounded-lg object-cover w-full h-auto'
          width={300}
          height={400}
        />
      </div>
    </div>
  );
};
