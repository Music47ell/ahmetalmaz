<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>Sitemap | Ahmet ALMAZ</title>
        <meta charset="utf-8" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                   dracula: {
            nosferatu: "#282a36",
            cullen: "#f8f8f2",
            marcelin: "#ff5555",
            lincoln: "#f1fa8c",
          },
                },
              },
            },
          };
        </script>
      </head>

      <body
        class="bg-dracula-nosferatu font-sans text-base leading-6 text-dracula-cullen max-w-[60ch] mx-auto p-2"
      >
        <nav class="container mx-auto py-4">
          <div class="text-dracula-nosferatu bg-dracula-lincoln px-4 py-2 mb-2">
            <p>
              <strong>This is a sitemap for AhmetALMAZ.com</strong>
            </p>
            <p>
              <small
                >It is generated automatically using a script that I wrote in
                JavaScript.</small
              >
            </p>
          </div>
          <p class="text-dracula-cullen">
            Visit
            <a href="https://www.sitemaps.org/" class="text-dracula-marcelin"
              >sitemaps.org</a
            >
            for more information about sitemaps.
          </p>
        </nav>
        <header class="mx-auto max-w-2xl">
          <a target="_blank">
            <xsl:attribute name="href">
              <xsl:value-of
                select="sitemap:urlset/sitemap:url[1]/sitemap:loc"
              />
            </xsl:attribute>
          </a>
          <hr class="my-4" />
          <h2 class="border-0 text-dracula-cullen flex items-center">
            Ahmet ALMAZ Sitemap
          </h2>
          <p class="text-dracula-cullen">
            <xsl:value-of select="sitemap:urlset/sitemap:description" />
          </p>
          <hr class="my-4" />
        </header>
        <xsl:for-each select="/sitemap:urlset/sitemap:url">
          <div class="pb-5">
            <h3 class="mb-0 text-2xl font-semibold">
              <a class="text-dracula-marcelin" target="_blank">
                <xsl:attribute name="href">
                  <xsl:value-of select="sitemap:loc" />
                </xsl:attribute>
                <xsl:value-of select="sitemap:loc" />
              </a>
            </h3>
            <small class="text-dracula-cullen">
              Last updated:
              <xsl:value-of select="substring(sitemap:lastmod, 1, 10)" />
            </small>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
