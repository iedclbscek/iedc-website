import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaCircle, FaRoad, FaUser } from 'react-icons/fa';
import AuthContext from '../../contexts/AuthContext';
import execomService from '../../services/execomService';

const MotionDiv = motion.div;

const RoadmapSection = () => {
  const { user } = useContext(AuthContext);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadRoadmapData();
    }
  }, [user]);

  const loadRoadmapData = async () => {
    try {
      setLoading(true);
      const response = await execomService.getRoadmap();
      setRoadmapData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Don't show roadmap for non-authenticated users
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-text-light">Loading your personalized roadmap...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !roadmapData || !roadmapData.roadmap || roadmapData.roadmap.length === 0) {
    return null; // Don't show section if there's an error or no roadmap
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <FaRoad className="text-accent text-3xl mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-text-dark">
              Your Learning Roadmap
            </h2>
          </div>
          <div className="w-20 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-lg text-text-light max-w-3xl mx-auto">
            Personalized learning path based on your academic year - {roadmapData.yearLabel}
          </p>
          <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
            <div className="flex items-center">
              <FaUser className="text-accent mr-2" />
              <span className="text-text-light">Academic Year: {roadmapData.academicYear}</span>
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 mr-2" />
              <span className="text-text-light">Current Semester: {roadmapData.currentSemester}</span>
            </div>
          </div>
        </MotionDiv>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {roadmapData.roadmap.map((semester, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-xl shadow-lg p-8 border-l-4 ${
                  semester.semester === roadmapData.currentSemester
                    ? 'border-accent shadow-accent/10'
                    : 'border-gray-300'
                }`}
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4 ${
                      semester.semester === roadmapData.currentSemester
                        ? 'bg-accent'
                        : 'bg-gray-400'
                    }`}
                  >
                    {semester.semester}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text-dark">{semester.title}</h3>
                    <p className="text-sm text-text-light">
                      {semester.semester === roadmapData.currentSemester
                        ? 'Current Semester'
                        : `Semester ${semester.semester}`}
                    </p>
                  </div>
                  {semester.semester === roadmapData.currentSemester && (
                    <div className="ml-auto">
                      <span className="bg-accent text-white text-xs px-3 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  )}
                </div>

                <ul className="space-y-3">
                  {semester.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      {semester.semester === roadmapData.currentSemester ? (
                        <FaCircle className="text-accent text-sm mr-3 mt-1 flex-shrink-0" />
                      ) : semester.semester < roadmapData.currentSemester ? (
                        <FaCheckCircle className="text-green-500 text-sm mr-3 mt-1 flex-shrink-0" />
                      ) : (
                        <FaCircle className="text-gray-400 text-sm mr-3 mt-1 flex-shrink-0" />
                      )}
                      <span className={`text-sm leading-relaxed ${
                        semester.semester === roadmapData.currentSemester
                          ? 'text-text-dark font-medium'
                          : semester.semester < roadmapData.currentSemester
                          ? 'text-green-700'
                          : 'text-text-light'
                      }`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {semester.semester === roadmapData.currentSemester && (
                  <div className="mt-6 p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm text-accent font-medium">
                      🎯 Focus on these activities this semester to maximize your learning and growth!
                    </p>
                  </div>
                )}
              </MotionDiv>
            ))}
          </div>

          {/* Call to Action */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-text-dark mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-text-light mb-6">
                Join our communities, attend workshops, and connect with like-minded innovators to make the most of your IEDC experience.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/nexus"
                  className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-dark transition-colors font-medium"
                >
                  Explore Communities
                </a>
                <a
                  href="/events"
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  View Upcoming Events
                </a>
              </div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
