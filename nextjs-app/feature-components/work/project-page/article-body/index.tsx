'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';

export interface ArticleProps extends React.HTMLAttributes<HTMLElement> {
  children: string;
  projectId?: number;
}

const markdownComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className='mt-6 mb-3 text-3xl font-bold' {...props}>
      {children}
    </h2>
  ),
  a: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className='text-indigo-600 underline hover:text-indigo-800' {...props}>
      {children}
    </a>
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <i className='text-red-400' {...props} />
  ),
  code: (props: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) =>
    props.inline ? (
      <code className='rounded bg-gray-200 px-1 text-sm' {...props}>
        {props.children}
      </code>
    ) : (
      <pre
        className='overflow-x-auto rounded bg-gray-900 p-4 text-white'
        {...props}
      >
        <code>{props.children}</code>
      </pre>
    ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className='ml-6 list-disc' {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className='ml-6 list-decimal' {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className='mb-1' {...props} />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <table className='min-w-full border-collapse' {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className='border px-2 py-1' {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className='border px-2 py-1 font-bold' {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className='mb-4' {...props} />
  ),
};

export function ArticleBody({
  children,
  projectId: _projectId,
  ...props
}: ArticleProps) {
  return (
    <article {...props}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={markdownComponents}
      >
        {children}
      </ReactMarkdown>
    </article>
  );
}
