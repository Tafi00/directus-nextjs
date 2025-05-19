interface TitleProps {
	tagline?: string | null;
	className?: string;
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
	'data-directus'?: string;
}

const Tagline = ({ tagline, className = '', as: Component = 'h2', 'data-directus': dataDirectus }: TitleProps) => {
	if (!tagline) return null;

	return (
		<Component
			className={`text-[4vw] md:text-[24px] 2xl:text-[28px] font-bold text-[#D4A437] text-center uppercase ${className}`}
			data-directus={dataDirectus}
		>
			{tagline}
		</Component>
	);
};

export default Tagline;
