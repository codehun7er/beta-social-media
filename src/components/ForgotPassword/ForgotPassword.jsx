import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { resetAuthData, userForgotPassword } from '../../features/auth/authSlice';
import { Loader } from '../../UI/Loader';

export const ForgotPassword = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isSuccess, isError, isLoading, message } = useSelector(state => state.auth);

	const {
		register,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm({
		mode: 'onChange',
	});

	const onSubmit = data => {
		const userData = {
			email: data.email.toLowerCase(),
		};

		dispatch(userForgotPassword(userData));
		reset();
	};

	useEffect(() => {
		dispatch(resetAuthData());
		if (isSuccess) navigate('/login');
	}, [isError, isSuccess, message, dispatch, navigate]);

	useEffect(() => {
		const originalTitle = document.title;

		document.title = 'Forgot password';

		return () => {
			document.title = originalTitle;
		};
	}, []);

	return (
		<form className='form forget-password container' onSubmit={handleSubmit(onSubmit)} noValidate>
			<div className='form__content'>
				<h1 className='form__title'>Forgot password</h1>

				<div className='labelBox'>
					<div className='inputBox'>
						<input
							{...register('email', {
								required: 'The input field is required',
								maxLength: {
									value: 45,
									message: 'The email must contain no more than 45 characters',
								},
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'invalid email address',
								},
							})}
							required
							maxLength='45'
							className={errors?.email ? 'is-invalid' : ''}
						/>
						<span>Email</span>
					</div>
					<p className='labelBox__error'>{errors?.email?.message}</p>
				</div>

				<button className='form__button' type='submit'>
					{isLoading ? <Loader size='40px' /> : 'send email'}
				</button>
			</div>
		</form>
	);
};
