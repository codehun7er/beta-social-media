import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword, resetAuthData, resetAuthError } from '../../features/auth/authSlice';

import { ReactComponent as ArrowIcon } from '../../images/next.svg';
import { ReactComponent as PasswordIcon } from '../../images/password.svg';
import { ReactComponent as EyeIcon } from '../../images/eye.svg';
import { ReactComponent as EyeSlashIcon } from '../../images/eye-slash.svg';
import { ReactComponent as SuccessIcon } from '../../images/checked.svg';

export const PasswordSettings = () => {
	const [redirectTime, setRedirectTime] = useState(5);
	const [hidePass, setHidePass] = useState({
		password: false,
		password2: false,
		password3: false,
	});

	const { isSuccess, isError } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		watch,
		setError,
		getValues,
	} = useForm({
		mode: 'onChange',
	});

	const comparePasswords =
		!errors?.password3?.message &&
		watch('password2') !== watch('password3') &&
		getValues('password3');

	const onSubmit = data => {
		if (data.password === data.password2) {
			setError(
				'password',
				{ type: 'server', message: "passwords mustn't match" },
				{ shouldFocus: true }
			);

			setError(
				'password2',
				{ type: 'server', message: "passwords mustn't match" },
				{ shouldFocus: true }
			);
		} else if (!comparePasswords) {
			const passwords = {
				oldPassword: data.password,
				newPassword: data.password2,
			};

			dispatch(changePassword(passwords));
		}
	};

	useEffect(() => {
		let intervalId;

		if (isError) {
			setError(
				'password',
				{ type: 'server', message: 'password is incorrect' },
				{ shouldFocus: true }
			);

			dispatch(resetAuthError());
		}

		if (isSuccess) {
			reset();
			intervalId = setInterval(() => setRedirectTime(prev => prev - 1), 1000);
			if (redirectTime === 0) navigate('/settings');
		}

		return () => clearInterval(intervalId);
	}, [isError, isSuccess, reset, navigate, dispatch, setError, redirectTime]);

	useEffect(() => {
		dispatch(resetAuthData());
	}, [dispatch]);

	return (
		<div className='settings__security-change-wrapper'>
			<div className='settings__security-change'>
				<Link to='/settings' className='settings__security-change-back'>
					<ArrowIcon className='settings__security-change-back-icon' />
				</Link>

				{!isSuccess ? (
					<>
						<h2 className='settings__security-change-title'>Change password</h2>
						<PasswordIcon className='settings__security-change-icon' />

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
										type={hidePass.password ? 'text' : 'password'}
										required
										maxLength='30'
										autoComplete='true'
										className={errors?.password ? 'is-invalid' : ''}
									/>
									<span>current password</span>
									{hidePass.password ? (
										<EyeSlashIcon
											className='settings__security-change-inputBox-img'
											onClick={() => setHidePass(prev => ({ ...prev, password: false }))}
										/>
									) : (
										<EyeIcon
											className='settings__security-change-inputBox-img'
											onClick={() => setHidePass(prev => ({ ...prev, password: true }))}
										/>
									)}
								</div>
								<p className='settings__security-change-error'>{errors.password?.message}</p>
							</div>

							<div className='settings__security-change-labelBox'>
								<div className='settings__security-change-inputBox'>
									<input
										{...register('password2', {
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
										type={hidePass.password2 ? 'text' : 'password'}
										required
										maxLength='30'
										autoComplete='true'
										className={errors?.password2 || comparePasswords ? 'is-invalid' : ''}
									/>
									<span>new password</span>
									{hidePass.password2 ? (
										<EyeSlashIcon
											className='settings__security-change-inputBox-img'
											onClick={() => setHidePass(prev => ({ ...prev, password2: false }))}
										/>
									) : (
										<EyeIcon
											className='settings__security-change-inputBox-img'
											onClick={() => setHidePass(prev => ({ ...prev, password2: true }))}
										/>
									)}
								</div>
								<p className='settings__security-change-error'>{errors.password2?.message}</p>
							</div>

							<div className='settings__security-change-labelBox'>
								<div className='settings__security-change-inputBox'>
									<input
										{...register('password3', {
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
										type={hidePass.password3 ? 'text' : 'password'}
										required
										maxLength='30'
										autoComplete='true'
										className={errors?.password3 || comparePasswords ? 'is-invalid' : ''}
									/>
									<span>repeat new password</span>
									{hidePass.password3 ? (
										<EyeSlashIcon
											className='settings__security-change-inputBox-img'
											onClick={() => setHidePass(prev => ({ ...prev, password3: false }))}
										/>
									) : (
										<EyeIcon
											className='settings__security-change-inputBox-img'
											onClick={() => setHidePass(prev => ({ ...prev, password3: true }))}
										/>
									)}
								</div>
								<p className='settings__security-change-error'>
									{comparePasswords ? "Passwords don't match" : errors?.password3?.message}
								</p>
							</div>
							<button type='submit' className='settings__security-change-submit'>
								Save Changes
							</button>
						</form>
					</>
				) : (
					<>
						<h2 className='settings__security-change-title success'>Success!</h2>
						<SuccessIcon className='settings__security-change-icon success' />

						<p className='settings__security-change-description'>
							You have successfully changed your password
						</p>

						<Link className='settings__security-change-submit' to='/settings'>
							Go back to settings (in {redirectTime} seconds)
						</Link>
					</>
				)}
			</div>
		</div>
	);
};
