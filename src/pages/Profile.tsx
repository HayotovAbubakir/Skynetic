import { useForm } from 'react-hook-form'
import { Mail, ShieldCheck, UserCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { useAppStore } from '../features/appStore'

interface ProfileFormValues {
  name: string
  email: string
  goals: string
  focusAreas: string
}

export const Profile = () => {
  const { t } = useTranslation()
  const { user } = useAppStore()
  const { register, handleSubmit } = useForm<ProfileFormValues>({
    defaultValues: {
      name: user.name,
      email: user.email,
      goals: t('profile.defaultGoals'),
      focusAreas: t('profile.defaultFocus'),
    },
  })

  const onSubmit = (values: ProfileFormValues) => {
    console.log('Profile updated', values)
  }

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
                style={{ backgroundColor: user.avatarColor }}
              >
                <UserCircle2 size={28} />
              </div>
              <div className="min-w-0">
                <p className="break-words font-display text-xl font-semibold text-ink dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{user.role}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 break-words">
                <Mail size={16} /> {user.email}
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
                {user.badges.map((badge) => (
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
          <CardHeader>
            <CardTitle className="text-base">{t('profile.preferences')}</CardTitle>
          </CardHeader>
          <CardContent>
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
              <Button size="sm" type="submit">
                {t('profile.save')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
