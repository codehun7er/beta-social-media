import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { ProfileDropzoneInput } from './ProfileDropzoneInput';
import { ProfileImgCrop } from './ProfileImgCrop';

import { ReactComponent as DeleteIcon } from '../../../images/delete.svg';
import { ReactComponent as EditIcon } from '../../../images/edit.svg';
import { Modal } from '../../../UI/Modal/Modal';

export const ProfileDropzone = ({
	className,
	img,
	hasImg,
	isCircle,
	addAction,
	deleteAction,
	isMyProfile,
}) => {
	const [isShow, setIsShow] = useState(false);
	const [imgSrc, setImgSrc] = useState({ url: '', name: 'newFile.jpeg', type: 'image/jpeg' });
	const dispatch = useDispatch();

	const onModalClose = () => {
		setImgSrc({ url: '', name: 'newFile.jpeg', type: 'image/jpeg' });
		setIsShow(false);
	};

	return (
		<div className='profile__img-zone'>
			<div className={`profile__img-zone-content ${className.slice(9)}`}>
				{img ? (
					<img className={className} src={img} alt='profile img' />
				) : (
					<div className={`${className} profile__cover-null`} />
				)}
				{isMyProfile && (
					<div className={`${className}-control`}>
						<div onClick={() => setIsShow(true)} className={`${className}-edit`}>
							<EditIcon className={`${className}-edit-img`} />
						</div>
						{hasImg && (
							<div onClick={() => dispatch(deleteAction())} className={`${className}-delete`}>
								<DeleteIcon className={`${className}-delete-img`} />
							</div>
						)}
					</div>
				)}
			</div>

			{isMyProfile && (
				<Modal isShow={isShow} setIsShow={onModalClose}>
					{!imgSrc.url ? (
						<ProfileDropzoneInput setImgSrc={setImgSrc} onModalClose={onModalClose} />
					) : (
						<ProfileImgCrop
							imgSrc={imgSrc}
							setImgSrc={setImgSrc}
							isCircle={isCircle}
							addAction={addAction}
							onModalClose={onModalClose}
						/>
					)}
				</Modal>
			)}
		</div>
	);
};
