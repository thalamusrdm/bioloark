const API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-07';

type AdminGraphqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

type AccessTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

type CachedToken = {
  value: string;
  expiresAt: number;
};

let cachedToken: CachedToken | undefined;

function getShopDomain() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim().toLowerCase();
  if (!domain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) {
    throw new Error('Shopify Admin is not configured');
  }
  return domain;
}

export function shopifyAdminIsConfigured() {
  return missingShopifyAdminEnvironmentVariables().length === 0;
}

export function missingShopifyAdminEnvironmentVariables() {
  return [
    ['SHOPIFY_STORE_DOMAIN', process.env.SHOPIFY_STORE_DOMAIN],
    ['SHOPIFY_ADMIN_CLIENT_ID', process.env.SHOPIFY_ADMIN_CLIENT_ID],
    ['SHOPIFY_ADMIN_CLIENT_SECRET', process.env.SHOPIFY_ADMIN_CLIENT_SECRET],
  ].filter(([, value]) => !value).map(([name]) => name);
}

async function getAdminAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Shopify Admin is not configured');

  const response = await fetch(`https://${getShopDomain()}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    cache: 'no-store',
  });

  const payload = await response.json() as AccessTokenResponse;
  if (!response.ok || !payload.access_token) {
    throw new Error(`Shopify authentication failed (${response.status})`);
  }

  const expiresIn = Math.max(60, payload.expires_in || 86_399);
  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
  return cachedToken.value;
}

async function adminGraphql<T>(query: string, variables: Record<string, unknown>) {
  const response = await fetch(`https://${getShopDomain()}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Shopify-Access-Token': await getAdminAccessToken(),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const payload = await response.json() as AdminGraphqlResponse<T>;
  if (!response.ok || payload.errors?.length || !payload.data) {
    throw new Error(payload.errors?.[0]?.message || `Shopify Admin request failed (${response.status})`);
  }
  return payload.data;
}

const findCustomerQuery = `
  query FindContactCustomer($query: String!) {
    customers(first: 1, query: $query) {
      nodes {
        id
        defaultEmailAddress { emailAddress }
        defaultPhoneNumber { phoneNumber }
        firstName
        lastName
        note
        tags
      }
    }
  }
`;

const upsertCustomerMutation = `
  mutation UpsertContactCustomer($identifier: CustomerSetIdentifiers, $input: CustomerSetInput!) {
    customerSet(identifier: $identifier, input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

type ExistingCustomer = {
  id: string;
  defaultEmailAddress?: { emailAddress?: string | null } | null;
  defaultPhoneNumber?: { phoneNumber?: string | null } | null;
  firstName?: string | null;
  lastName?: string | null;
  note?: string | null;
  tags: string[];
};

function normalizeIsraeliPhone(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (/^0\d{8,9}$/.test(digits)) return `+972${digits.slice(1)}`;
  if (/^972\d{8,9}$/.test(digits)) return `+${digits}`;
  if (trimmed.startsWith('+') && /^\d{9,15}$/.test(digits)) return `+${digits}`;
  return undefined;
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts.shift() || name,
    lastName: parts.join(' ') || undefined,
  };
}

export async function storeContactInShopify(input: {
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  const found = await adminGraphql<{ customers: { nodes: ExistingCustomer[] } }>(findCustomerQuery, {
    query: `email:${input.email}`,
  });
  const existing = found.customers.nodes[0];
  const parsedName = splitName(input.name);
  const submittedAt = new Date().toISOString();
  const entry = [
    `[פנייה מהאתר — ${submittedAt}]`,
    `שם: ${input.name}`,
    `טלפון: ${input.phone}`,
    `הודעה: ${input.message}`,
  ].join('\n');
  const previousNote = existing?.note?.trim() || '';
  const note = previousNote ? `${previousNote.slice(-1_500)}\n\n${entry}` : entry;
  const phone = existing?.defaultPhoneNumber?.phoneNumber || normalizeIsraeliPhone(input.phone);
  const tags = Array.from(new Set([...(existing?.tags || []), 'website-contact']));

  const data = await adminGraphql<{
    customerSet: {
      customer?: { id: string } | null;
      userErrors: Array<{ field?: string[] | null; message: string }>;
    };
  }>(upsertCustomerMutation, {
    identifier: { email: input.email },
    input: {
      email: input.email,
      firstName: existing?.firstName || parsedName.firstName,
      ...(existing?.lastName || parsedName.lastName ? { lastName: existing?.lastName || parsedName.lastName } : {}),
      ...(phone ? { phone } : {}),
      note,
      tags,
    },
  });

  if (data.customerSet.userErrors.length || !data.customerSet.customer) {
    throw new Error(data.customerSet.userErrors[0]?.message || 'Shopify did not save the customer');
  }
  return data.customerSet.customer.id;
}
