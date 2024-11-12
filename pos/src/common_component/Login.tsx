import React, { useEffect, useState } from 'react';
import bg from '../assets/download.png';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import DateRangeIcon from '@mui/icons-material/DateRange';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { TextField } from '@mui/material';
import { loginUser, signupUser } from './services';
import Loading from './Loading';
import { Bounce, toast } from 'react-toastify';

function Login() {
    const [visible, setVisible] = useState<boolean>(false);
    const [loading,setLoadong]=useState<boolean>(false);
    const [error, setError] = useState({
        username: '',
        emailId: '',
        name: '',
        dob: '',
        phoneNumber: '',
        businessName: '',
        password: '',
    });
    const [signup, setSignup] = useState<boolean>(false);
    const [maxDate, setMaxDate] = useState<string>('');
    const [formData, setFormData] = useState({
        username: '',
        emailId: '',
        name: '',
        dob: '',
        phoneNumber: '',
        businessName: '',
        password: ''
    });


    useEffect(() => {
        const today = new Date();
        const max = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        setMaxDate(max.toISOString().split('T')[0]);
    }, []);

    const clearFormData = () => {
        setFormData({
            username: '',
            emailId: '',
            name: '',
            dob: '',
            phoneNumber: '',
            businessName: '',
            password: ''
        });
        setError({
            username: '',
            emailId: '',
            name: '',
            dob: '',
            phoneNumber: '',
            businessName: '',
            password: '',
        });
    };

    const signupvisible = !error.businessName && !error.dob && !error.emailId && !error.name && !error.phoneNumber && !error.username && formData.businessName && formData.dob && formData.emailId && formData.name && formData.phoneNumber && formData.username
    const login = !error.username && !error.password && formData.username && formData.password

    const input = (
        name: string,
        type: string,
        onchange: (value: string) => void,
        IconComponent: React.ElementType,
        errorMsg: any,
        clearError: () => void
    ) => {
        return (
            <div className='flex justify-center items-center w-full relative'>
                <IconComponent className='mb-5 mr-5 w-5 h-5' sx={{ left: '6%' }} />
                <TextField
                    type={type}
                    placeholder={name}
                    className='mt-3 border-2 w-80 pl-10 h-20 rounded-lg'
                    onChange={(e) => { onchange(e.target.value); clearError() }}
                    required
                    InputProps={
                        type === 'date'
                            ? { inputProps: { max: maxDate } }
                            : (type === 'number'
                                ? { inputProps: { maxLength: 10, min: 0 } }
                                : { inputProps: { maxLength: 30 } })
                    }
                    helperText={errorMsg}
                    error={!!errorMsg}
                />

            </div>
        );
    };

    const handleSignup = () => {
        setLoadong(true)
        if (!formData.username || !formData.emailId || !formData.name || !formData.dob || !formData.phoneNumber || !formData.businessName) {
            setError((error) => ({
                ...error,
                username: formData.username ? '' : 'Username is required',
                emailId: formData.emailId ? '' : 'Email is required',
                name: formData.name ? '' : 'Name is required',
                dob: formData.dob ? '' : 'Date of birth is required',
                phoneNumber: formData.phoneNumber ? '' : 'Phone number is required',
                businessName: formData.businessName ? '' : 'business Name is required',
            }));
            return;
        } else if (formData.phoneNumber.length === 10) {
            signupUser(formData).then((res) => {
                    clearFormData()
                    setVisible(false)
                    setSignup(false)
                    setLoadong(false)
                    toast.success('Wow so easy!', {
                        position: "bottom-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        transition: Bounce,
                        });
                }).catch((error) => {
                    const errorMsg = error.response.data.message
                    console.log(errorMsg);

                    if (errorMsg === "Username already exists") {
                        setError((error) => ({
                            ...error,
                            username: errorMsg,
                        }));
                    } else if (errorMsg === "Email already exists") {
                        setError((error) => ({
                            ...error,
                            emailId: errorMsg,
                        }));
                    } else if (errorMsg === "Phone number already exists") {
                        setError((error) => ({
                            ...error,
                            phoneNumber: errorMsg,
                        }));
                    }
                    setLoadong(false)
                })
        } else if (formData.phoneNumber.length !== 10) {
            setError((error) => ({ ...error, phoneNumber: '10 digit mobile number is required' }))
            setLoadong(false)
        }
    };

    const pressLogin = () => {
        setLoadong(true)
        if (login) {
            loginUser(formData.username, formData.password).then((res)=>{
                sessionStorage.setItem('jsonwebtoken',res.data.token)
                window.location.reload()
                setLoadong(false)
            }).catch((error)=>{
                console.log(error);
                setLoadong(false)
            })
        }
    };

    return (
        <div className='flex justify-end items-center w-screen h-screen' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
            <div className='flex flex-col w-2/6 min-w-80 h-full rounded-l-2xl justify-center items-center bg_incolor '>
                <h1 className='font-bold text-4xl text-shadow'>LOGIN</h1>
                <div className='flex justify-center items-center w-1/2 relative'>
                    <input
                        type="text"
                        className='m-5 border-2 w-full px-10 h-9 rounded-lg'
                        placeholder='USER NAME'
                        onChange={(e) => { setFormData({ ...formData, username: e.target.value }); }}
                    />
                    <PersonOutlineIcon className='absolute left-8 top-1/2 transform -translate-y-1/2 w-5 h-5' />
                </div>
                <div className='flex justify-center items-center w-1/2 relative'>
                    <LockIcon className='absolute left-8 top-1/2 transform -translate-y-1/2 w-5 h-5' />
                    <input
                        type={visible ? "text" : "password"}
                        className='m-5 border-2 w-full px-10 h-9 rounded-lg'
                        placeholder='PASSWORD'
                        onChange={(e) => { setFormData({ ...formData, password: e.target.value }); }}
                    />
                    {visible ? (
                        <VisibilityIcon
                            className='absolute right-8 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer'
                            onClick={() => setVisible(false)}
                        />
                    ) : (
                        <VisibilityOffIcon
                            className='absolute right-8 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer'
                            onClick={() => setVisible(true)}
                        />
                    )}
                </div>
                <div className='flex justify-between w-10/12 mt-3'>
                    <p className='text-blue-600 cursor-pointer'><u>Forgot password</u></p>
                    <p className='text-blue-600 cursor-pointer' onClick={() => setSignup(true)}><u>Sign up</u></p>
                </div>
                <button disabled={!login} className={`confirm w-1/4 mt-5 ${login ? '' : 'disabled:opacity-50'}`} onClick={pressLogin}>LOGIN</button>
            </div>

            {signup && (
                <div className='modal'>
                    <div className='modal-popup px-7 flex-col'>
                        <div className='w-full flex justify-end font-bold -mb-3 cursor-pointer' onClick={() => { setSignup(false); clearFormData() }}>X</div>
                        <h1 className='font-bold text-4xl mb-3 text-shadow'>Sign up</h1>
                        {input('NAME', 'text', (value) => setFormData({ ...formData, name: value }), PersonIcon, error.name, () => setError({ ...error, name: "" }))}
                        {input('USER NAME', 'text', (value) => setFormData({ ...formData, username: value }), PersonOutlineIcon, error.username, () => setError({ ...error, username: "" }))}
                        {input('EMAIL ID', 'email', (value) => setFormData({ ...formData, emailId: value }), EmailIcon, error.emailId, () => setError({ ...error, emailId: "" }))}
                        {input('PHONE NUMBER', 'number', (value) => setFormData({ ...formData, phoneNumber: value }), PhoneIcon, error.phoneNumber, () => setError({ ...error, phoneNumber: "" }))}
                        {input('Date of birth', 'date', (value) => setFormData({ ...formData, dob: value }), DateRangeIcon, error.dob, () => setError({ ...error, dob: "" }))}
                        {input('BUSINESS NAME', 'text', (value) => setFormData({ ...formData, businessName: value }), BusinessCenterIcon, error.businessName, () => setError({ ...error, businessName: "" }))}
                        <button disabled={!signupvisible} className={`confirm w-1/4 mt-5 ${signupvisible ? '' : 'disabled:opacity-50'}`} onClick={handleSignup}>SIGNUP</button>
                    </div>
                </div>
            )}
            {loading&&<Loading/>}
            {/* <ToastContainer/> */}
        </div>
    );
}

export default Login;
