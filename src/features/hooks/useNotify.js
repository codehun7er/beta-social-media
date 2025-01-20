import { useContext } from 'react';

import { NotifyContext } from '../../utils/contexts/NotificationContext';

export const useNotify = () => {
	return useContext(NotifyContext);
};
