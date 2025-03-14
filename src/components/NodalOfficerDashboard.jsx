import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const NodalOfficerDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [assignedLeads, setAssignedLeads] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: localStorage.getItem("token") },
                });
                setUser(data);
            } catch (error) {
                navigate("/login");
            }
        };
        fetchUser();
    }, [navigate]);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-blue-900 text-white p-6">
                <div className="flex flex-col items-center">
                    <img src="/img/profile-placeholder.png" alt="Profile" className="h-16 w-16 rounded-full mb-4" />
                    <p className="text-xl font-bold">{user.name}</p>
                    <p className="text-gray-300">{user.role}</p>
                </div>
                <nav className="mt-6">
                    <ul className="space-y-3">
                        <li><Link to="/nodal-dashboard" className="block py-2 hover:bg-blue-700 rounded">Home</Link></li>
                        <li><Link to="/events" className="block py-2 hover:bg-blue-700 rounded">Events</Link></li>
                        <li><Link to="/execom" className="block py-2 hover:text-blue-200">Execom</Link></li>
                        <li><Link to="/clubs" className="block py-2 hover:bg-blue-700 rounded">Clubs</Link></li>
                        <li><Link to="/profile-settings" className="block py-2 hover:text-blue-300">Profile Settings</Link></li>
                        <li><Link to="/others" className="block py-2 hover:text-blue-300">Others</Link></li>
                        <li>
                            <button onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("role");
                                navigate("/login");
                            }} className="w-full py-2 bg-red-600 rounded hover:bg-red-700 text-center">
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
                <p className="text-lg">Role: {user.role}</p>

                <section className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                    <p>Event list will be displayed here...</p>
                </section>

                <section className="mt-8">
                    <h2 className="text-lg font-semibold">Statistics</h2>
                    <ul className="mt-4">
                        <li>Total Events: 10</li>
                        <li>Leads Assigned: {assignedLeads.length}</li>
                    </ul>
                </section>
            </div>
        </div>
    );
};

export default NodalOfficerDashboard;
