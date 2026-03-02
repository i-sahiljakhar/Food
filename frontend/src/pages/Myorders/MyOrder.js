

// import React, { useContext, useEffect, useState } from 'react';
// import './MyOrder.css';
// import axios from 'axios';
// import { StoreContext } from '../../context/StoreContext';
// import { assets } from '../../assets/assets';

// function MyOrder() {
//     const { url, token } = useContext(StoreContext);
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [trackingOrder, setTrackingOrder] = useState(null); // For tracking modal

//     const fetchOrders = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.post(
//                 url + '/api/order/userorders',
//                 {},
//                 {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 }
//             );

//             if (response.data.success) {
//                 setData(response.data.data);
//                 console.log("Orders fetched:", response.data.data);
//             }
//         } catch (error) {
//             console.error("Error fetching orders:", error);
//             if (error.response?.status === 401) {
//                 alert("Session expired. Please login again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

  
//     const trackOrder = (order) => {
//         console.log("Tracking order:", order);
//         setTrackingOrder(order);
        
       
//         alert(`
//             Order Tracking:
//             Order ID: ${order._id}
//             Status: ${order.status}
//             Payment: ${order.paymentStatus || 'Paid'}
//             Items: ${order.items.length}
//             Total: ₹${order.amount}
//         `);
//     };

//     const getStatusColor = (status) => {
//         switch(status) {
//             case 'Food Processing': return '#ffa500';
//             case 'Out for Delivery': return '#3498db'; 
//             case 'Delivered': return '#2ecc71';
//             default: return '#666';
//         }
//     };

//     const getStatusIcon = (status) => {
//         switch(status) {
//             case 'Food Processing': return '🔪';
//             case 'Out for Delivery': return '🚚';
//             case 'Delivered': return '✅';
//             default: return '📦';
//         }
//     };

//     useEffect(() => {
//         if (token) {
//             fetchOrders();
//         }
//     }, [token]);

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <div className="spinner"></div>
//                 <p>Loading your orders...</p>
//             </div>
//         );
//     }

//     return (
//         <div className='my-orders'>
//             <h2>My Orders</h2>
            
//             {data.length === 0 ? (
//                 <div className="no-orders">
//                     <img src={assets.parcel_icon} alt="no orders" />
//                     <p>No orders found</p>
//                     <button onClick={() => window.location.href = '/'}>
//                         Browse Menu
//                     </button>
//                 </div>
//             ) : (
//                 <div className='orders-container'>
//                     {data.map((order, index) => (
//                         <div key={index} className='order-card'>
//                             <div className="order-header">
//                                 <img src={assets.parcel_icon} alt='parcel' className="order-icon" />
//                                 <span className="order-date">
//                                     {new Date(order.createdAt).toLocaleDateString()}
//                                 </span>
//                             </div>
                            
//                             <div className="order-body">
//                                 <div className="order-items">
//                                     <h4>Items:</h4>
//                                     <p>
//                                         {order.items.map((item, idx) => (
//                                             <span key={idx} className="order-item">
//                                                 {item.name} x {item.quantity}
//                                                 {idx < order.items.length - 1 ? ', ' : ''}
//                                             </span>
//                                         ))}
//                                     </p>
//                                 </div>
                                
//                                 <div className="order-details-grid">
//                                     <div className="detail-item">
//                                         <span className="detail-label">Order ID:</span>
//                                         <span className="detail-value">{order._id.slice(-8)}</span>
//                                     </div>
                                    
//                                     <div className="detail-item">
//                                         <span className="detail-label">Total Amount:</span>
//                                         <span className="detail-value price">₹{order.amount}</span>
//                                     </div>
                                    
//                                     <div className="detail-item">
//                                         <span className="detail-label">Items Count:</span>
//                                         <span className="detail-value">{order.items.length}</span>
//                                     </div>
                                    
//                                     <div className="detail-item">
//                                         <span className="detail-label">Payment:</span>
//                                         <span className={`detail-value payment-status ${order.paymentStatus}`}>
//                                             {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
//                                         </span>
//                                     </div>
                                    
//                                     <div className="detail-item status-item">
//                                         <span className="detail-label">Status:</span>
//                                         <span 
//                                             className="status-badge"
//                                             style={{ backgroundColor: getStatusColor(order.status) }}
//                                         >
//                                             {getStatusIcon(order.status)} {order.status}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <div className="order-footer">
//                                 <button 
//                                     onClick={() => trackOrder(order)}
//                                     className="track-btn"
//                                 >
//                                     📍 Track Order
//                                 </button>
//                                 <button 
//                                     onClick={fetchOrders}
//                                     className="refresh-btn"
//                                     title="Refresh orders"
//                                 >
//                                     🔄
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

           
//             {trackingOrder && (
//                 <div className="tracking-modal" onClick={() => setTrackingOrder(null)}>
//                     <div className="modal-content" onClick={e => e.stopPropagation()}>
//                         <h3>Track Order</h3>
//                         <div className="tracking-details">
//                             <p><strong>Order ID:</strong> {trackingOrder._id}</p>
//                             <p><strong>Status:</strong> 
//                                 <span className="status-badge" style={{backgroundColor: getStatusColor(trackingOrder.status), marginLeft: '10px'}}>
//                                     {getStatusIcon(trackingOrder.status)} {trackingOrder.status}
//                                 </span>
//                             </p>
//                             <p><strong>Items:</strong> {trackingOrder.items.length}</p>
//                             <p><strong>Total:</strong> ₹{trackingOrder.amount}</p>
//                             <p><strong>Order Date:</strong> {new Date(trackingOrder.createdAt).toLocaleString()}</p>
                            
                          
//                             <div className="tracking-timeline">
//                                 <div className={`timeline-step ${trackingOrder.status !== 'Food Processing' ? 'completed' : 'active'}`}>
//                                     <span className="step-icon">🔪</span>
//                                     <span className="step-label">Processing</span>
//                                 </div>
//                                 <div className={`timeline-step ${trackingOrder.status === 'Out for Delivery' ? 'active' : ''} ${trackingOrder.status === 'Delivered' ? 'completed' : ''}`}>
//                                     <span className="step-icon">🚚</span>
//                                     <span className="step-label">Out for Delivery</span>
//                                 </div>
//                                 <div className={`timeline-step ${trackingOrder.status === 'Delivered' ? 'active completed' : ''}`}>
//                                     <span className="step-icon">✅</span>
//                                     <span className="step-label">Delivered</span>
//                                 </div>
//                             </div>
//                         </div>
//                         <button onClick={() => setTrackingOrder(null)} className="close-modal">Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default MyOrder;

