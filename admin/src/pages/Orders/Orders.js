
// import React, { useEffect, useState } from 'react';
// import './Orders.css';
// import { assets } from '../../assets/assets';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// function Orders({ url }) {
//     const [orders, setOrders] = useState([]);

//     const fetchAllOrders = async () => {
//         try {
//             const response = await axios.get(url + '/api/order/list');
//             if (response.data.success) {
//                 setOrders(response.data.data);
//             } else {
//                 toast.error("Error");
//             }
//         } catch (error) {
//             console.error('Error fetching orders:', error);
//             toast.error("Error fetching orders");
//         }
//     }

//     const statusHandler = async (event,orderId)=>{
//      const response = await axios.post(url+"/api/order/status",{
//         orderId,
//         status:event.target.value
//      })
//      if (response.data.success) {
//         await fetchAllOrders()
//      }
//     }



//     useEffect(() => {
//         fetchAllOrders();
//     },[fetchAllOrders]);

//     return (
//         <div className='order add'>
//             <h3>Order Page</h3>
//             <div className='order-list'>
//                 {orders.map((order, index) => (
//                     <div key={index} className='order-item'>
//                         <img src={assets.parcel_icon} alt='' />
//                         <div>
//                             <p className='order-item-food'>
//                                 {order.items.map((item, itemIndex) => (
//                                     <span key={itemIndex}>
//                                         {item.name} x {item.quantity}
//                                         {itemIndex !== order.items.length - 1 && ', '}
//                                     </span>
//                                 ))}
//                             </p>
//                             <p className='order-item-name'>{order.address.firstName+" "+order.address.lastName}</p>
//                             <div className='order-item-address'>
//                                 <p>{order.address.street+","}</p>
//                                 <p>{order.address.city+", "+order.address.state+", "+order.address.country+", "+order.address.zipcode}</p>
//                             </div>
//                             <p className='order-item-phone'>{order.address.phone}</p>
//                         </div>
//                         <p>Items : {order.items.length}</p>
//                         <p>${order.amount}</p>
//                         <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
//                             <option value="Food Processing">Food Processing</option>
//                             <option value="Out for Delivery">Out For Delivery</option>
//                             <option value="Delivered">Delivered</option>
//                         </select>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default Orders;

// import React, { useEffect, useState, useCallback } from 'react';
// import './Orders.css';
// import { assets } from '../../assets/assets';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// function Orders({ url }) {
//   const [orders, setOrders] = useState([]);

//   const fetchAllOrders = useCallback(async () => {
//     try {
//       const response = await axios.get(url + '/api/order/list');
//       if (response.data.success) {
//         setOrders(response.data.data);
//       } else {
//         toast.error("Error");
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error("Error fetching orders");
//     }
//   }, [url]);

//   const statusHandler = async (event, orderId) => {
//     try {
//       const response = await axios.post(url + "/api/order/status", {
//         orderId,
//         status: event.target.value
//       });

//       if (response.data.success) {
//         fetchAllOrders();
//       }
//     } catch (error) {
//       toast.error("Failed to update status");
//     }
//   };

//   useEffect(() => {
//     fetchAllOrders();
//   }, [fetchAllOrders]);

//   return (
//     <div className='order add'>
//       <h3>Order Page</h3>
//       <div className='order-list'>
//         {orders.map((order, index) => (
//           <div key={index} className='order-item'>
//             <img src={assets.parcel_icon} alt='' />
//             <div>
//               <p className='order-item-food'>
//                 {order.items.map((item, itemIndex) => (
//                   <span key={itemIndex}>
//                     {item.name} x {item.quantity}
//                     {itemIndex !== order.items.length - 1 && ', '}
//                   </span>
//                 ))}
//               </p>

//               <p className='order-item-name'>
//                 {order.address.firstName} {order.address.lastName}
//               </p>

//               <div className='order-item-address'>
//                 <p>{order.address.street},</p>
//                 <p>
//                   {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
//                 </p>
//               </div>

//               <p className='order-item-phone'>{order.address.phone}</p>
//             </div>

//             <p>Items : {order.items.length}</p>
//             <p>${order.amount}</p>

//             <select
//               onChange={(event) => statusHandler(event, order._id)}
//               value={order.status}
//             >
//               <option value="Food Processing">Food Processing</option>
//               <option value="Out for Delivery">Out For Delivery</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Orders;



import React, { useEffect, useState, useContext, useCallback } from 'react';
import './Orders.css';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';

function Orders({ url }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { adminToken } = useContext(AdminContext);  // ✅ Token le lo context se

    const fetchAllOrders = useCallback(async () => {
        if (!adminToken) {
            toast.error("Please login first");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(url + '/api/order/list', {
                headers: {
                    'Authorization': `Bearer ${adminToken}`  // ✅ Token bhejo
                }
            });
            
            if (response.data.success) {
                setOrders(response.data.data);
            } else {
                toast.error("Error fetching orders");
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again");
                // Redirect to login
                window.location.href = "/login";
            } else {
                toast.error("Error fetching orders");
            }
        } finally {
            setLoading(false);
        }
    }, [url, adminToken]);

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(
                url + "/api/order/status",
                {
                    orderId,
                    status: event.target.value
                },
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`  // ✅ Token bhejo
                    }
                }
            );

            if (response.data.success) {
                toast.success("Status updated");
                fetchAllOrders();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        if (adminToken) {
            fetchAllOrders();
        }
    }, [adminToken, fetchAllOrders]);

    if (!adminToken) {
        return <div>Please login to view orders</div>;
    }

    return (
        <div className='order add'>
            <h3>Order Page</h3>
            {loading ? (
                <div>Loading orders...</div>
            ) : (
                <div className='order-list'>
                    {orders.length === 0 ? (
                        <p>No orders found</p>
                    ) : (
                        orders.map((order, index) => (
                            <div key={index} className='order-item'>
                                <img src={assets.parcel_icon} alt='' />
                                <div>
                                    <p className='order-item-food'>
                                        {order.items.map((item, itemIndex) => (
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
                                    <p className='order-item-phone'>{order.address?.phone}</p>
                                </div>
                                <p>Items : {order.items.length}</p>
                                <p>${order.amount}</p>
                                <select
                                    onChange={(event) => statusHandler(event, order._id)}
                                    value={order.status}
                                >
                                    <option value="Food Processing">Food Processing</option>
                                    <option value="Out for Delivery">Out For Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Orders;




