import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowIcon } from '../../images/next.svg';
import { ReactComponent as SuccessIcon } from '../../images/checked.svg';
import { resetAuthError } from '../../features/auth/authSlice';

export const ChangeSettings = ({ type, description, saveAction, navigateTo, children }) => {
	const [redirectTime, setRedirectTime] = useState(5);
	const { isSuccess, isError, securityData } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

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
		if (!isError) {
			if (data[type] !== securityData[type]) {
				if (type === 'email') {
					dispatch(saveAction(data[type].toLowerCase()));
				} else {
					dispatch(saveAction(data[type]));
				}
			} else {
				navigate('/settings');
			}
		}
	};

	const usernameRules = {
		minLength: {
			value: 2,
			message: 'The input field must contain at least 2 characters',
		},
		maxLength: {
			value: 20,
			message: 'The input field must contain no more than 20 characters',
		},
		pattern: {
			value: /^\S*$/,
			message: 'Spaces are not allowed',
		},
		required: 'The input field is required',
	};

	const emailRules = {
		maxLength: {
			value: 47,
			message: 'The email must contain no more than 50 characters',
		},
		pattern: {
			value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
			message: 'Invalid email address',
		},
		required: 'The input field is required',
	};

	useEffect(() => {
		if (isError) {
			setError(type, { type: 'server', message: `${type} is taken` }, { shouldFocus: true });
			dispatch(resetAuthError());
		}

		if (isSuccess) {
			if (type === 'email') navigate(navigateTo);

			reset();
		}
	}, [isError, isSuccess, navigateTo, type, dispatch, reset, navigate, setError]);

	useEffect(() => {
		let intervalId;

		if (isSuccess && type === 'username') {
			intervalId = setInterval(() => setRedirectTime(prev => prev - 1), 1000);
			if (redirectTime === 0) navigate('/settings');
		}

		return () => clearInterval(intervalId);
	}, [type, isSuccess, redirectTime, navigate]);

	return (
		<div className='settings__security-change-wrapper'>
			<div className='settings__security-change'>
				<Link to='/settings' className='settings__security-change-back'>
					<ArrowIcon className='settings__security-change-back-icon' />
				</Link>

				{!isSuccess ? (
					<>
						<h2 className='settings__security-change-title'>Change {type}</h2>
						{children}
						<p className='settings__security-change-description'>{description}</p>

						<form
							className='settings__security-change-form'
							onSubmit={handleSubmit(onSubmit)}
							noValidate
						>
							<div className='settings__security-change-labelBox'>
								<div className='settings__security-change-inputBox'>
									<input
										{...register(type, type === 'username' ? usernameRules : emailRules)}
										required
										maxLength={type === 'username' ? '20' : '47'}
										className={errors[type] ? 'is-invalid' : ''}
									/>
									<span>{type}</span>
								</div>
								<p className='settings__security-change-error'>{errors[type]?.message}</p>
							</div>
							<button disabled={isError} type='submit' className='settings__security-change-submit'>
								Save Changes
							</button>
						</form>
					</>
				) : (
					<>
						<h2 className='settings__security-change-title success'>Success!</h2>
						<SuccessIcon className='settings__security-change-icon success' />

						<p className='settings__security-change-description'>
							You have successfully changed your username
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
