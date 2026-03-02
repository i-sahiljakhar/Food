import React, { useEffect, useState, useContext, useCallback } from 'react';
import './Orders.css';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { adminToken, url, adminLogout } = useContext(AdminContext);

    const fetchAllOrders = useCallback(async () => {
        if (!adminToken) {
            console.log('❌ No admin token found');
            toast.error("Please login first");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // Debugging
            console.log('🔍 Token being sent:', adminToken.substring(0, 30) + '...');
            console.log('🔍 Full URL:', `${url}/api/order/list`);
            
            const response = await axios.get(`${url}/api/order/list`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Orders response:', response.data);
            
            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                toast.error(response.data.message || "Error fetching orders");
            }
        } catch (error) {
            console.error('❌ Error fetching orders:', error);
            
            if (error.response) {
                console.log('❌ Error status:', error.response.status);
                console.log('❌ Error data:', error.response.data);
                
                if (error.response.status === 401) {
                    toast.error("Session expired. Please login again");
                    
                    // Logout and redirect
                    localStorage.removeItem("adminToken");
                    adminLogout();
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2000);
                } else if (error.response.status === 404) {
                    toast.error("API endpoint not found. Check backend routes");
                } else {
                    toast.error(error.response.data?.message || "Error fetching orders");
                }
            } else if (error.request) {
                toast.error("Cannot connect to server. Is backend running?");
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    }, [adminToken, url, adminLogout]);

    const statusHandler = async (event, orderId) => {
        if (!adminToken) {
            toast.error("Please login first");
            return;
        }

        try {
            const response = await axios.post(
                `${url}/api/order/status`,
                {
                    orderId,
                    status: event.target.value
                },
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success("Status updated");
                fetchAllOrders();
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Status update error:", error);
            
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again");
                adminLogout();
            } else {
                toast.error("Failed to update status");
            }
        }
    };

    useEffect(() => {
        if (adminToken) {
            fetchAllOrders();
        }
    }, [adminToken, fetchAllOrders]);

    if (!adminToken) {
        return (
            <div className='order add'>
                <h3>Please login to view orders</h3>
                <button onClick={() => window.location.href = "/login"}>
                    Go to Login
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='order add'>
                <h3>Orders</h3>
                <div className="loading-spinner">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className='order add'>
            <h3>Order Page</h3>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className='order-list'>
                    {orders.map((order, index) => (
                        <div key={order._id || index} className='order-item'>
                            <img src={assets.parcel_icon} alt='parcel' />
                            <div>
                                <p className='order-item-food'>
                                    {order.items?.map((item, itemIndex) => (
                                        <span key={itemIndex}>
                                            {item.name} x {item.quantity}
                                            {itemIndex !== order.items.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                <p className='order-item-name'>
                                    {order.address?.firstName} {order.address?.lastName}
                                </p>
                                <div className='order-item-address'>
                                    <p>{order.address?.street},</p>
                                    <p>
                                        {order.address?.city}, {order.address?.state}, 
                                        {order.address?.country}, {order.address?.zipcode}
                                    </p>
                                </div>
                                <p className='order-item-phone'>📞 {order.address?.phone}</p>
                            </div>
                            <p>Items: {order.items?.length || 0}</p>
                            <p>${order.amount}</p>
                            <select
                                onChange={(event) => statusHandler(event, order._id)}
                                value={order.status || 'Food Processing'}
                            >
                                <option value="Food Processing">Food Processing</option>
                                <option value="Out for Delivery">Out For Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;