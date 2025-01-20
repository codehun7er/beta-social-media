import { useContext } from 'react';

import { StompClientContext } from '../../utils/contexts/StompClientContext';

export const useStompClient = () => {
	return useContext(StompClientContext);
};
