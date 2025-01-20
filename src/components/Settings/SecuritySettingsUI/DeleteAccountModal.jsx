import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Modal } from '../../../UI/Modal';
import { deleteAccount, logoutUser } from '../../../features/auth/authSlice';

export const DeleteAccountModal = ({ isModalShow, setIsModalShow }) => {
	const { securityData, isPasswordCorrect, isDeleteSuccess } = useSelector(state => state.auth);
	const dispatch = useDispatch();

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		setError,
	} = useForm({
		mode: 'onChange',
	});

	const onSubmit = data => {
		if (isPasswordCorrect) {
			if (data.username === securityData.username) {
				dispatch(deleteAccount());
			} else {
				setError(
					'username',
					{ type: 'client', message: 'username is incorrect' },
					{ shouldFocus: true }
				);
			}
		}
	};

	useEffect(() => {
		if (!isModalShow) reset();

		if (isDeleteSuccess) dispatch(logoutUser());
	}, [isModalShow, isDeleteSuccess, reset, dispatch]);

	return (
		<Modal isShow={isModalShow} setIsShow={setIsModalShow}>
			<div className='settings__security-dangerous-modal'>
				<h2 className='settings__security-dangerous-modal-title'>Delete your account</h2>
				<p className='settings__security-dangerous-modal-description'>
					To confirm just write below your username ({securityData.username})
				</p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='settings__security-change-form'
					noValidate
				>
					<div className='settings__security-change-labelBox'>
						<div className='settings__security-change-inputBox delete-modal'>
							<input
								{...register('username', {
									minLength: {
										value: 2,
										message: 'The username must contain at least 2 characters',
									},
									required: 'The input field is required',
									maxLength: {
										value: 20,
										message: 'The username must contain no more than 20 characters',
									},
									pattern: {
										value: /^\S*$/,
										message: 'Spaces are not allowed',
									},
								})}
								required
								maxLength='20'
								className={errors.username ? 'is-invalid' : ''}
							/>
							<span>username</span>
						</div>
						<p className='settings__security-change-error'>{errors.username?.message}</p>
					</div>

					<button className='settings__security-change-submit delete'>Confirm</button>
				</form>
			</div>
		</Modal>
	);
};
