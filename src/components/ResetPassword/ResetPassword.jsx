import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { resetAuthData, userResetPassword } from '../../features/auth/authSlice';
import { ReactComponent as EyeSlashIcon } from '../../images/eye-slash.svg';
import { ReactComponent as EyeIcon } from '../../images/eye.svg';
import { Loader } from '../../UI/Loader';

export const ResetPassword = () => {
	const [hidePass, setHidePass] = useState({
		password: false,
		password2: false,
	});

	const { message, isError, isSuccess, isLoading } = useSelector(state => state.auth);
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const code = location.search.slice(6);

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
		watch,
		getValues,
	} = useForm({
		mode: 'onChange',
	});

	const comparePasswords =
		!errors?.password2?.message &&
		watch('password') !== watch('password2') &&
		getValues('password2');

	const passwordSettings = {
		minLength: { value: 8, message: 'The password must contain at least 8 characters' },
		required: 'The input field is required',
		maxLength: {
			value: 30,
			message: 'The password must contain no more than 30 characters',
		},
	};

	const onSubmit = data => {
		const { password } = data;
		const userData = {
			code,
			newPassword: password,
		};

		if (!comparePasswords) dispatch(userResetPassword(userData));
		reset();
	};

	useEffect(() => {
		const originalTitle = document.title;
		document.title = 'Reset password';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	useEffect(() => {
		dispatch(resetAuthData());

		if (isSuccess) navigate('/login');
	}, [isError, isSuccess, message, navigate, dispatch]);

	return (
		<form className='form reset-password container' onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className='form__content'>
				<h1 className='form__title'>Reset Password</h1>

				<div className='labelBox'>
					<div className='inputBox'>
						<input
							{...register('password', {
								...passwordSettings,
							})}
							type={hidePass.password ? 'text' : 'password'}
							required
							className={errors?.password ? 'is-invalid' : ''}
						/>
						<span>Password</span>
						{hidePass.password ? (
							<EyeSlashIcon
								className='inputBox__img'
								onClick={() => setHidePass(prev => ({ ...prev, password: false }))}
							/>
						) : (
							<EyeIcon
								className='inputBox__img'
								onClick={() => setHidePass(prev => ({ ...prev, password: true }))}
							/>
						)}
					</div>
					<p className='labelBox__error'>{errors?.password?.message}</p>
				</div>

				<div className='labelBox'>
					<div className='inputBox'>
						<input
							{...register('password2', {
								...passwordSettings,
							})}
							type={hidePass.password2 ? 'text' : 'password'}
							required
							className={errors?.password2 || comparePasswords ? 'is-invalid' : ''}
						/>
						<span>Repeat Password</span>
						{hidePass.password2 ? (
							<EyeSlashIcon
								className='inputBox__img'
								onClick={() => setHidePass(prev => ({ ...prev, password2: false }))}
							/>
						) : (
							<EyeIcon
								className='inputBox__img'
								onClick={() => setHidePass(prev => ({ ...prev, password2: true }))}
							/>
						)}
					</div>
					<p className='labelBox__error'>
						{comparePasswords ? "Passwords don't match" : errors?.password2?.message}
					</p>
				</div>

				<button type='submit' className='form__button'>
					{isLoading ? <Loader size='40px' /> : 'reset password'}
				</button>
			</div>
		</form>
	);
};
