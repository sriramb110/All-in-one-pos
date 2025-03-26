import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { dashboard } from "../../common_component/services";
import { DashboardOrdersResponse } from "../Interface";


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A833B9", "#E63946"];

const dataBar = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 2000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 2780 },
    { name: "Jun", sales: 2780 }
];


const DashboardShop: React.FC = () => {

    const [pie, setPie] = useState<DashboardOrdersResponse | null>(null);

    useEffect(() => {
        dashboard()
            .then((res) => {
                const pieChart: DashboardOrdersResponse = res?.data
                setPie(pieChart);
            })
            .catch((error) => console.log(error));
    }, []);

    const dataPieToday = [
        { name: "Sales", value: pie?.today?.totalProductSales ?? 0 },
        { name: "Discount", value: pie?.today?.totalDiscount ?? 0 },
        { name: "OSB", value: pie?.today?.totalBalance ?? 0 },
        { name: "Orders", value: pie?.today?.orderCount ?? 0 },
    ];

    const dataPie7Days = [
        { name: "Sales", value: pie?.last7Days?.totalProductSales ?? 0 },
        { name: "Discount", value: pie?.last7Days?.totalDiscount ?? 0 },
        { name: "OSB", value: pie?.last7Days?.totalBalance ?? 0 },
        { name: "Orders", value: pie?.last7Days?.orderCount ?? 0 },
    ];

    const dataPie30Days = [
        { name: "Sales", value: pie?.last30Days?.totalProductSales ?? 0 },
        { name: "Discount", value: pie?.last30Days?.totalDiscount ?? 0 },
        { name: "OSB", value: pie?.last30Days?.totalBalance ?? 0 },
        { name: "Orders", value: pie?.last30Days?.orderCount ?? 0 },
    ];


    
    return (
        <div className="flex-1 bg-gray-100 overflow-auto">

            {/* Main Content */}
            <main className="flex-1 p-6">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Pie Chart */}
                    <div className="bg-white p-2 shadow rounded-lg flex flex-col justify-start">
                        <h1>Today</h1>
                        <PieChart width={400} height={400}>
                            <Pie data={dataPieToday} cx={200} cy={200} innerRadius={60} outerRadius={100} dataKey="value" label>
                                {dataPieToday.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" align="left" verticalAlign="bottom" />
                        </PieChart>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white p-2 shadow rounded-lg flex flex-col justify-start">
                        <h1>Last 7 Days</h1>
                        <PieChart width={400} height={400}>
                            <Pie data={dataPie7Days} cx={200} cy={200} innerRadius={60} outerRadius={100} dataKey="value" label>
                                {dataPie7Days.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" align="left" verticalAlign="bottom" />
                        </PieChart>
                    </div>

                    <div className="bg-white p-2 shadow rounded-lg flex flex-col justify-start">
                        <h1>Last 30 Days</h1>
                        <PieChart width={400} height={400}>
                            <Pie data={dataPie30Days} cx={200} cy={200} innerRadius={60} outerRadius={100} dataKey="value" label>
                                {dataPie30Days.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend layout="vertical" align="left" verticalAlign="bottom" />
                        </PieChart>
                    </div>
                    <div className="bg-white p-5 shadow rounded-lg">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="purchase" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
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
                    <div className="bg-white p-5 shadow rounded-lg">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataBar} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="New Customer" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardShop;
