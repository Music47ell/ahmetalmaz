import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import React from "react";

const CONTENT_DIR = path.resolve("src/data/content");
const OG_OUTPUT_DIR = path.resolve("public/images/og");

const width = 1200;
const height = 630;

const colors = {
	nosferatu: "#282a36",
	aro: "#44475a",
	cullen: "#f8f8f2",
	dracula: "#bd93f9",
	lincoln: "#f1fa8c",
	marcelin: "#ff5555",
};

const CUSTOM_PAGES = [
	{
		slug: "home",
		title: "Ahmet Almaz",
		excerpt: "Personal website, blog, and projects.",
		pubdate: "",
	},
	{
		slug: "blog",
		title: "Blog",
		excerpt: "Thoughts, tutorials, and experiments.",
		pubdate: "",
	},
	{
		slug: "404",
		title: "Page Not Found",
		excerpt: "This page doesn’t exist.",
		pubdate: "",
	},
	{
		slug: "500",
		title: "Server Error",
		excerpt: "Something went wrong.",
		pubdate: "",
	},
];

async function getFontData() {
	const fontPath = path.resolve("src/lib/fonts/Inter-Regular.ttf");
	return await fs.readFile(fontPath);
}

function OgTemplate({
	title,
	excerpt,
	pubdate,
	domain,
}: {
	title: string;
	excerpt: string;
	pubdate: string;
	domain: string;
}) {
	return React.createElement(
		"div",
		{
			style: {
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: `linear-gradient(135deg, ${colors.nosferatu} 0%, ${colors.aro} 100%)`,
				fontFamily: "Inter",
				color: colors.cullen,
				border: `2px solid ${colors.dracula}`,
				boxSizing: "border-box",
			},
		},
		React.createElement(
			"div",
			{
				style: {
					display: "flex",
					flexDirection: "column",
					flex: 1,
					padding: "30px",
				},
			},
			React.createElement(
				"div",
				{
					style: {
						fontSize: "72px",
						fontWeight: "bold",
						lineHeight: 1.1,
						marginBottom: "auto",
						textShadow: "5px 5px 10px rgba(0,0,0,0.3)",
					},
				},
				title
			),
			React.createElement(
				"div",
				{
					style: {
						fontSize: "28px",
						lineHeight: 1.4,
						marginBottom: "10px",
						textShadow: "3px 3px 5px rgba(0,0,0,0.2)",
					},
				},
				excerpt
			)
		),
		React.createElement("div", {
			style: {
				width: "100%",
				height: "2px",
				background: colors.dracula,
			},
		}),
		React.createElement(
			"div",
			{
				style: {
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					fontSize: "24px",
					padding: "30px",
				},
			},
			React.createElement(
				"div",
				{
					style: {
						color: colors.lincoln,
						textShadow: "2px 2px 5px rgba(0,0,0,0.2)",
					},
				},
				pubdate
			),
			React.createElement(
				"div",
				{
					style: {
						color: colors.marcelin,
						textShadow: "2px 2px 5px rgba(0,0,0,0.2)",
					},
				},
				domain
			)
		)
	);
}

async function generateOg(
	title: string,
	excerpt: string,
	pubdate: string,
	outPath: string
) {
	const fontData = await getFontData();

	const svg = await satori(
		React.createElement(OgTemplate, {
			title,
			excerpt,
			pubdate,
			domain: "ahmetalmaz.com",
		}),
		{
			width,
			height,
			fonts: [
				{
					name: "Inter",
					data: fontData,
					weight: 400,
					style: "normal",
				},
			],
		}
	);

	const resvg = new Resvg(svg);
	const png = resvg.render().asPng();

	await fs.mkdir(path.dirname(outPath), { recursive: true });
	await fs.writeFile(outPath, png);
}

async function generateContentPages() {
	const folders = await fs.readdir(CONTENT_DIR);

	for (const folder of folders) {
		const mdPath = path.join(CONTENT_DIR, folder, "index.md");

		try {
			const file = await fs.readFile(mdPath, "utf-8");
			const { data } = matter(file);

			const title = data.title;
			const excerpt = data.excerpt;
			const pubdate = data.published
				? new Date(data.published).toISOString().split("T")[0]
				: "";

			if (!title) throw new Error("Missing title");
			if (!excerpt) throw new Error("Missing excerpt");

			const outPath = path.join(
				OG_OUTPUT_DIR,
				`${folder}.png`
			);

			await generateOg(title, excerpt, pubdate, outPath);

			console.log(`Generated: ${folder}`);
		} catch (err: any) {
			throw new Error(`Failed for ${folder}: ${err.message}`);
		}
	}
}

async function generateCustomPages() {
	for (const page of CUSTOM_PAGES) {
		const outPath = path.join(
			OG_OUTPUT_DIR,
			`${page.slug}.png`
		);

		await generateOg(
			page.title,
			page.excerpt,
			page.pubdate,
			outPath
		);

		console.log(`Generated custom: ${page.slug}`);
	}
}

async function main() {
	await generateContentPages();
	await generateCustomPages();
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});