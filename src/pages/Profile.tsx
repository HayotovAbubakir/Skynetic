import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, ShieldCheck, UserCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { useAuth } from '../contexts/AuthContext'
import { useAppStore } from '../features/appStore'
import { supabase } from '../services/supabase'

interface ProfileFormValues {
  name: string
  email: string
  goals: string
  focusAreas: string
}

type ProfileRow = {
  name: string | null
  email: string | null
  goals: string | null
  focus_areas: string | null
}

export const Profile = () => {
  const { t } = useTranslation()
  const { user: appUser } = useAppStore()
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<ProfileFormValues | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fallbackProfile = useMemo<ProfileFormValues>(() => {
    const metadata = (authUser?.user_metadata ?? {}) as Record<string, unknown>
    return {
      name: (metadata.name as string) ?? (metadata.full_name as string) ?? appUser.name ?? '',
      email: authUser?.email ?? appUser.email ?? '',
      goals: t('profile.defaultGoals'),
      focusAreas: t('profile.defaultFocus'),
    }
  }, [appUser.email, appUser.name, authUser, t])

  const { register, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues: fallbackProfile,
  })

  useEffect(() => {
    if (!authUser) return
    let isActive = true

    const loadProfile = async () => {
      setIsLoading(true)
      setError('')

      let nextProfile = fallbackProfile
      const { data, error: dbError } = await supabase
        .from('profiles')
        .select('name, email, goals, focus_areas')
        .eq('id', authUser.id)
        .maybeSingle()

      const profileRow = data as ProfileRow | null
      if (profileRow) {
        nextProfile = {
          name: profileRow.name ?? fallbackProfile.name,
          email: profileRow.email ?? fallbackProfile.email,
          goals: profileRow.goals ?? fallbackProfile.goals,
          focusAreas: profileRow.focus_areas ?? fallbackProfile.focusAreas,
        }
      } else {
        const metadata = (authUser.user_metadata ?? {}) as Record<string, unknown>
        nextProfile = {
          name:
            (metadata.name as string) ??
            (metadata.full_name as string) ??
            fallbackProfile.name,
          email: (metadata.email as string) ?? fallbackProfile.email,
          goals: (metadata.goals as string) ?? fallbackProfile.goals,
          focusAreas:
            (metadata.focusAreas as string) ??
            (metadata.focus_areas as string) ??
            fallbackProfile.focusAreas,
        }

        if (dbError) {
          console.warn('Profile load failed', dbError)
        }
      }

      if (isActive) {
        setProfile(nextProfile)
        reset(nextProfile)
        setIsLoading(false)
      }
    }

    void loadProfile()

    return () => {
      isActive = false
    }
  }, [authUser, fallbackProfile, reset])

  const onSubmit = async (values: ProfileFormValues) => {
    if (!authUser) return

    setIsSaving(true)
    setError('')
    setSuccess('')

    const authPayload: { data: Record<string, string>; email?: string } = {
      data: {
        name: values.name,
        goals: values.goals,
        focusAreas: values.focusAreas,
      },
    }

    if (values.email && values.email !== authUser.email) {
      authPayload.email = values.email
    }

    const { error: authError } = await supabase.auth.updateUser(authPayload)

    if (authError) {
      setError(authError.message)
      setIsSaving(false)
      return
    }

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          name: values.name,
          email: values.email,
          goals: values.goals,
          focus_areas: values.focusAreas,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      )

    if (dbError) {
      console.warn('Profile upsert failed', dbError)
    }

    setProfile(values)
    reset(values)
    setIsEditing(false)
    setIsSaving(false)
    setSuccess(t('profile.saved'))
  }

  const handleEdit = () => {
    setIsEditing(true)
    setSuccess('')
    setError('')
  }

  const handleCancel = () => {
    if (profile) {
      reset(profile)
    } else {
      reset(fallbackProfile)
    }
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  const viewProfile = profile ?? fallbackProfile

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          {t('profile.eyebrow')}
        </p>
        <h1 className="mt-2 break-words text-balance font-display text-3xl font-semibold text-ink dark:text-white">
          {t('profile.title')}
        </h1>
        <p className="mt-2 text-pretty text-sm text-slate-600 dark:text-slate-300">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('profile.account')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
                style={{ backgroundColor: appUser.avatarColor }}
              >
                <UserCircle2 size={28} />
              </div>
              <div className="min-w-0">
                <p className="break-words font-display text-xl font-semibold text-ink dark:text-white">
                  {viewProfile.name || appUser.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{appUser.role}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 break-words">
                <Mail size={16} /> {viewProfile.email || appUser.email}
              </div>
              <div className="flex items-center gap-2 break-words">
                <ShieldCheck size={16} /> {t('profile.secure')}
              </div>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {t('profile.badges')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {appUser.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className="border-teal/20 bg-teal/10 text-teal dark:border-teal-500/40 dark:bg-teal-500/20 dark:text-teal-200"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-base">{t('profile.preferences')}</CardTitle>
            {!isEditing && (
              <Button size="sm" variant="outline" onClick={handleEdit} disabled={isLoading}>
                {t('profile.edit')}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-slate-500 dark:text-slate-300">{t('common.loading')}</p>
            ) : (
              <>
                {error && <p className="text-xs text-red-500">{error}</p>}
                {success && <p className="text-xs text-emerald-600">{success}</p>}
                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {t('profile.fullName')}
                        </label>
                        <Input {...register('name')} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          {t('profile.email')}
                        </label>
                        <Input type="email" {...register('email')} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {t('profile.goals')}
                      </label>
                      <Textarea {...register('goals')} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {t('profile.focus')}
                      </label>
                      <Textarea {...register('focusAreas')} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" type="submit" disabled={isSaving}>
                        {isSaving ? t('profile.saving') : t('profile.save')}
                      </Button>
                      <Button size="sm" variant="ghost" type="button" onClick={handleCancel}>
                        {t('profile.cancel')}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('profile.fullName')}
                      </p>
                      <p className="text-slate-700 dark:text-slate-100">
                        {viewProfile.name || t('profile.empty')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('profile.email')}
                      </p>
                      <p className="text-slate-700 dark:text-slate-100">
                        {viewProfile.email || t('profile.empty')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('profile.goals')}
                      </p>
                      <p className="text-slate-700 dark:text-slate-100">
                        {viewProfile.goals || t('profile.empty')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {t('profile.focus')}
                      </p>
                      <p className="text-slate-700 dark:text-slate-100">
                        {viewProfile.focusAreas || t('profile.empty')}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
