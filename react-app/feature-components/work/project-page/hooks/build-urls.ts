import { getImageUrl } from '@/lib/utils/get-url';
export const buildImageUrls = (images: string[]) => images.map(getImageUrl);
