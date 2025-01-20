import 'react-image-crop/dist/ReactCrop.css';
import { useEffect, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { useDispatch } from 'react-redux';

export const ProfileImgCrop = ({ imgSrc, setImgSrc, isCircle, addAction, onModalClose }) => {
	const [crop, setCrop] = useState();
	const [croppedImgUrl, setCroppedImgUrl] = useState();
	const imgRef = useRef();
	const dispatch = useDispatch();

	const aspect = isCircle ? 1 : 3.16;

	const centerAspectCrop = (mediaWidth, mediaHeight, aspect) => {
		return centerCrop(
			makeAspectCrop(
				{
					unit: '%',
					width: 35,
				},
				aspect,
				mediaWidth,
				mediaHeight
			),
			mediaWidth,
			mediaHeight
		);
	};

	const getCroppedImg = (crop, fileName) => {
		return new Promise(resolve => {
			const imageElement = imgRef.current;
			const canvas = document.createElement('canvas');
			const scaleX = imageElement.naturalWidth / imageElement.width;
			const scaleY = imageElement.naturalHeight / imageElement.height;
			canvas.width = crop.width;
			canvas.height = crop.height;
			const ctx = canvas.getContext('2d');

			ctx.drawImage(
				imageElement,
				crop.x * scaleX,
				crop.y * scaleY,
				crop.width * scaleX,
				crop.height * scaleY,
				0,
				0,
				crop.width,
				crop.height
			);

			canvas.toBlob(blob => {
				if (!blob) {
					console.error('Canvas is empty');
					return;
				}
				blob.name = fileName;
				window.URL.revokeObjectURL(croppedImgUrl);
				resolve(window.URL.createObjectURL(blob));
			}, 'image/jpeg');
		});
	};

	const makeClientCrop = async croppedArea => {
		const croppedImage = await getCroppedImg(croppedArea, imgSrc.name);
		setCroppedImgUrl(croppedImage);
	};

	const onCropComplete = croppedArea => {
		makeClientCrop(croppedArea);
	};

	const onImageLoad = e => {
		const { width, height } = e.currentTarget;
		setCrop(centerAspectCrop(width, height, aspect));
	};

	const createFileFromLink = async link => {
		try {
			const response = await fetch(link);
			const file = await response.blob();
			return new File([file], imgSrc.name, { type: imgSrc.type });
		} catch (error) {
			console.log(error);
		}
	};

	const goBack = () => {
		setImgSrc({ name: 'newFile.jpeg', url: '', type: 'image/jpeg' });
		setCrop(undefined);
	};

	const onSave = async () => {
		const file = await createFileFromLink(croppedImgUrl);
		const formData = new FormData();
		formData.append('file', file);
		dispatch(addAction(formData));
		onModalClose();
	};

	useEffect(() => {
		setCrop(undefined);
	}, []);

	return (
		<div className='profile__modal-img-crop'>
			{imgSrc && (
				<ReactCrop
					minWidth={100}
					keepSelection={true}
					aspect={aspect}
					circularCrop={isCircle}
					crop={crop}
					onComplete={onCropComplete}
					onChange={crop => setCrop(crop)}
				>
					<img
						className='profile__modal-img-crop-item'
						ref={imgRef}
						src={imgSrc.url}
						alt='crop me'
						onLoad={onImageLoad}
					/>
				</ReactCrop>
			)}
			{/* {croppedImgUrl && <img src={croppedImgUrl} alt='preview' />} */}
			<div className='profile__modal-img-crop-buttons'>
				<button className='profile__modal-img-crop-back' onClick={goBack}>
					Back
				</button>

				<button className='profile__modal-img-crop-save' onClick={onSave}>
					Save
				</button>
			</div>
		</div>
	);
};
