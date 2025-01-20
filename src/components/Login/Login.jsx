import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import { loginUser, resetAuthData } from '../../features/auth/authSlice';
import { ReactComponent as EyeSlashIcon } from '../../images/eye-slash.svg';
import { ReactComponent as EyeIcon } from '../../images/eye.svg';
import { Loader } from '../../UI/Loader';

export const Login = () => {
	const [hidePass, setHidePass] = useState(false);

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm({
		mode: 'onChange',
	});
	const requiredText = 'The input field is required';

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isError, isSuccess, isLoading } = useSelector(state => state.auth);

	const onSubmit = data => {
		dispatch(loginUser(data));
	};

	useEffect(() => {
		const originalTitle = document.title;

		document.title = 'Log in';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	useEffect(() => {
		dispatch(resetAuthData());

		if (isSuccess) {
			reset();
			navigate('/feed');
		}
	}, [isError, isSuccess, navigate, dispatch, reset]);

	return (
		<form className='form login container' onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className='form__content'>
				<h1 className='form__title'>Log in</h1>

				<div className='labelBox'>
					<div className='inputBox'>
						<input
							{...register('username', {
								minLength: {
									value: 2,
									message: 'The input field must contain at least 2 characters',
								},
								maxLength: {
									value: 20,
									message: 'The input field must contain no more than 20 characters',
								},
								required: requiredText,
							})}
							required
							maxLength='20'
							className={errors?.username ? 'is-invalid' : ''}
						/>
						<span>Username</span>
					</div>
					<p className='labelBox__error'>{errors?.username?.message}</p>
				</div>

				<div className='labelBox'>
					<div className='inputBox'>
						<input
							{...register('password', {
								minLength: { value: 8, message: 'The password must contain at least 8 characters' },
								required: requiredText,
								maxLength: {
									value: 30,
									message: 'The password must contain no more than 30 characters',
								},
							})}
							type={hidePass ? 'text' : 'password'}
							required
							maxLength='30'
							autoComplete='true'
							className={errors?.password ? 'is-invalid' : ''}
						/>
						<span>Password</span>
						{hidePass ? (
							<EyeSlashIcon className='inputBox__img' onClick={() => setHidePass(false)} />
						) : (
							<EyeIcon className='inputBox__img' onClick={() => setHidePass(true)} />
						)}
					</div>
					<p className='labelBox__error'>{errors?.password?.message}</p>
				</div>

				<div className='form__fast-links'>
					<NavLink to='/forgot-password' className='link forgot-password__link'>
						Forgot password?
					</NavLink>

					<NavLink to='/signup' className='link sign-up__link'>
						Don't have an account?
					</NavLink>
				</div>

				<button type='submit' className='form__button'>
					{isLoading ? <Loader size='40px' /> : 'Log in'}
				</button>
			</div>
		</form>
	);
};
