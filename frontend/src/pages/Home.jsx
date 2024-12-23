import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Home.css'

const Home = () => {
  const { t } = useTranslation()

  return (
    <>
      <Helmet>
        <title>Herbie Dental Clinic - Your Trusted Dental Care Provider</title>
        <meta 
          name="description" 
          content="Welcome to Herbie Dental Clinic. We provide comprehensive dental care services including general dentistry, cosmetic dentistry, and emergency dental care."
        />
      </Helmet>

      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Herbie Dental</h1>
          <p>Experience exceptional dental care with our expert team</p>
          <Link to="/appointments" className="cta-button">
            Book Your Appointment
          </Link>
        </div>
      </section>

      <section className="about-preview">
        <h2>Expert Dental Care You Can Trust</h2>
        <p>
          At Herbie Dental Clinic, we combine modern technology with compassionate
          care to provide you with the best dental experience possible.
        </p>
        <Link to="/about" className="learn-more">
          Learn More About Us
        </Link>
      </section>

      <section className="services-highlight">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <img src={service.icon} alt={service.name} />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <Link to={`/services#${service.id}`}>Learn More</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Patients Say</h2>
        <div className="testimonials-carousel">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <p>"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

const services = [
  {
    id: 'general-dentistry',
    name: 'General Dentistry',
    description: 'Comprehensive dental care for the whole family',
    icon: '/icons/general-dentistry.svg'
  },
  {
    id: 'cosmetic-dentistry',
    name: 'Cosmetic Dentistry',
    description: 'Transform your smile with our aesthetic treatments',
    icon: '/icons/cosmetic-dentistry.svg'
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics',
    description: 'Achieve the perfect alignment for your teeth',
    icon: '/icons/orthodontics.svg'
  }
]

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    text: 'The best dental experience I\'ve ever had. The staff is incredibly professional and caring.',
    date: 'March 2024'
  },
  {
    id: 2,
    name: 'Michael Chen',
    text: 'Dr. Herbie and the team made my dental anxiety disappear. Highly recommended!',
    date: 'February 2024'
  }
]

export default Home 