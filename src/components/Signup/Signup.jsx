import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import { registerUser, resetAuthData } from '../../features/auth/authSlice';
import { ReactComponent as EyeSlashIcon } from '../../images/eye-slash.svg';
import { ReactComponent as EyeIcon } from '../../images/eye.svg';
import { Loader } from '../../UI/Loader';

export const Signup = () => {
	const [hidePass, setHidePass] = useState({
		password: false,
		password2: false,
	});

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
		!errors?.password2?.message &&
		watch('password') !== watch('password2') &&
		getValues('password2');

	const requiredText = 'The input field is required';
	const minLength = { value: 2, message: 'The input field must contain at least 2 characters' };
	const maxLength = {
		value: 20,
		message: 'The input field must contain no more than 20 characters',
	};
	const noSpacePattern = { value: /^\S*$/, message: 'Spaces are not allowed' };

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isError, isSuccess, isLoading, message } = useSelector(state => state.auth);

	const onSubmit = data => {
		const { firstname, lastname, username, email, password } = data;
		const userData = {
			firstname,
			lastname,
			username,
			email: email.toLowerCase(),
			password,
		};

		if (!comparePasswords) dispatch(registerUser(userData));
	};

	useEffect(() => {
		const originalTitle = document.title;
		document.title = 'Sign up';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	useEffect(() => {
		dispatch(resetAuthData());

		if (isError) {
			switch (message) {
				case 'email':
					setError('email', { type: 'server', message: 'Email is taken' }, { shouldFocus: true });
					break;

				case 'username':
					setError(
						'username',
						{ type: 'server', message: 'Username is taken' },
						{ shouldFocus: true }
					);
					break;

				case 'both':
					setError(
						'username',
						{ type: 'server', message: 'Username is taken' },
						{ shouldFocus: true }
					);
					setError('email', { type: 'server', message: 'Email is taken' });
					break;

				default:
					break;
			}
		}

		if (isSuccess) {
			navigate('/login');
			reset();
		}
	}, [isError, isSuccess, message, navigate, dispatch, reset, setError]);

	return (
		<form className='form signup container' onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className='form__content'>
				<h1 className='form__title'>Sign up</h1>

				<div className='labelBox'>
					<div className='inputBox'>
						<input
							{...register('firstname', {
								minLength: minLength,
								maxLength: maxLength,
								required: requiredText,
								pattern: noSpacePattern,
							})}
							required
							maxLength='20'
							className={errors?.firstname ? 'is-invalid' : ''}
						/>
						<span>Firstname</span>
					</div>
					<p className='labelBox__error'>{errors?.firstname?.message}</p>
				</div>

				<div className='labelBox'>
					<div className='inputBox'>
						<input
							{...register('lastname', {
								minLength: minLength,
								maxLength: maxLength,
								required: requiredText,
								pattern: noSpacePattern,
							})}
							required
							maxLength='20'
							className={errors?.lastname ? 'is-invalid' : ''}
						/>
						<span>Lastname</span>
					</div>
					<p className='labelBox__error'>{errors?.lastname?.message}</p>
				</div>

				<div className='labelBox'>
					<div className='inputBox'>
						<input
							{...register('username', {
								minLength: minLength,
								maxLength: maxLength,
								required: requiredText,
								pattern: noSpacePattern,
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
							{...register('email', {
								required: requiredText,
								maxLength: {
									value: 47,
									message: 'The email must contain no more than 50 characters',
								},
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'Invalid email address',
								},
							})}
							required
							maxLength='47'
							className={errors?.email ? 'is-invalid' : ''}
						/>
						<span>Email</span>
					</div>
					<p className='labelBox__error'>{errors?.email?.message}</p>
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
								pattern: noSpacePattern,
							})}
							type={hidePass.password ? 'text' : 'password'}
							required
							maxLength='30'
							autoComplete='true'
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
								minLength: { value: 8, message: 'Password must contain at least 8 characters' },
								required: requiredText,
								maxLength: {
									value: 30,
									message: 'The password must contain no more than 30 characters',
								},
								pattern: noSpacePattern,
							})}
							type={hidePass.password2 ? 'text' : 'password'}
							required
							maxLength='30'
							autoComplete='true'
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

				<NavLink to='/login' className='link log-in__link'>
					Do you have an account?
				</NavLink>

				<button type='submit' className='form__button'>
					{isLoading ? <Loader size='40px' /> : 'Sign up'}
				</button>
			</div>
		</form>
	);
};
