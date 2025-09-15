import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { createArticle } from './action';

export default async function NewArticlePage() {
  return (
    <form action={createArticle} className='flex flex-col gap-4 p-4'>
      <Label>New Article</Label>
      <div className='flex w-full gap-2'>
        <Label>Slug</Label>
        <Input type='text' name='slug' required />
      </div>
      <div className='flex w-full gap-2'>
        <Label>Title</Label>
        <Input type='text' name='title' required />
      </div>
      <div className='flex w-full flex-col gap-2'>
        <Label>Description</Label>
        <Textarea name='description' required />
      </div>
      <div className='flex w-full flex-col gap-2'>
        <Label>Long Description</Label>
        <Textarea name='longDescription' required />
      </div>
      <div className='flex w-full flex-col gap-2'>
        <Label>Image</Label>
        <Input type='file' name='image' multiple={true} accept='image/webp' />
      </div>
      <button
        className='bg-primary hover:bg-primary/80 active:bg-primary/90 text-primary-foreground w-sm rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
        type='submit'
      >
        Create Article
      </button>
    </form>
  );
}
