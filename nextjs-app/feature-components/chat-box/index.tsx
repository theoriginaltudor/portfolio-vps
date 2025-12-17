'use client';

import React, { useActionState } from 'react';
import ChatTextArea from './chat-text-area';
import ChatButton from './chat-button';
import { useChatBox } from './use-chat-box';

export const ChatBox: React.FC = () => {
  const {
    formRef,
    message,
    setMessage,
    isEmpty,
    setIsEmpty,
    isTooLong,
    handleSubmit,
  } = useChatBox();
  const [, formAction, pending] = useActionState(handleSubmit, undefined);

  return (
    <form
      ref={formRef}
      className='relative w-[90vw] max-w-[90vw] md:w-[32rem] md:max-w-[32rem]'
      action={formAction}
    >
      <ChatTextArea
        error={isEmpty || isTooLong}
        value={message}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setMessage(e.target.value);
          if (isEmpty && e.target.value.trim()) setIsEmpty(false);
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
        placeholder="Hi, I'm Tudor. How can I help you today?"
      >
        <div className='flex items-center justify-between mt-2'>
          <span className='text-xs text-muted-foreground select-none pointer-events-none'>
            <b>Enter</b>: send, <b>Shift+Enter</b>: newline
          </span>
          <ChatButton pending={pending}>
            {pending ? 'Sending...' : 'Send'}
          </ChatButton>
        </div>
        {isTooLong && (
          <div className='text-red-500 text-xs mt-1'>
            Message is too long (max 800 characters).
          </div>
        )}
      </ChatTextArea>
    </form>
  );
};
