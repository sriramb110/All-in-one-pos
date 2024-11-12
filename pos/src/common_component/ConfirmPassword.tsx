import React, { useState } from 'react';
import bg from '../assets/download.png';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { confirmPassword } from './services';

function ConfirmPassword() {
    const [password, setPassword] = useState({
        pass: '',
        cPass: ''
    });
    const [errPassword, setErrPassword] = useState({
        pass: '',
        cPass: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const enterPass = (e: any, type: string) => {
        const value = e.target.value;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (type === 'pass') {
            if (passwordRegex.test(value)) {
                setPassword({ ...password, pass: value });
                setErrPassword({ ...errPassword, pass: '' });
            } else {
                setErrPassword({
                    ...errPassword,
                    pass: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
                });
            }
        } else if (type === 'cPass') {
            setPassword({ ...password, cPass: value });
            if (value !== password.pass) {
                setErrPassword({
                    ...errPassword,
                    cPass: 'Passwords do not match.'
                });
            } else {
                setErrPassword({ ...errPassword, cPass: '' });
            }
        }
    };

    const togglePasswordVisibility = (type: string) => {
        if (type === 'pass') {
            setShowPassword(!showPassword);
        } else if (type === 'cPass') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const isFormValid = !errPassword.pass && !errPassword.cPass && password.pass !== '' && password.cPass !== '';

    const confirm = ()=>{
        if(isFormValid){
            confirmPassword(token,password.pass).then((res)=>{
                navigate(`/`)
            }).catch((error)=>{
                console.log(error);
            })
        }

    }

    return (
        <div className='flex justify-center items-center w-screen h-screen' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
            <div className='modal'>
                <div className='modal-popup px-7 flex-col'>
                    <div className='h-auto w-fill flex justify-center items-center flex-col'>
                        <h1 className='font-bold text-4xl m-3'>Welcome to ABS POS</h1>
                        <p className='mb-3'>Thanks for choosing ABS POS</p>
                        <h1 className='mb-3'>Create Your Password</h1>

                        <div className="relative w-72 flex">
                            <TextField
                                type={showPassword ? 'text' : 'password'}
                                sx={{ marginBottom: '5px', width: '100%' }}
                                placeholder='Set Password'
                                onChange={(e) => enterPass(e, 'pass')}
                                helperText={errPassword.pass}
                                error={!!errPassword.pass}
                            />
                            <IconButton
                            sx={{marginTop:'30px',marginLeft:'-40px'}}
                                onClick={() => togglePasswordVisibility('pass')}
                                className='absolute top-1/2 right-3 transform -translate-y-1/2'
                            >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                        </div>

                        <div className="relative w-72 flex">
                            <TextField
                                type={showConfirmPassword ? 'text' : 'password'}
                                sx={{ marginBottom: '5px', width: '100%' }}
                                placeholder='Confirm Password'
                                onChange={(e) => enterPass(e, 'cPass')}
                                helperText={errPassword.cPass}
                                error={!!errPassword.cPass}
                            />
                            <IconButton
                            sx={{marginTop:'30px',marginLeft:'-40px'}}
                                onClick={() => togglePasswordVisibility('cPass')}
                                className='absolute top-1/2 right-3 transform -translate-y-1/2'
                            >
                                {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon/>}
                            </IconButton>
                        </div>

                        <button
                            className={`confirm w-1/4 mt-5 ${isFormValid ? '' : 'disabled:opacity-50'}`}
                            disabled={!isFormValid}
                            onClick={confirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmPassword;
