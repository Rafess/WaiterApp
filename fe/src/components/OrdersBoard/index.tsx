import { Board, OrdersContainer } from './styles';
import { Order } from '../../types/Order';
import { OrderModal } from '../OrderModal';
import { useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';


interface OrdersBoardProps {
  icon: string;
  title: string;
  orders: Order[];
  onCancelOrder: (orderId:string) => void;
  onOrderStatusChange: (orderId:string, status:Order['status']) => void;
}


export const OrderBoard = ({icon, title, orders, onCancelOrder, onOrderStatusChange}: OrdersBoardProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<null | Order>(null);
  const [isLoading, setIsLoading] = useState(false);
  function handleOpenModal(order:Order) {
    setSelectedOrder(order);
    setIsModalVisible(true);
  }

  function handleCloseModal() {
    setSelectedOrder(null);
    setIsModalVisible(false);
  }

  function handleChangeOrderStatus() {
    if(!selectedOrder) {
      return;
    }
    setIsLoading(true);
    const newStatus = selectedOrder?.status === 'WAITING' ? 'IN_PRODUCTION' : 'DONE';
    api.patch(`/orders/${selectedOrder._id}`, {status : newStatus});
    toast.success(`O pedido da mesa ${selectedOrder.table} teve seu status alterado!`);
    onOrderStatusChange(selectedOrder._id, newStatus);
    setIsLoading(false);
    setIsModalVisible(false);
  }
  async function handleCancelOrder() {
    setIsLoading(true);
    if(!selectedOrder) {
      return;
    }
    await api.delete(`/orders/${selectedOrder._id}`);
    toast.success(`O pedido da mesa ${selectedOrder.table} foi cancelado!`);
    onCancelOrder(selectedOrder._id);
    setIsLoading(false);
    setIsModalVisible(false);
  }
  return(
    <Board>
      <OrderModal
        visible={isModalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onCancelOrder={handleCancelOrder}
        isLoading={isLoading}
        onChangeOrderStatus={handleChangeOrderStatus}
      />
      <header>
        <span>{icon}</span>
        <strong>{title}</strong>
        <span>({orders.length})</span>
      </header>
      {orders.length > 0 && (
        <OrdersContainer>
          {orders.map((order) => (
            <button type='button' key={order._id} onClick={() => handleOpenModal(order)}>
              <strong>Mesa {order.table}</strong>
              <span> {order.products.length} Itens</span>
            </button>
          ))}
        </OrdersContainer>
      )}

    </Board>
  );
};
