'use client';
import React from 'react';
import { useFormStatus } from 'react-dom';
import { deleteProject } from './actions/delete-article';

interface DeleteButtonProps {
  projectId: number;
}
export function DeleteButton({ projectId }: DeleteButtonProps) {
  function DeleteButtonInner() {
    const { pending } = useFormStatus();
    return (
      <button
        type='submit'
        className='rounded-lg bg-red-600 px-12 py-4 text-xl font-bold text-white shadow-lg transition-all duration-150 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
        disabled={pending}
      >
        Delete Project
      </button>
    );
  }

  return (
    <form
      action={deleteProject}
      className='mt-12 mb-8 flex w-full flex-col items-center'
    >
      <input type='hidden' name='projectId' value={projectId} />
      <DeleteButtonInner />
    </form>
  );
}
