import React from 'react';

interface ChatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  pending?: boolean;
}

const ChatButton: React.FC<ChatButtonProps> = ({
  children,
  pending,
  ...props
}) => (
  <button
    type='submit'
    className='bg-primary text-primary-foreground rounded-3xl px-4 py-2 flex items-center justify-center shadow hover:bg-primary/90 transition-colors text-xs font-semibold cursor-pointer'
    aria-label='Send'
    disabled={pending}
    {...props}
  >
    {children}
  </button>
);

export default ChatButton;
