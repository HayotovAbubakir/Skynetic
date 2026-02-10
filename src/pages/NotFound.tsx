import { useTranslation } from 'react-i18next'

export const NotFound = () => {
  const { t } = useTranslation()
  return <p className="text-sm text-slate-500 dark:text-slate-300">{t('common.notFound')}</p>
}
