import siteMetadata from '../../../data/siteMetadata'

interface Slug {
	loaded: boolean
	slugs: { slug: string; title: string; total: number }[]
	title: string
}

const Spinner = () => (
	<div className="flex justify-center items-center py-10">
		<div className="border-t-4 border-dracula-dracula border-solid w-16 h-16 rounded-full animate-spin" />
	</div>
)

const EmptyState = () => (
	<p className="text-sm text-dracula-comment px-4 py-3 border border-dracula-dracula">
		0
	</p>
)

const SlugList: React.FC<Slug> = ({ title, loaded, slugs }) => {
	if (!loaded) {
		return (
			<div className="flex flex-col gap-y-2">
				<div className="border border-dracula-dracula px-4 py-2">
					<h2 className="uppercase">{title}</h2>
				</div>
				<Spinner />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-y-2">
			<div className="border border-dracula-dracula px-4 py-2">
				<h2 className="uppercase">{title}</h2>
			</div>

			{slugs.length > 0 ? (
				<ul className="m-0 p-0 border border-dracula-dracula px-4 py-2">
					{slugs.map(({ slug, title, total }, index) => (
						<li
							key={`${slug}-${total}-${title}`}
							className="m-0 p-0 flex items-center gap-4 leading-[3rem]"
						>
							<small className="flex shrink-0 items-center justify-center w-6 h-6 font-bold leading-4 border-2">
								{index + 1}
							</small>

							<div className="truncate">
								<a
									href={`${siteMetadata.siteUrl}${slug}`}
									className="capitalize text-sm"
								>
									{title.replace(`| ${siteMetadata.name}`, '')}
								</a>
							</div>

							<strong className="flex justify-end grow">{`x${total}`}</strong>
						</li>
					))}
				</ul>
			) : (
				<EmptyState />
			)}
		</div>
	)
}

export default SlugList
