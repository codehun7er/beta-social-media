import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { resetAuthError, verifyNewUserEmail } from '../../features/auth/authSlice';

import { ReactComponent as ArrowIcon } from '../../images/next.svg';
import { ReactComponent as VerifyIcon } from '../../images/mail.svg';
import { ReactComponent as SuccessIcon } from '../../images/checked.svg';

export const VerifyEmailSettings = () => {
	const [redirectTime, setRedirectTime] = useState(5);
	const { isError, isVerifySuccess } = useSelector(state => state.auth);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const inputsData = [
		{
			name: 'code1',
			id: 1,
		},
		{
			name: 'code2',
			id: 2,
		},
		{
			name: 'code3',
			id: 3,
		},
		{
			name: 'code4',
			id: 4,
		},
		{
			name: 'code5',
			id: 5,
		},
		{
			name: 'code6',
			id: 6,
		},
	];

	const {
		register,
		formState: { errors },
		handleSubmit,
		setError,
		setFocus,
		clearErrors,
		formState,
		setValue,
	} = useForm({
		mode: 'onChange',
	});

	const handlePaste = e => {
		if (e.clipboardData.getData('Text')) {
			const pastedCode = e.clipboardData.getData('Text').split('');

			for (let i = 0; i < inputsData.length; i++) {
				setValue(`code${i + 1}`, pastedCode[i]);
			}

			setFocus(`code${inputsData.length}`);
			clearErrors();
		}
	};

	const handleKeyDown = (e, currentIndex) => {
		if (e.keyCode === 8 && !e.target.value) {
			setFocus(`code${currentIndex - 1}`);
		} else if (e.keyCode !== 8 && e.target.value) {
			setFocus(`code${currentIndex + 1}`);
		}

		clearErrors('root.serverError');
	};

	const handleGoBack = () => navigate(-1);

	const onSubmit = data => {
		const code = Object.values(data).join('');

		if (code.length === 6) {
			dispatch(verifyNewUserEmail(code));
		}
	};

	useEffect(() => {
		let intervalId;

		if (isError) {
			setError('root.serverError', { type: 'server', message: `code is incorrect` });
			dispatch(resetAuthError());
		}

		if (isVerifySuccess) {
			intervalId = setInterval(() => setRedirectTime(prev => prev - 1), 1000);

			if (redirectTime === 0) navigate('/settings');
		}

		return () => clearInterval(intervalId);
	}, [isError, isVerifySuccess, redirectTime, setError, dispatch, navigate]);

	return (
		<div className='settings__security-change-wrapper'>
			<div className='settings__security-change'>
				<button onClick={handleGoBack} className='settings__security-change-back'>
					<ArrowIcon className='settings__security-change-back-icon' />
				</button>

				{!isVerifySuccess ? (
					<>
						<h2 className='settings__security-change-title'>Verify email</h2>
						<VerifyIcon className='settings__security-change-icon' />
						<p className='settings__security-change-description'>
							Verify you email, write a code we sent to your email in the input below
						</p>

						<form
							onSubmit={handleSubmit(onSubmit)}
							className='settings__security-change-form'
							noValidate
						>
							<div className='settings__security-change-verify-labelBox'>
								<div className='settings__security-change-form-inputs'>
									{inputsData.map(item => (
										<input
											key={item.id}
											{...register(`code${item.id}`, {
												maxLength: 1,
												minLength: 1,
												required: 'The input field is required',
												pattern: {
													value: /[0-9]/i,
													message: 'only numbers are allowed',
												},
											})}
											onPaste={handlePaste}
											onKeyDown={e => handleKeyDown(e, item.id)}
											className={`settings__security-change-verify-input ${
												errors[`code${item.id}`] || errors.root?.serverError ? 'is-invalid' : ''
											}`}
											autoComplete='off'
											maxLength='1'
											required
										/>
									))}
								</div>
								<p className='settings__security-change-error'>
									{errors.root?.serverError?.type === 'server' && errors.root?.serverError?.message}
								</p>
							</div>
							<button
								type='submit'
								className='settings__security-change-submit'
								disabled={!!Object.keys(formState.errors).length}
							>
								Confirm
							</button>
						</form>
					</>
				) : (
					<>
						<h2 className='settings__security-change-title success'>Success!</h2>
						<SuccessIcon className='settings__security-change-icon success' />

						<p className='settings__security-change-description'>
							You have successfully changed your email
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
