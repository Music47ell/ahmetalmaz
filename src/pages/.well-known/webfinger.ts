import siteMetadata from '../../data/siteMetadata';

const INSTANCE = siteMetadata.instance;
const USERNAME = siteMetadata.username;

export async function GET() {
  const response = await fetch(
    `https://${INSTANCE}/.well-known/webfinger?resource=acct:${USERNAME}@${INSTANCE}`
  );

  const data = await response.json();

  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/jrd+json',
    },
  });
}
