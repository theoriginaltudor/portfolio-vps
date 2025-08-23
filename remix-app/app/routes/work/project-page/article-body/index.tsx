"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { ArticleEditForm } from "./article-edit-form";

export interface ArticleProps extends React.HTMLAttributes<HTMLElement> {
  children: string;
  edit?: boolean;
  projectId?: number;
}

const markdownComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="underline text-indigo-600 hover:text-indigo-800" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <i className="text-red-400" {...props} />
  ),
  code: (props: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) =>
    props.inline ? (
      <code className="px-1 bg-gray-200 rounded text-sm" {...props}>
        {props.children}
      </code>
    ) : (
      <pre
        className="bg-gray-900 text-white p-4 rounded overflow-x-auto"
        {...props}
      >
        <code>{props.children}</code>
      </pre>
    ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc ml-6" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal ml-6" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="mb-1" {...props} />
  ),
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <table className="min-w-full border-collapse" {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
  td: (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="border px-2 py-1" {...props} />
  ),
  th: (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="border px-2 py-1 font-bold" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4" {...props} />
  ),
};

export function ArticleBody({
  children,
  projectId,
  edit = false,
  ...props
}: ArticleProps) {
  return (
    <article {...props}>
      {edit ? (
        <ArticleEditForm projectId={projectId}>{children}</ArticleEditForm>
      ) : (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={markdownComponents}
        >
          {children}
        </ReactMarkdown>
      )}
    </article>
  );
}
