import { useState, useEffect } from 'react';
import { getUserOrders } from '../../functions/user';
import { useSelector } from 'react-redux';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ShowPaymentInfo from '../../components/cards/ShowPaymentInfo';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Invoice from '../../components/order/Invoice';

const History = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useSelector((state) => ({ ...state }));

    useEffect(() => {
        loadUserOrders();
    }, []);

    const loadUserOrders = () =>
        getUserOrders(user.token).then((res) => {
            console.log(res.data);
            setOrders(res.data);
        });

    const showOrderInTable = (order) => (
        <>
        <p>Order ID: <b>{order._id}</b></p>
        <table className="table table-bordered">
            <thead className="thead-light">
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Count</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>

            <tbody>
                {order.products.map((p, i) => (
                    <tr key={i}>
                        <td>
                            <b>{p.product?.title || 'Sample book'}</b>
                        </td>
                        <td>{p.product?.price || '250000'}</td>
                        <td>{p.count}</td>
                        <td>{p.count * p.product?.price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>
    );

    const showDownloadLink = (order) => (
        <PDFDownloadLink
            document={<Invoice order={order} />}
            fileName="invoice.pdf"
            className="btn btn-sm btn-block btn-outline-primary"
        >
            Download PDF
        </PDFDownloadLink>
    );

    const showEachOrders = () =>
        orders.reverse().map((order, i) => (
            <div key={i} className="m-5 p-3 card" style={{width:'100%'}}>
                {/* <ShowPaymentInfo order={order} /> */}
                {showOrderInTable(order)}
                <div className="row">
                    <div className="col">{showDownloadLink(order)}</div>
                </div>
            </div>
        ));

    return (
        <div style={{ minHeight: 'calc(100vh - 210px)', width: '100%' }}>
            <h4 className="mt-4">
                {orders.length > 0
                    ? 'User orders'
                    : 'No orders'}
            </h4>
            <div className="row" style={{ width: '100%' }}>
                {orders && showEachOrders()}
            </div>
        </div>
    );
};

export default History;
