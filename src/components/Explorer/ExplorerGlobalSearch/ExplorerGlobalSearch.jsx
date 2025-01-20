import { Outlet } from 'react-router-dom';
import { ExplorerSearchInput, ExplorerNav } from '../ExplorerUI';

export const ExplorerGlobalSearch = () => {
	return (
		<div className='explorer__main'>
			<ExplorerSearchInput />

			<div className='explorer__content'>
				<ExplorerNav />

				<hr className='explorer__content-line' />

				<Outlet />
			</div>
		</div>
	);
};
