import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ShowPaymentInfo from '../cards/ShowPaymentInfo';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Orders = ({ orders, handleStatusChange }) => {
    const mapBadgeColor = (status) => {
        if (status === 'Payment success')
            return <span className="badge badge-success">{status}</span>;
        return <span className="badge badge-info">{status}</span>;
    };
    const showOrderInTable = (order) => (
        <tr key={order._id}>
            <td>
                <Link to={`/admin/orders/${order._id}`}>
                    <b>
                        {order._id
                            .toString()
                            .substr(order._id.toString().length - 8)}
                    </b>
                </Link>
            </td>
            <td>{moment(order.createdAt).format('DD MMM YYYY - h:mm:ss a')}</td>
            <td>{order.orderedBy.name}</td>
            <td dangerouslySetInnerHTML={{__html: order.orderedBy.address}}></td>
            <td>{order.paymentIntent.amount}</td>
            <td>{mapBadgeColor(order.paymentIntent.status)}</td>
            <td>
                <select
                    onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                    }
                    className="form-control text-sm badge badge-primary"
                    defaultValue={order.orderStatus}
                    name="status"
                >
                    <option value="Not Processed">Not Processed</option>
                    <option value="Cash On Delivery">Cash On Delivery</option>
                    <option value="Processing">Processing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                </select>
            </td>
        </tr>
    );
    console.log('ORDERS: ', orders);

    return (
        <>
            {orders && (
                <>
                    <table className="table table-bordered">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Date</th>
                                <th scope="col">Customer</th>
                                <th scope="col">Address</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Payment status</th>
                                <th scope="col">Delivery status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => showOrderInTable(order))}
                        </tbody>
                    </table>
                </>
            )}
        </>
    );
};

export default Orders;