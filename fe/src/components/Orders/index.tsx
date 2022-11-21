import { useEffect, useState } from 'react';
import { Order } from '../../types/Order';
import { api } from '../../utils/api';
import { OrderBoard } from '../OrdersBoard';
import { Container } from './styles';
import socketIo from 'socket.io-client';



export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = socketIo('http://localhost3001', {transports: ['websocket'],});
    socket.on('order@new', (order) => {
      setOrders(prevState => prevState.concat(order));
    });
  }, []);

  useEffect(()=> {
    api.get('/orders').then(({data}) => {
      setOrders(data);
    });
  });


  const waiting = orders.filter((order) => order.status === 'WAITING');
  const inProduction = orders.filter((order) => order.status === 'IN_PRODUCTION');
  const done = orders.filter((order) => order.status === 'DONE');

  function handleCancelOrder(orderId:string) {
    setOrders((prevState) => prevState.filter(order => order._id !== orderId));
  }

  function handleOrderStatusChange(orderId:string, status:Order['status']) {
    setOrders((prevState) => prevState.map((order) => (
      order._id === orderId ? {...order, status} : order
    )));
  }

  return (
    <Container>
      <OrderBoard onOrderStatusChange={handleOrderStatusChange} onCancelOrder={handleCancelOrder} icon="🕑" title="Fila de Espera" orders={waiting} />
      <OrderBoard onOrderStatusChange={handleOrderStatusChange} onCancelOrder={handleCancelOrder} icon="👩‍🍳" title="Em Produção" orders={inProduction} />
      <OrderBoard onOrderStatusChange={handleOrderStatusChange} onCancelOrder={handleCancelOrder} icon="✅" title="Pronto!" orders={done} />
    </Container>
  );
};
