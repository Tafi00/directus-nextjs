interface HeadlineProps {
	headline?: string | null;
	className?: string;
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
	'data-directus'?: string;
}

const Headline = ({ headline, className = '', as: Component = 'p', 'data-directus': dataDirectus }: HeadlineProps) => {
	if (!headline) return null;

	return (
		<Component
			className={`text-[4.3vw] md:text-[28px] 2xl:text-[32px] font-bold text-primary text-center leading-snug uppercase ${className}`}
			data-directus={dataDirectus}
		>
			{headline}
		</Component>
	);
};

export default Headline;
