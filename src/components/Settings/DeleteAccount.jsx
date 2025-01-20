import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetAuthData, verifyPassword } from '../../features/auth/authSlice';
import { DeleteAccountModal } from './SecuritySettingsUI/DeleteAccountModal';

import { ReactComponent as DeleteIcon } from '../../images/delete.svg';
import { ReactComponent as ArrowIcon } from '../../images/next.svg';
import { ReactComponent as EyeIcon } from '../../images/eye.svg';
import { ReactComponent as EyeSlashIcon } from '../../images/eye-slash.svg';

export const DeleteAccount = () => {
	const [isModalShow, setIsModalShow] = useState(false);
	const [hidePass, setHidePass] = useState(false);
	const { isSuccess, isError } = useSelector(state => state.auth);
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
		if (data.password) {
			if (isSuccess || isError) dispatch(resetAuthData());
			dispatch(verifyPassword(data.password));
		}
	};

	useEffect(() => {
		if (isSuccess) setIsModalShow(true);

		if (isError) {
			reset();
			setError(
				'password',
				{ type: 'server', message: 'password is incorrect' },
				{ shouldFocus: true }
			);
		}
	}, [isError, isSuccess, setError, reset, dispatch]);

	useEffect(() => {
		dispatch(resetAuthData());
	}, [dispatch]);

	return (
		<>
			<div className='settings__security-change-wrapper'>
				<div className='settings__security-change'>
					<Link to='/settings' className='settings__security-change-back'>
						<ArrowIcon className='settings__security-change-back-icon' />
					</Link>

					<h2 className='settings__security-change-title delete'>Delete account</h2>
					<DeleteIcon className='settings__security-change-icon delete' />
					<p className='settings__security-change-description'>
						If you delete your account, you won't have a chance to restore it
					</p>

					<form
						className='settings__security-change-form'
						onSubmit={handleSubmit(onSubmit)}
						noValidate
					>
						<div className='settings__security-change-labelBox'>
							<div className='settings__security-change-inputBox'>
								<input
									{...register('password', {
										minLength: {
											value: 8,
											message: 'The password must contain at least 8 characters',
										},
										required: 'The input field is required',
										maxLength: {
											value: 30,
											message: 'The password must contain no more than 30 characters',
										},
										pattern: {
											value: /^\S*$/,
											message: 'Spaces are not allowed',
										},
									})}
									required
									maxLength='30'
									autoComplete='true'
									type={hidePass ? 'text' : 'password'}
									className={errors.password ? 'is-invalid' : ''}
								/>
								<span>password</span>
								{hidePass ? (
									<EyeSlashIcon
										className='settings__security-change-inputBox-img'
										onClick={() => setHidePass(false)}
									/>
								) : (
									<EyeIcon
										className='settings__security-change-inputBox-img'
										onClick={() => setHidePass(true)}
									/>
								)}
							</div>
							<p className='settings__security-change-error'>{errors.password?.message}</p>
						</div>

						<button type='submit' className='settings__security-change-submit delete'>
							Submit
						</button>
					</form>
				</div>
			</div>

			<DeleteAccountModal isModalShow={isModalShow} setIsModalShow={setIsModalShow} />
		</>
	);
};
