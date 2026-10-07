import type { ImgHTMLAttributes } from 'react';

type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
};
export function Image({ fill, priority, style, alt, ...props }: ImageProps) {
  return (
    <img
      {...props}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      style={
        fill
          ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              ...style,
            }
          : style
      }
    />
  );
}
