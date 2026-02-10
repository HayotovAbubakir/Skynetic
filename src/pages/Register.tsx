import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'

interface RegisterFormValues {
  email: string
  password: string
  confirm: string
}

export const Register = () => {
  const { t } = useTranslation()
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit } = useForm<RegisterFormValues>()

  const onSubmit = async (values: RegisterFormValues) => {
    if (values.password !== values.confirm) {
      setError(t('auth.passwordMismatch'))
      return
    }

    if (submitting) return
    setSubmitting(true)
    setError('')

    // Try signup with small retry on 429 (exponential backoff)
    const maxAttempts = 2
    let attempt = 0
    while (attempt < maxAttempts) {
      try {
        await signUp(values.email, values.password)
        // Success — redirect to login with message
        navigate('/login', {
          state: {
            message:
              t('auth.confirmEmail') || 'Please check your email to confirm your account',
          },
        })
        setSubmitting(false)
        return
      } catch (err) {
        if (err instanceof Error) {
          const status = (err as any).status
          if (status === 429) {
            attempt++
            if (attempt >= maxAttempts) {
              setError(t('auth.tooManyRequests'))
              break
            }
            // wait with exponential backoff + jitter
            const wait = 500 * Math.pow(2, attempt) + Math.floor(Math.random() * 200)
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, wait))
            continue
          }

          // Non-429 errors — map to friendly messages
          if (err.message.includes('already registered')) {
            setError(t('auth.emailExists'))
          } else if (err.message.includes('password')) {
            setError(t('auth.passwordWeak'))
          } else if (status === 422) {
            setError(t('auth.emailExists'))
          } else {
            setError(t('auth.signupFailed'))
          }
        } else {
          setError(t('common.error'))
        }
        break
      }
    }

    setSubmitting(false)
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {t('nav.register')}
        </p>
        <h1 className="mt-2 break-words text-balance font-display text-3xl font-semibold text-ink dark:text-white">
          {t('auth.registerTitle')}
        </h1>
        <p className="mt-2 text-pretty text-sm text-slate-600 dark:text-slate-300">
          {t('auth.registerSubtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('nav.register')}</CardTitle>
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t('auth.confirm')}
              </label>
              <Input type="password" {...register('confirm', { required: true })} />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? t('auth.signingUp') || 'Creating account...' : t('auth.signUp')}
            </Button>
          </form>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('auth.haveAccount')}{' '}
            <Link
              to="/login"
              className="font-semibold text-teal hover:text-teal/80 dark:text-teal-300 dark:hover:text-teal-200"
            >
              {t('auth.goLogin')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
