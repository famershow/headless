import type {EntryContext} from '@shopify/remix-oxygen';

import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    frameAncestors: ['localhost:*', '*.sanity.studio'],
    connectSrc: ['*'],
    fontSrc: ['*.sanity.io', "'self'"],
    imgSrc: ['*.sanity.io', 'https://cdn.shopify.com', "'self'"],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  if (!isVercelPreview({remixContext})) {
    // Disable CSP in Vercel preview environments to allow Vercel live feedback tool
    responseHeaders.set('Content-Security-Policy', header);
  }

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

function isVercelPreview({remixContext}: {remixContext: EntryContext}) {
  // Parse remix context to check if we're in a Vercel preview environment
  const context: any =
    remixContext.serverHandoffString &&
    JSON.parse(remixContext.serverHandoffString);
  const isDev =
    context?.state?.loaderData?.root?.env?.NODE_ENV === 'development';

  if (!isDev) {
    return process.env.VERCEL_ENV === 'preview';
  }
  return false;
}
