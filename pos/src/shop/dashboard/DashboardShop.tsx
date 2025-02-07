import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const dataPie = [
    { name: "Electronics", value: 400 },
    { name: "Groceries", value: 300 },
    { name: "Clothing", value: 300 },
    { name: "Other", value: 200 }
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const dataBar = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 2000 },
    { name: "Apr", sales: 2780 }
];

const DashboardShop: React.FC = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-5">
                <h2 className="text-xl font-semibold mb-5">Shop Dashboard</h2>
                <ul>
                    <li className="mb-3"><a href="#" className="text-gray-700 hover:text-blue-500">Overview</a></li>
                    <li className="mb-3"><a href="#" className="text-gray-700 hover:text-blue-500">Sales</a></li>
                    <li className="mb-3"><a href="#" className="text-gray-700 hover:text-blue-500">Inventory</a></li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Navbar */}
                <header className="bg-white shadow-md p-4 mb-6 flex justify-between">
                    <h1 className="text-xl font-semibold">General Shop Dashboard</h1>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">Logout</button>
                </header>

                {/* Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-5 shadow rounded-lg">
                        <h3 className="text-lg font-semibold">Total Sales</h3>
                        <p className="text-gray-600">$50,000</p>
                    </div>
                    <div className="bg-white p-5 shadow rounded-lg">
                        <h3 className="text-lg font-semibold">Total Products</h3>
                        <p className="text-gray-600">1,200</p>
                    </div>
                    <div className="bg-white p-5 shadow rounded-lg">
                        <h3 className="text-lg font-semibold">Total Customers</h3>
                        <p className="text-gray-600">450</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pie Chart */}
                    <div className="bg-white p-5 shadow rounded-lg flex justify-center">
                        <PieChart width={400} height={400}>
                            <Pie data={dataPie} cx={200} cy={200} innerRadius={60} outerRadius={100} fill="#8884d8" dataKey="value">
                                {dataPie.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white p-5 shadow rounded-lg">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardShop;
