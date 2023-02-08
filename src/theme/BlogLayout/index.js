import React from 'react';
import BlogLayout from '@theme-original/BlogLayout';
import { Analytics } from '@vercel/analytics/react';

export default function BlogLayoutWrapper(props) {
  return (
    <>
      <BlogLayout {...props} />
      <Analytics />
    </>
  );
}
