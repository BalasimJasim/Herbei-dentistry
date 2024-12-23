import './TeamMember.css'

const TeamMember = ({ name, role, image, qualifications, description }) => {
  return (
    <div className="team-member">
      <div className="member-image">
        <img src={image} alt={name} />
      </div>
      <div className="member-info">
        <h3>{name}</h3>
        <p className="role">{role}</p>
        <p className="qualifications">{qualifications}</p>
        <p className="description">{description}</p>
      </div>
    </div>
  )
}

export default TeamMember 