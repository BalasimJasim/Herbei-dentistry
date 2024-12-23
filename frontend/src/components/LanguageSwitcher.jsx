import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import './LanguageSwitcher.css'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hu', name: 'Magyar', flag: '🇭🇺' }
  ]

  const changeLanguage = (lng) => {
    if (lng === i18n.language) return

    i18n.changeLanguage(lng)
    
    // Update URL to include language
    const pathWithoutLang = location.pathname.replace(/^\/[a-z]{2}/, '')
    const newPath = `/${lng}${pathWithoutLang || '/'}`
    navigate(newPath, { replace: true })
  }

  return (
    <div className="language-switcher">
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-selector"
        aria-label="Select Language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitcher 