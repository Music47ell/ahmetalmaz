export async function fetchWpPostById(id: string) {
  const auth = Buffer.from(
    `${import.meta.env.WP_USERNAME}:${import.meta.env.WP_APP_PASSWORD}`
  ).toString("base64");

  const res = await fetch(
    `${import.meta.env.WP_REST_URL}/posts/${id}?context=edit`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!res.ok) {
    throw new Error(`WP returned ${res.status}`);
  }

  return await res.json();
}

export async function fetchWpPostBySlug(slug: string) {
  const auth = Buffer.from(
    `${import.meta.env.WP_USERNAME}:${import.meta.env.WP_APP_PASSWORD}`
  ).toString("base64");

  const res = await fetch(
    `${import.meta.env.WP_REST_URL}/posts?slug=${slug}&context=edit`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!res.ok) {
    throw new Error(`WP returned ${res.status}`);
  }

  const posts = await res.json();
  return posts[0];
}
