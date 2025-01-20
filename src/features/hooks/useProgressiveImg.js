import { useEffect, useState } from 'react';

export const useProgressiveImg = (lowQualitySrc, hightQualitySrc) => {
	const [src, setSrc] = useState(lowQualitySrc);

	useEffect(() => {
		setSrc(lowQualitySrc);
		const img = new Image();
		img.src = hightQualitySrc;

		img.onload = () => {
			setSrc(hightQualitySrc);
		};
	}, [lowQualitySrc, hightQualitySrc]);

	return { src, blur: src === lowQualitySrc };
};
