import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'

interface LoginFormValues {
  email: string
  password: string
}

export const Login = () => {
  const { t } = useTranslation()
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const { register, handleSubmit } = useForm<LoginFormValues>()

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setError('')
      await signIn(values.email, values.password)
      const redirectTo =
        (location.state as { from?: { pathname: string } } | null)?.from?.pathname ||
        '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError('')
      if (err instanceof Error) {
        const status = (err as any).status
        // Handle 400 error (invalid credentials or deleted account)
        if (status === 400) {
          setError(t('auth.accountDeleted'))
        } else {
          setError(t('auth.invalidCredentials'))
        }
      } else {
        setError(t('common.error'))
      }
    }
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {t('nav.login')}
        </p>
        <h1 className="mt-2 break-words text-balance font-display text-3xl font-semibold text-ink dark:text-white">
          {t('auth.loginTitle')}
        </h1>
        <p className="mt-2 text-pretty text-sm text-slate-600 dark:text-slate-300">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('nav.login')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t('auth.email')}
              </label>
              <Input type="email" {...register('email', { required: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t('auth.password')}
              </label>
              <Input type="password" {...register('password', { required: true })} />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              {t('auth.signIn')}
            </Button>
          </form>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('auth.needAccount')}{' '}
            <Link
              to="/register"
              className="font-semibold text-teal hover:text-teal/80 dark:text-teal-300 dark:hover:text-teal-200"
            >
              {t('auth.goRegister')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
