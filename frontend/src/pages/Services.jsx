import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import './Services.css'

const Services = () => {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(service => service.category === activeCategory)

  return (
    <>
      <Helmet>
        <title>Our Services - Herbie Dental Clinic</title>
        <meta 
          name="description" 
          content="Explore our comprehensive dental services including general dentistry, cosmetic procedures, orthodontics, and more."
        />
      </Helmet>

      <section className="services-hero">
        <div className="container">
          <h1>Our Dental Services</h1>
          <p className="lead">Comprehensive Care for Your Smile</p>
        </div>
      </section>

      <section className="services-filter">
        <div className="container">
          <div className="filter-buttons">
            <button 
              className={activeCategory === 'all' ? 'active' : ''} 
              onClick={() => setActiveCategory('all')}
            >
              All Services
            </button>
            <button 
              className={activeCategory === 'general' ? 'active' : ''} 
              onClick={() => setActiveCategory('general')}
            >
              General Dentistry
            </button>
            <button 
              className={activeCategory === 'cosmetic' ? 'active' : ''} 
              onClick={() => setActiveCategory('cosmetic')}
            >
              Cosmetic Dentistry
            </button>
            <button 
              className={activeCategory === 'specialty' ? 'active' : ''} 
              onClick={() => setActiveCategory('specialty')}
            >
              Specialty Services
            </button>
          </div>
        </div>
      </section>

      <section className="services-list">
        <div className="container">
          <div className="services-grid">
            {filteredServices.map(service => (
              <div key={service.id} className="service-card" id={service.id}>
                <div className="service-image">
                  <img src={service.image} alt={service.name} />
                </div>
                <div className="service-content">
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <div className="service-footer">
                    <span className="service-price">Starting from ${service.startingPrice}</span>
                    <button 
                      className="book-button"
                      onClick={() => window.location.href = `/appointments?service=${service.id}`}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-section">
        <div className="container">
          <h2>Insurance & Payment Options</h2>
          <p>We accept most major insurance providers and offer flexible payment plans.</p>
          <div className="insurance-logos">
            {insuranceProviders.map(provider => (
              <img 
                key={provider.id} 
                src={provider.logo} 
                alt={provider.name} 
                title={provider.name} 
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

const services = [
  {
    id: 'general-checkup',
    category: 'general',
    name: 'Dental Check-up & Cleaning',
    description: 'Comprehensive dental examination and professional cleaning to maintain optimal oral health.',
    image: '/images/services/checkup.jpg',
    features: [
      'Complete oral examination',
      'Professional teeth cleaning',
      'Digital X-rays',
      'Oral cancer screening',
      'Personalized care plan'
    ],
    startingPrice: 99
  },
  {
    id: 'teeth-whitening',
    category: 'cosmetic',
    name: 'Professional Teeth Whitening',
    description: 'Advanced whitening treatments to brighten your smile by several shades.',
    image: '/images/services/whitening.jpg',
    features: [
      'In-office power whitening',
      'Take-home whitening kits',
      'Custom-fitted trays',
      'Long-lasting results',
      'Safe and effective treatment'
    ],
    startingPrice: 299
  },
  // Add more services...
]

const insuranceProviders = [
  {
    id: 1,
    name: 'Delta Dental',
    logo: '/images/insurance/delta-dental.png'
  },
  {
    id: 2,
    name: 'Cigna',
    logo: '/images/insurance/cigna.png'
  },
  // Add more providers...
]

export default Services 