import React, { useContext, useEffect, useState, useCallback } from 'react';
import './MyOrder.css';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets';

function MyOrder() {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trackingOrder, setTrackingOrder] = useState(null);

    // ✅ Fixed: useCallback with dependencies
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                url + '/api/order/userorders',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setData(response.data.data);
                console.log("Orders fetched:", response.data.data);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            if (error.response?.status === 401) {
                alert("Session expired. Please login again.");
            }
        } finally {
            setLoading(false);
        }
    }, [url, token]); // ✅ Dependencies added

    // ✅ Fixed: useEffect with proper dependencies
    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token, fetchOrders]); // ✅ fetchOrders added as dependency

    const trackOrder = (order) => {
        console.log("Tracking order:", order);
        setTrackingOrder(order);
        
        alert(`
            Order Tracking:
            Order ID: ${order._id}
            Status: ${order.status}
            Payment: ${order.paymentStatus || 'Paid'}
            Items: ${order.items.length}
            Total: ₹${order.amount}
        `);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Food Processing': return '#ffa500';
            case 'Out for Delivery': return '#3498db'; 
            case 'Delivered': return '#2ecc71';
            default: return '#666';
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Food Processing': return '🔪';
            case 'Out for Delivery': return '🚚';
            case 'Delivered': return '✅';
            default: return '📦';
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            
            {data.length === 0 ? (
                <div className="no-orders">
                    <img src={assets.parcel_icon} alt="no orders" />
                    <p>No orders found</p>
                    <button onClick={() => window.location.href = '/'}>
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className='orders-container'>
                    {data.map((order, index) => (
                        <div key={index} className='order-card'>
                            <div className="order-header">
                                <img src={assets.parcel_icon} alt='parcel' className="order-icon" />
                                <span className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="order-body">
                                <div className="order-items">
                                    <h4>Items:</h4>
                                    <p>
                                        {order.items.map((item, idx) => (
                                            <span key={idx} className="order-item">
                                                {item.name} x {item.quantity}
                                                {idx < order.items.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </p>
                                </div>
                                
                                <div className="order-details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Order ID:</span>
                                        <span className="detail-value">{order._id.slice(-8)}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Total Amount:</span>
                                        <span className="detail-value price">₹{order.amount}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Items Count:</span>
                                        <span className="detail-value">{order.items.length}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Payment:</span>
                                        <span className={`detail-value payment-status ${order.paymentStatus}`}>
                                            {order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                        </span>
                                    </div>
                                    
                                    <div className="detail-item status-item">
                                        <span className="detail-label">Status:</span>
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {getStatusIcon(order.status)} {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="order-footer">
                                <button 
                                    onClick={() => trackOrder(order)}
                                    className="track-btn"
                                >
                                    📍 Track Order
                                </button>
                                <button 
                                    onClick={fetchOrders}
                                    className="refresh-btn"
                                    title="Refresh orders"
                                >
                                    🔄
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {trackingOrder && (
                <div className="tracking-modal" onClick={() => setTrackingOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Track Order</h3>
                        <div className="tracking-details">
                            <p><strong>Order ID:</strong> {trackingOrder._id}</p>
                            <p><strong>Status:</strong> 
                                <span className="status-badge" style={{backgroundColor: getStatusColor(trackingOrder.status), marginLeft: '10px'}}>
                                    {getStatusIcon(trackingOrder.status)} {trackingOrder.status}
                                </span>
                            </p>
                            <p><strong>Items:</strong> {trackingOrder.items.length}</p>
                            <p><strong>Total:</strong> ₹{trackingOrder.amount}</p>
                            <p><strong>Order Date:</strong> {new Date(trackingOrder.createdAt).toLocaleString()}</p>
                            
                            <div className="tracking-timeline">
                                <div className={`timeline-step ${trackingOrder.status !== 'Food Processing' ? 'completed' : 'active'}`}>
                                    <span className="step-icon">🔪</span>
                                    <span className="step-label">Processing</span>
                                </div>
                                <div className={`timeline-step ${trackingOrder.status === 'Out for Delivery' ? 'active' : ''} ${trackingOrder.status === 'Delivered' ? 'completed' : ''}`}>
                                    <span className="step-icon">🚚</span>
                                    <span className="step-label">Out for Delivery</span>
                                </div>
                                <div className={`timeline-step ${trackingOrder.status === 'Delivered' ? 'active completed' : ''}`}>
                                    <span className="step-icon">✅</span>
                                    <span className="step-label">Delivered</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setTrackingOrder(null)} className="close-modal">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyOrder;