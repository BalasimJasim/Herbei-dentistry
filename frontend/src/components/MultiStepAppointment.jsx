import { useTranslation } from 'react-i18next'
import { useAppointment } from '../contexts/AppointmentContext'
import AppointmentCalendar from './AppointmentCalendar'
import ServiceSelection from './ServiceSelection'
import PersonalInfoForm from './PersonalInfoForm'
import AppointmentSummary from './AppointmentSummary'
import './MultiStepAppointment.css'

const MultiStepAppointment = () => {
  const { t } = useTranslation()
  const { step, nextStep, prevStep, validateStep } = useAppointment()

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AppointmentCalendar />
      case 2:
        return <ServiceSelection />
      case 3:
        return <PersonalInfoForm />
      case 4:
        return <AppointmentSummary />
      default:
        return null
    }
  }

  return (
    <div className="multi-step-appointment">
      <div className="progress-bar">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`progress-step ${s === step ? 'active' : ''} ${
              s < step ? 'completed' : ''
            }`}
          >
            <div className="step-number">{s}</div>
            <div className="step-label">{t(`appointment.step${s}`)}</div>
          </div>
        ))}
      </div>

      <div className="step-content">{renderStep()}</div>

      <div className="step-navigation">
        {step > 1 && (
          <button className="prev-button" onClick={prevStep}>
            {t('common.previous')}
          </button>
        )}
        {step < 4 && (
          <button
            className="next-button"
            onClick={nextStep}
            disabled={!validateStep(step)}
          >
            {t('common.next')}
          </button>
        )}
      </div>
    </div>
  )
}

export default MultiStepAppointment 