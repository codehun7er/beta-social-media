import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';

export const ProfileDropzoneInput = ({ setImgSrc, onModalClose }) => {
	const onDrop = useCallback(
		acceptedFiles => {
			if (acceptedFiles.length > 0) {
				const file = acceptedFiles[0];
				setImgSrc({ name: file.name, url: URL.createObjectURL(file), type: file.type });
			}
		},
		[setImgSrc]
	);

	const onDropRejected = fileRejections => {
		switch (fileRejections[0].errors[0].code) {
			case 'file-too-large':
				toast.error('File is larger than 15 MB');
				break;
			case 'file-invalid-type':
				toast.error('Unsupported file type');
				break;
			default:
				break;
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		onDropRejected,
		maxFiles: 1,
		maxSize: 15728640,
		accept: {
			'image/png': [],
			'image/gif': [],
			'image/jpeg': [],
			'image/jpg': [],
		},
	});

	return (
		<div>
			<div className='modal__header'>
				<h3>Upload an image</h3>
				<div onClick={onModalClose} className='modal__close' />
			</div>

			<hr />

			<div className='profile__modal-img-main'>
				<div className='profile__modal-img-dropzone' {...getRootProps()}>
					<input {...getInputProps()} />
					{isDragActive ? (
						<p>Drop the files here ...</p>
					) : (
						<p>Drag 'n' drop some files here or click to select files</p>
					)}
				</div>
			</div>

			<hr />

			<div className='modal__footer'>
				<p>The size must be less than 15 MB </p>
			</div>
		</div>
	);
};
