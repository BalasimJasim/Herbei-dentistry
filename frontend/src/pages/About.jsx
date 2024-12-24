import { Helmet } from 'react-helmet-async'
import TeamMember from '../components/TeamMember'
import './About.css'

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Herbie Dental Clinic</title>
        <meta
          name="description"
          content="Learn about Herbie Dental Clinic's experienced team, our mission, and our commitment to providing exceptional dental care."
        />
      </Helmet>

      <section className="about-hero">
        <div className="container">
          <h1>About Herbie Dental Clinic</h1>
          <p className="lead">Providing Quality Dental Care Since 2020</p>
        </div>
      </section>

      <section className="mission-values">
        <div className="container">
          <div className="mission-box">
            <h2>Our Mission</h2>
            <p>
              To provide exceptional dental care in a comfortable and welcoming
              environment, ensuring every patient achieves optimal oral health
              through personalized treatment plans and education.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <h3>Excellence</h3>
              <p>
                Delivering the highest standard of dental care using
                cutting-edge technology
              </p>
            </div>
            <div className="value-card">
              <h3>Compassion</h3>
              <p>
                Treating every patient with empathy, understanding, and respect
              </p>
            </div>
            <div className="value-card">
              <h3>Integrity</h3>
              <p>
                Maintaining honest and transparent relationships with our
                patients
              </p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>
                Staying current with the latest dental techniques and
                technologies
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <TeamMember key={member.id} {...member} />
            ))}
          </div>
        </div>
      </section>

      <section className="clinic-tour">
        <div className="container">
          <h2>Tour Our Facility</h2>
          <div className="clinic-gallery">
            {clinicImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <img src={image.url} alt={image.alt} />
                <p>{image.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

const teamMembers = [
  {
    id: 1,
    name: 'Dr. Sarah Herbie',
    role: 'Lead Dentist',
    image: '/images/team/dr-sarah.jpg',
    qualifications: 'DDS, FICOI',
    description: 'Dr. Sarah brings over 15 years of experience in general and cosmetic dentistry.'
  },
  {
    id: 2,
    name: 'Dr. James Wilson',
    role: 'Orthodontist',
    image: '/images/team/dr-james.jpg',
    qualifications: 'DMD, MS',
    description: 'Specializing in orthodontics with expertise in modern bracing techniques.'
  },
  // Add more team members...
]

const clinicImages = [
  {
    id: 1,
    url: '/images/clinic/reception.jpg',
    alt: 'Modern reception area',
    description: 'Our welcoming reception area'
  },
  {
    id: 2,
    url: '/images/clinic/treatment-room.jpg',
    alt: 'State-of-the-art treatment room',
    description: 'Advanced treatment rooms equipped with the latest technology'
  },
  // Add more clinic images...
]

export default About 