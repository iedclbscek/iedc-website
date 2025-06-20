import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const communities = [
  {
    name: "Mulearn",
    description: "Learning community focused on peer learning and skill development",
    icon: "🎓",
    path: "/communities/mulearn"
  },
  {
    name: "Thinkerhub",
    description: "Innovation and technology learning community",
    icon: "💡",
    path: "/communities/thinkerhub"
  },
  {
    name: "Cyber",
    description: "Cybersecurity and digital safety community",
    icon: "🔒",
    path: "/communities/cyber"
  },
  {
    name: "Floss",
    description: "Free/Libre and Open Source Software community",
    icon: "🔓",
    path: "/communities/floss"
  },
  {
    name: "MLSA",
    description: "Microsoft Learn Student Ambassadors",
    icon: "📱",
    path: "/communities/mlsa"
  },
  {
    name: "Space",
    description: "Space technology and astronomy enthusiasts",
    icon: "🚀",
    path: "/communities/space"
  },
  {
    name: "GDG",
    description: "Google Developer Groups community",
    icon: "🌐",
    path: "/communities/gdg"
  },
  {
    name: "ED club",
    description: "Entrepreneurship Development club",
    icon: "💼",
    path: "/communities/ed-club"
  },
  {
    name: "YIP club",
    description: "Young Innovators Program club",
    icon: "✨",
    path: "/communities/yip-club"
  },
  {
    name: "Robotics",
    description: "Robotics and automation community",
    icon: "🤖",
    path: "/communities/robotics"
  },
  {
    name: "FSA club",
    description: "Firefox Student Ambassadors club",
    icon: "🦊",
    path: "/communities/fsa-club"
  },
  {
    name: "KBA",
    description: "Kerala Blockchain Academy community",
    icon: "⛓️",
    path: "/communities/kba"
  },
  {
    name: "Coders",
    description: "Programming and coding community",
    icon: "💻",
    path: "/communities/coders"
  },
  {
    name: "WOW",
    description: "Women in Tech community",
    icon: "👩‍💻",
    path: "/communities/wow"
  },
  {
    name: "AWS club",
    description: "Amazon Web Services community",
    icon: "☁️",
    path: "/communities/aws-club"
  }
];

const CommunitiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Our Communities</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our diverse range of technology and innovation communities.
            Each community offers unique opportunities to learn, grow, and contribute
            to exciting projects and initiatives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {communities.map((community, index) => (
            <motion.div
              key={community.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={community.path}>
                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 h-full cursor-pointer transform hover:-translate-y-1">
                  <div className="text-4xl mb-4">{community.icon}</div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{community.name}</h3>
                  <p className="text-gray-600">{community.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunitiesPage; 