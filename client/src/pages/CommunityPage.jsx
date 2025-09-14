import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaLinkedin, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { communityData } from '../data/communitiesData';
import CommunitySection from '../components/community/CommunitySection';
import CommunityGallery from '../components/community/CommunityGallery';
import { getSectionConfig } from '../utils/communityConfig';

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
    },
    execomTeam: []
  };

  // Get dynamic sections configuration
  const sections = getSectionConfig(community);

  return (
    <div className="min-h-screen bg-primary/5">
      {/* Hero section */}
      <section className="bg-accent/10 pt-24 md:pt-32 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/nexus" className="inline-flex items-center text-accent hover:text-accent-dark mb-8 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Nexus
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
                {/* Dynamic sections mapping */}
                {sections.map((section, index) => (
                  <CommunitySection
                    key={index}
                    title={section.title}
                    content={section.content}
                    type={section.type}
                  />
                ))}
              </div>

              <div>
                {community.achievements && community.achievements.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-text-dark mb-4">Achievements</h2>
                    <ul className="list-disc list-inside text-text-light space-y-2 mb-8">
                      {community.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </>
                )}

                {community.execomTeam && community.execomTeam.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-text-dark mb-6">Execom Team</h2>
                    <div className="space-y-4">
                      {community.execomTeam.map((member, index) => (
                        <div key={index} className="bg-primary/10 rounded-lg p-4 flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            <img
                              src={member.image || `/img/communities/${id}/execom/${member.name.toLowerCase().replace(/\s+/g, '_')}.jpg`}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                // Try alternative image formats and fallback to avatar
                                const altFormats = ['jpeg', 'png', 'webp'];
                                const baseName = member.name.toLowerCase().replace(/\s+/g, '_');
                                let formatIndex = 0;
                                
                                const tryNextFormat = () => {
                                  if (formatIndex < altFormats.length) {
                                    e.target.src = `/img/communities/${id}/execom/${baseName}.${altFormats[formatIndex]}`;
                                    formatIndex++;
                                  } else {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`;
                                  }
                                };
                                
                                e.target.onerror = tryNextFormat;
                                tryNextFormat();
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
                                  title="LinkedIn"
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
                                  title="GitHub"
                                >
                                  <FaGithub size={20} />
                                </a>
                              )}
                              {member.fossUnited && (
                                <a
                                  href={member.fossUnited}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-orange-500 hover:text-orange-600"
                                  title="FOSS United Profile"
                                >
                                  <FaExternalLinkAlt size={18} />
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
                  {/* Prioritize contact object over execomTeam */}
                  {community.contact && (community.contact.coordinator || community.contact.email) ? (
                    <>
                      <p className="text-text-light">Coordinator: {community.contact.coordinator}</p>
                      <p className="text-text-light">Email: {community.contact.email}</p>
                    </>
                  ) : community.execomTeam && community.execomTeam.length > 0 ? (
                    <>
                      <p className="text-text-light">Coordinator: {community.execomTeam[0].name}</p>
                      <p className="text-text-light">Email: {community.execomTeam[0].contact}</p>
                    </>
                  ) : (
                    <p className="text-text-light">Contact information not available</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Community Gallery */}
            <CommunityGallery communityId={id} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
