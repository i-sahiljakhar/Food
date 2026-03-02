import React, { useState, useEffect, useContext } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext';

function List() {
    const { url, adminToken } = useContext(AdminContext);
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/food/list`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch data");
        }
    };

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post(`${url}/api/food/remove`, 
                { id: foodId },
                {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                }
            );
            
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList();
            } else {
                toast.error("Error removing food");
            }
        } catch (error) {
            console.error("Remove error:", error);
            toast.error("Failed to remove food");
        }
    };

    useEffect(() => {
        if (adminToken) {
            fetchList();
        }
    }, [adminToken]);

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            <div className='list-table'>
                <div className='list-table-format title'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item, index) => (
                    <div key={index} className='list-table-format'>
                        <img src={`${url}/images/${item.image}`} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p> 
                        <p>${item.price}</p>
                        <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default List;