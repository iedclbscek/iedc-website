import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEye, FaEdit, FaCheck, FaTimes, FaClock, FaUser, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ProposeEventModal from '../components/ui/ProposeEventModal';

const ProposedEventsPage = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    proposedBy: 'all'
  });

  const isAdmin = user?.role === 'admin' || user?.role === 'nodal_officer';

  useEffect(() => {
    fetchProposals();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.proposedBy !== 'all') queryParams.append('proposedBy', filters.proposedBy);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/events/proposals?${queryParams}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setProposals(response.data.proposals);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to fetch event proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (proposalId, newStatus, reviewNotes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/events/proposals/${proposalId}/status`,
        { status: newStatus, reviewNotes },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success(`Proposal ${newStatus} successfully`);
        fetchProposals();
      }
    } catch (error) {
      console.error('Error updating proposal status:', error);
      toast.error('Failed to update proposal status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      implemented: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Proposals</h1>
          <p className="mt-2 text-sm text-gray-700">
            {isAdmin 
              ? 'Review and manage event proposals from team members'
              : 'Submit and track your event proposals'
            }
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowProposeModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2" />
            Propose Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="implemented">Implemented</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Workshop">Workshop</option>
              <option value="Bootcamp">Bootcamp</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Competition">Competition</option>
              <option value="Seminar">Seminar</option>
              <option value="Conference">Conference</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposed By
              </label>
              <select
                value={filters.proposedBy}
                onChange={(e) => setFilters(prev => ({ ...prev, proposedBy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Members</option>
                <option value="me">My Proposals</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No event proposals</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by proposing a new event.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowProposeModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FaPlus className="mr-2" />
                Propose Event
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proposed By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proposals.map((proposal) => (
                  <tr key={proposal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {proposal.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {proposal.shortDescription}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          <FaUser className="inline mr-1" />
                          {proposal.estimatedParticipants} participants
                          <FaClock className="inline ml-2 mr-1" />
                          {proposal.estimatedDuration}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {proposal.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proposal.proposerName}</div>
                      <div className="text-sm text-gray-500">{proposal.proposerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(proposal.proposedDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Proposed {formatDate(proposal.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
                        {proposal.status.replace('_', ' ').toUpperCase()}
                      </span>
                      {proposal.priority && proposal.priority !== 'medium' && (
                        <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(proposal.priority)}`}>
                          {proposal.priority.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        
                        {isAdmin && proposal.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(proposal._id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(proposal._id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Propose Event Modal */}
      <ProposeEventModal
        isOpen={showProposeModal}
        onClose={() => setShowProposeModal(false)}
        onProposalSubmitted={() => {
          fetchProposals();
          setShowProposeModal(false);
        }}
      />

      {/* Proposal Detail Modal */}
      {showDetailModal && selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">{selectedProposal.title}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status and basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedProposal.status)}`}>
                    {selectedProposal.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                  <span className="text-sm text-gray-900">{selectedProposal.category}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-sm text-gray-900">{selectedProposal.description}</p>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Target Audience</h3>
                  <p className="text-sm text-gray-900">{selectedProposal.targetAudience}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Duration</h3>
                  <p className="text-sm text-gray-900">{selectedProposal.estimatedDuration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Expected Participants</h3>
                  <p className="text-sm text-gray-900">{selectedProposal.estimatedParticipants}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Venue</h3>
                  <p className="text-sm text-gray-900">{selectedProposal.venue}</p>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Objectives</h3>
                <p className="text-sm text-gray-900">{selectedProposal.objectives}</p>
              </div>

              {/* Budget */}
              {selectedProposal.budget.estimated > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Budget</h3>
                  <p className="text-sm text-gray-900">₹{selectedProposal.budget.estimated}</p>
                  {selectedProposal.budget.breakdown && (
                    <p className="text-sm text-gray-600 mt-1">{selectedProposal.budget.breakdown}</p>
                  )}
                </div>
              )}

              {/* Proposer Info */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Proposed By</h3>
                <div className="text-sm text-gray-900">
                  <p>{selectedProposal.proposerName}</p>
                  <p className="text-gray-600">{selectedProposal.proposerEmail}</p>
                  {selectedProposal.proposerContact && (
                    <p className="text-gray-600">{selectedProposal.proposerContact}</p>
                  )}
                </div>
              </div>

              {/* Admin Actions */}
              {isAdmin && selectedProposal.status === 'pending' && (
                <div className="border-t pt-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedProposal._id, 'approved');
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedProposal._id, 'rejected');
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedProposal._id, 'under_review');
                        setShowDetailModal(false);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Mark Under Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposedEventsPage;
