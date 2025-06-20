import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaLinkedin, FaGithub } from 'react-icons/fa';
import { communityData } from '../data/communitiesData';

const CommunityPage = () => {
  const { id } = useParams();
  const community = communityData[id] || {
    name: "Community Not Found",
    description: "This community page does not exist.",
    icon: "❓",
    longDescription: "Please check the URL or go back to the communities page.",
    activities: [],
    achievements: [],
    contact: {
      email: "",
      coordinator: ""
    }
  };

  return (
    <div className="min-h-screen bg-primary/5">
      {/* Hero section */}
      <section className="bg-accent/10 pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/communities" className="inline-flex items-center text-accent hover:text-accent-dark mb-8 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Communities
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-6xl mb-4 mx-auto">{community.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-dark mb-4">{community.name}</h1>
            <div className="w-20 h-1 bg-accent mb-6 mx-auto"></div>
            <p className="text-lg text-text-light leading-relaxed max-w-3xl mx-auto">
              {community.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Community content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-text-dark mb-4">About</h2>
                <p className="text-text-light mb-6">{community.longDescription}</p>

                {community.whatWeProvide && (
                  <>
                    <h2 className="text-2xl font-bold text-text-dark mb-4">{community.whatWeProvide.title}</h2>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      {community.whatWeProvide.items.map((item, index) => (
                        <div key={index} className="bg-primary/10 rounded-lg p-4">
                          <h3 className="font-semibold text-text-dark mb-2">{item.name}</h3>
                          <p className="text-text-light">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {community.joinUs && (
                  <>
                    <h2 className="text-2xl font-bold text-text-dark mb-4">Join Us</h2>
                    <div className="bg-accent/10 rounded-lg p-6 mb-6">
                      <p className="text-text-dark">{community.joinUs}</p>
                    </div>
                  </>
                )}

                {community.whyWeDoIt && (
                  <>
                    <h2 className="text-2xl font-bold text-text-dark mb-4">Why We Do It</h2>
                    <p className="text-text-light mb-6">{community.whyWeDoIt}</p>
                  </>
                )}

                {community.whatWeDo && (
                  <>
                    <h2 className="text-2xl font-bold text-text-dark mb-4">What We Do</h2>
                    <p className="text-text-light mb-6">{community.whatWeDo}</p>
                  </>
                )}

                {community.vision && (
                  <>
                    <h2 className="text-2xl font-bold text-text-dark mb-4">Vision</h2>
                    <p className="text-text-light mb-6">{community.vision}</p>
                  </>
                )}

                {community.mission && (
                  <>
                    <h2 className="text-2xl font-bold text-text-dark mb-4">Mission</h2>
                    <p className="text-text-light mb-6">{community.mission}</p>
                  </>
                )}

                <h2 className="text-2xl font-bold text-text-dark mb-4">Activities</h2>
                <ul className="list-disc list-inside text-text-light space-y-2 mb-6">
                  {community.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-text-dark mb-4">Achievements</h2>
                <ul className="list-disc list-inside text-text-light space-y-2 mb-8">
                  {community.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>

                {community.execomTeam && community.execomTeam.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-text-dark mb-6">Execom Team</h2>
                    <div className="space-y-4">
                      {community.execomTeam.map((member, index) => (
                        <div key={index} className="bg-primary/10 rounded-lg p-4 flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                              }}
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-semibold text-lg text-text-dark">{member.name}</h3>
                            <p className="text-text-light">{member.role}</p>
                            <p className="text-sm text-accent">{member.contact}</p>
                            <div className="flex space-x-3 mt-2">
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent hover:text-accent-dark"
                                >
                                  <FaLinkedin size={20} />
                                </a>
                              )}
                              {member.github && member.github !== "#" && (
                                <a
                                  href={member.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-text-light hover:text-text-dark"
                                >
                                  <FaGithub size={20} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-6 bg-primary/10 rounded-lg">
                  <h2 className="text-xl font-bold text-text-dark mb-4">Contact</h2>
                  {community.execomTeam && community.execomTeam.length > 0 ? (
                    <>
                      <p className="text-text-light">Coordinator: {community.execomTeam[0].name}</p>
                      <p className="text-text-light">Email: {community.execomTeam[0].contact}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-text-light">Coordinator: {community.contact.coordinator}</p>
                      <p className="text-text-light">Email: {community.contact.email}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
