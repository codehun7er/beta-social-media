import { useEffect } from 'react';
import { ExplorerGlobalSearch } from './';

import './Explorer.scss';

export const Explorer = () => {
	useEffect(() => {
		const originalTitle = document.title;

		document.title = 'Explorer';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	return (
		<div className='explorer container'>
			<ExplorerGlobalSearch />
		</div>
	);
};
