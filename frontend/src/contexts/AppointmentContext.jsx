import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const AppointmentContext = createContext()

export const AppointmentProvider = ({ children }) => {
  const [appointmentData, setAppointmentData] = useState({
    selectedDate: null,
    selectedTime: null,
    selectedService: null,
    duration: null,
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferredContact: 'email'
    },
    insuranceInfo: {
      isNewPatient: 'yes',
      provider: '',
      policyNumber: ''
    },
    notes: ''
  })

  const [step, setStep] = useState(1) // 1: Date/Time, 2: Service, 3: Personal Info, 4: Confirmation

  const updateAppointment = (data) => {
    setAppointmentData(prev => ({
      ...prev,
      ...data
    }))
  }

  const resetAppointment = () => {
    setAppointmentData({
      selectedDate: null,
      selectedTime: null,
      selectedService: null,
      duration: null,
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        preferredContact: 'email'
      },
      insuranceInfo: {
        isNewPatient: 'yes',
        provider: '',
        policyNumber: ''
      },
      notes: ''
    })
    setStep(1)
  }

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return !!(appointmentData.selectedDate && appointmentData.selectedTime)
      case 2:
        return !!appointmentData.selectedService
      case 3:
        return !!(
          appointmentData.personalInfo.firstName &&
          appointmentData.personalInfo.lastName &&
          appointmentData.personalInfo.email &&
          appointmentData.personalInfo.phone
        )
      default:
        return true
    }
  }

  return (
    <AppointmentContext.Provider
      value={{
        appointmentData,
        updateAppointment,
        resetAppointment,
        step,
        nextStep,
        prevStep,
        validateStep
      }}
    >
      {children}
    </AppointmentContext.Provider>
  )
}

AppointmentProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useAppointment = () => {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider')
  }
  return context
} 