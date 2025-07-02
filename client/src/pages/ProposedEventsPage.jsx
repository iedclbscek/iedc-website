import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  User,
  Mail,
  Phone,
  Building,
  Target,
  DollarSign,
  Lightbulb,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProposedEventsPage = () => {
  const { api } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [reviewing, setReviewing] = useState(null);

  useEffect(() => {
    fetchProposals();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events/proposals', {
        params: {
          status: filters.status,
          limit: 100
        }
      });

      if (response.data.success) {
        let filteredProposals = response.data.proposals;
        
        // Apply search filter
        if (filters.search) {
          filteredProposals = filteredProposals.filter(proposal =>
            proposal.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            proposal.proposerName.toLowerCase().includes(filters.search.toLowerCase()) ||
            proposal.category.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setProposals(filteredProposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewProposal = async (proposalId, status, reviewNotes = '') => {
    try {
      setReviewing(proposalId);
      const response = await api.put(`/events/proposals/${proposalId}/review`, {
        status,
        reviewNotes
      });

      if (response.data.success) {
        // Update the proposal in the list
        setProposals(prev => prev.map(proposal => 
          proposal._id === proposalId 
            ? { ...proposal, status, reviewNotes, reviewed: true }
            : proposal
        ));
        
        alert(`Proposal ${status} successfully!`);
      }
    } catch (error) {
      console.error('Error reviewing proposal:', error);
      alert('Error reviewing proposal. Please try again.');
    } finally {
      setReviewing(null);
    }
  };

  const handleConvertToEvent = async (proposalId) => {
    try {
      setReviewing(proposalId);
      const response = await api.post(`/events/proposals/${proposalId}/convert`);

      if (response.data.success) {
        alert('Proposal converted to event successfully!');
        fetchProposals(); // Refresh the list
      }
    } catch (error) {
      console.error('Error converting proposal:', error);
      alert('Error converting proposal to event. Please try again.');
    } finally {
      setReviewing(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-gray-600">Loading proposals...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Proposed Events</h1>
            <p className="text-gray-600">Review and manage event proposals from the community</p>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            Total Proposals: {proposals.length}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {proposals.map(proposal => (
            <div
              key={proposal._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{proposal.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                    {proposal.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {proposal.proposerName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(proposal.submittedAt)}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2">{proposal.shortDescription}</p>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText size={16} />
                    {proposal.category}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    {formatDate(proposal.startDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    {proposal.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    {proposal.expectedParticipants || 'TBD'} participants
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Proposer Contact</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} />
                      {proposal.proposerEmail}
                    </div>
                    {proposal.proposerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        {proposal.proposerPhone}
                      </div>
                    )}
                    {proposal.organization && (
                      <div className="flex items-center gap-2">
                        <Building size={14} />
                        {proposal.organization}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProposal(proposal);
                      setShowDetailModal(true);
                    }}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  
                  {proposal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReviewProposal(proposal._id, 'under_review')}
                        disabled={reviewing === proposal._id}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleReviewProposal(proposal._id, 'approved')}
                        disabled={reviewing === proposal._id}
                        className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleReviewProposal(proposal._id, 'rejected')}
                        disabled={reviewing === proposal._id}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                      >
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                  
                  {proposal.status === 'approved' && (
                    <button
                      onClick={() => handleConvertToEvent(proposal._id)}
                      disabled={reviewing === proposal._id}
                      className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
                    >
                      <ArrowRight size={16} />
                      Convert to Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {proposals.length === 0 && !loading && (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals found</h3>
            <p className="text-gray-600">
              {filters.status !== 'all' || filters.search
                ? 'Try adjusting your filters'
                : 'No event proposals have been submitted yet'
              }
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedProposal && (
          <ProposalDetailModal 
            proposal={selectedProposal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedProposal(null);
            }}
            onReview={handleReviewProposal}
            onConvert={handleConvertToEvent}
            reviewing={reviewing}
          />
        )}
      </div>
    </div>
  );
};

// Detail Modal Component
const ProposalDetailModal = ({ proposal, onClose, onReview, onConvert, reviewing }) => {
  const [reviewNotes, setReviewNotes] = useState('');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Event Proposal Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{proposal.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {proposal.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{proposal.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar size={18} />
                Event Details
              </h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600">{proposal.category}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Start Date:</span>
                  <span className="ml-2 text-gray-600">{formatDate(proposal.startDate)}</span>
                </div>
                {proposal.endDate && (
                  <div>
                    <span className="font-medium text-gray-700">End Date:</span>
                    <span className="ml-2 text-gray-600">{formatDate(proposal.endDate)}</span>
                  </div>
                )}
                {proposal.startTime && (
                  <div>
                    <span className="font-medium text-gray-700">Time:</span>
                    <span className="ml-2 text-gray-600">
                      {proposal.startTime} {proposal.endTime && `- ${proposal.endTime}`}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">{proposal.location}</span>
                </div>
                {proposal.expectedParticipants && (
                  <div>
                    <span className="font-medium text-gray-700">Expected Participants:</span>
                    <span className="ml-2 text-gray-600">{proposal.expectedParticipants}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Proposer Info */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <User size={18} />
                Proposer Information
              </h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-600">{proposal.proposerName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-600">{proposal.proposerEmail}</span>
                </div>
                {proposal.proposerPhone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-600">{proposal.proposerPhone}</span>
                  </div>
                )}
                {proposal.organization && (
                  <div>
                    <span className="font-medium text-gray-700">Organization:</span>
                    <span className="ml-2 text-gray-600">{proposal.organization}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Submitted:</span>
                  <span className="ml-2 text-gray-600">{formatDate(proposal.submittedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(proposal.objectives || proposal.targetAudience || proposal.budget || proposal.requirements) && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lightbulb size={18} />
                Additional Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {proposal.objectives && (
                  <div>
                    <span className="font-medium text-gray-700">Objectives:</span>
                    <p className="mt-1 text-gray-600">{proposal.objectives}</p>
                  </div>
                )}
                {proposal.targetAudience && (
                  <div>
                    <span className="font-medium text-gray-700">Target Audience:</span>
                    <p className="mt-1 text-gray-600">{proposal.targetAudience}</p>
                  </div>
                )}
                {proposal.budget && (
                  <div>
                    <span className="font-medium text-gray-700">Budget:</span>
                    <p className="mt-1 text-gray-600">{proposal.budget}</p>
                  </div>
                )}
                {proposal.requirements && (
                  <div>
                    <span className="font-medium text-gray-700">Requirements:</span>
                    <p className="mt-1 text-gray-600">{proposal.requirements}</p>
                  </div>
                )}
              </div>
              
              {proposal.additionalNotes && (
                <div>
                  <span className="font-medium text-gray-700">Additional Notes:</span>
                  <p className="mt-1 text-gray-600">{proposal.additionalNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* Review Section */}
          {proposal.status === 'pending' && (
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Review Proposal</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes (optional)
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any notes about your review decision..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => onReview(proposal._id, 'under_review', reviewNotes)}
                    disabled={reviewing === proposal._id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => onReview(proposal._id, 'approved', reviewNotes)}
                    disabled={reviewing === proposal._id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReview(proposal._id, 'rejected', reviewNotes)}
                    disabled={reviewing === proposal._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Convert to Event */}
          {proposal.status === 'approved' && (
            <div className="border-t pt-6">
              <button
                onClick={() => onConvert(proposal._id)}
                disabled={reviewing === proposal._id}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <ArrowRight size={18} />
                Convert to Event
              </button>
              <p className="text-sm text-gray-600 mt-2">
                This will create a new event in draft status that can be further configured.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposedEventsPage;
