import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isRTL } from '../utils/rtl'

const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const { lang } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Set HTML attributes
    document.documentElement.lang = i18n.language
    document.documentElement.dir = isRTL(i18n.language) ? 'rtl' : 'ltr'

    // Handle language from URL parameter
    if (lang && lang !== i18n.language && !location.pathname.includes(`/${lang}/${lang}`)) {
      i18n.changeLanguage(lang)
    }

    // Redirect to default language if no language in URL
    if (!lang && !location.pathname.startsWith(`/${i18n.language}`)) {
      const newPath = `/${i18n.language}${location.pathname}`
      navigate(newPath, { replace: true })
    }
  }, [lang, i18n, navigate, location])

  return children
}

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default LanguageProvider 