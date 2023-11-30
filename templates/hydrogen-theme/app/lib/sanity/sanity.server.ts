import type {BaseQuery, InferType, z} from 'groqd';
import type {
  ClientPerspective,
  ContentSourceMap,
  FilteredResponseQueryOptions,
  QueryParams,
  SanityStegaClient,
  UnfilteredResponseQueryOptions,
} from '@sanity/client/stega';
import {CacheShort, createWithCache} from '@shopify/hydrogen';

import {getSanityClient} from './client';
import {loadQuery, queryStore} from './sanity.loader';

type CreateSanityClientOptions = {
  cache: Cache;
  waitUntil: ExecutionContext['waitUntil'];
  config: {
    projectId: string;
    dataset: string;
    useStega: string;
    studioUrl: string;
    apiVersion: string;
    useCdn: boolean;
  };
};

type CachingStrategy = ReturnType<typeof CacheShort>;
type BaseType<T = any> = z.ZodType<T>;
type GroqdQuery = BaseQuery<BaseType<any>>;

export type Sanity = {
  client: SanityStegaClient;
  query<T extends GroqdQuery>(options: {
    groqdQuery: T;
    params?: QueryParams;
    cache?: CachingStrategy;
    queryOptions?:
      | FilteredResponseQueryOptions
      | UnfilteredResponseQueryOptions;
  }): Promise<{
    data: InferType<T>;
    sourceMap?: ContentSourceMap;
    perspective?: ClientPerspective;
  }>;
};

let sanityServerClientHasBeenInitialized = false;

export function createSanityClient(options: CreateSanityClientOptions) {
  const {cache, waitUntil, config} = options;
  const {projectId, dataset, useStega, useCdn, studioUrl, apiVersion} = config;

  const {client} = getSanityClient({
    projectId,
    dataset,
    useCdn,
    apiVersion,
    useStega,
    studioUrl,
  });

  if (!sanityServerClientHasBeenInitialized) {
    queryStore.setServerClient(client);
    sanityServerClientHasBeenInitialized = true;
  }

  const sanity: Sanity = {
    client,
    async query({
      groqdQuery,
      params,
      cache: strategy = CacheShort(),
      queryOptions,
    }) {
      const {query} = groqdQuery as GroqdQuery;
      const queryHash = await hashQuery(query, params);
      const withCache = createWithCache({
        cache,
        waitUntil,
      });

      return withCache(queryHash, strategy, () => {
        if (!queryOptions) {
          return loadQuery(query, params);
        }

        // NOTE: satisfy union type
        if (queryOptions.filterResponse === false) {
          return loadQuery(query, params, queryOptions);
        }

        return loadQuery(query, params, queryOptions);
      });
    },
  };

  return sanity;
}

/**
 * Create an SHA-256 hash as a hex string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */
export async function sha256(message: string): Promise<string> {
  // encode as UTF-8
  const messageBuffer = new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
  // convert bytes to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash query and its parameters for use as cache key
 * NOTE: Oxygen deployment will break if the cache key is long or contains `\n`
 */
function hashQuery(query: GroqdQuery['query'], params?: QueryParams) {
  let hash = query;

  if (params !== null) {
    hash += JSON.stringify(params);
  }

  return sha256(hash);
}
