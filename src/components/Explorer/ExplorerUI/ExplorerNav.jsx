import { ExplorerNavButton } from './ExplorerNavButton';

export const ExplorerNav = () => {
	const links = [
		{
			title: 'Users',
			path: '',
		},
		{
			title: 'Posts',
			path: 'posts',
		},
	];

	return (
		<div className='explorer__nav'>
			{links.map(link => (
				<ExplorerNavButton key={link.path} title={link.title} path={link.path} />
			))}
		</div>
	);
};
