import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch } from 'react-redux';
import { fetchRegister } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';

export const Registration = () => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: 'Василий Пупкин',
      email: 'vasya@test.ru',
      password: '1234'
    },
    mode: 'onChange'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values))
    if(!data.payload) {
      alert('Не удалось зарегистрироваться!')
    }
    
    if('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    } 
  }


  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
      <TextField 
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Укажите полное имя' })}className={styles.field} 
          label="Полное имя" 
          fullWidth 
      />
      <TextField 
          type="email"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Укажите email' })}className={styles.field} 
          label="E-Mail" 
          fullWidth 
      />
      <TextField 
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Укажите password' })}className={styles.field} 
          label="Пароль" 
          fullWidth 
      />
      <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
        Зарегистрироваться
      </Button>
      </form>
    </Paper>
  );
};
