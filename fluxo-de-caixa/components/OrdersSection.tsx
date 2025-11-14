'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, Eye, Trash2, CheckCircle2, Printer, Edit } from 'lucide-react';
import { Badge } from './ui/badge';
import { ThermalPrint } from './ThermalPrint';

interface OrderItem {
  id: string;
  type: 'service';
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  clientName: string;
  date: string;
  deliveryDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  items: OrderItem[];
  total: number;
}

const mockClients = ['João Silva', 'Maria Santos', 'Pedro Oliveira'];
const mockServices = [
  { id: '1', name: 'Troca de Sola', price: 45.00 },
  { id: '2', name: 'Troca de Salto', price: 35.00 },
  { id: '3', name: 'Costura de Rasgos', price: 30.00 },
  { id: '4', name: 'Alongamento de Calçados', price: 25.00 },
  { id: '5', name: 'Troca de Zíper', price: 40.00 },
  { id: '6', name: 'Limpeza e Hidratação', price: 50.00 },
  { id: '7', name: 'Palmilha Ortopédica', price: 80.00 },
  { id: '8', name: 'Tingimento de Couro', price: 60.00 },
];

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      clientName: 'João Silva',
      date: '2025-11-12',
      deliveryDate: '2025-11-15',
      status: 'in-progress',
      items: [
        { id: '1', type: 'service', name: 'Troca de Sola', price: 45.00, quantity: 2 },
        { id: '2', type: 'service', name: 'Troca de Salto', price: 35.00, quantity: 1 },
      ],
      total: 125.00,
    },
    {
      id: '2',
      clientName: 'Maria Santos',
      date: '2025-11-12',
      deliveryDate: '2025-11-15',
      status: 'completed',
      items: [
        { id: '6', type: 'service', name: 'Limpeza e Hidratação', price: 50.00, quantity: 1 },
        { id: '7', type: 'service', name: 'Palmilha Ortopédica', price: 80.00, quantity: 1 },
      ],
      total: 130.00,
    },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    deliveryDate: new Date().toISOString().split('T')[0],
    status: 'pending' as Order['status'],
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const filteredOrders = orders.filter(order =>
    order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.includes(searchTerm)
  );

  const handleAddItem = (type: 'service', itemId: string) => {
    const item = type === 'service'
      ? mockServices.find(s => s.id === itemId)
      : null;

    if (item) {
      const existingItem = orderItems.find(i => i.id === itemId && i.type === type);
      if (existingItem) {
        setOrderItems(orderItems.map(i =>
          i.id === itemId && i.type === type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ));
      } else {
        setOrderItems([...orderItems, {
          id: itemId,
          type,
          name: item.name,
          price: item.price,
          quantity: 1,
        }]);
      }
    }
  };

  const handleRemoveItem = (itemId: string, type: 'service') => {
    setOrderItems(orderItems.filter(i => !(i.id === itemId && i.type === type)));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOrder) {
      // Atualizar ordem existente
      const updatedOrder: Order = {
        ...editingOrder,
        clientName: formData.clientName,
        date: formData.date,
        deliveryDate: formData.deliveryDate,
        status: formData.status,
        items: orderItems,
        total: calculateTotal(),
      };
      setOrders(orders.map(order => order.id === editingOrder.id ? updatedOrder : order));
    } else {
      // Criar nova ordem
      const newOrder: Order = {
        id: Date.now().toString(),
        clientName: formData.clientName,
        date: formData.date,
        deliveryDate: formData.deliveryDate,
        status: formData.status,
        items: orderItems,
        total: calculateTotal(),
      };
      setOrders([newOrder, ...orders]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      deliveryDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    });
    setOrderItems([]);
    setEditingOrder(null);
    setIsDialogOpen(false);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
  };

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      'pending': { variant: 'secondary' as const, label: 'Pendente' },
      'in-progress': { variant: 'default' as const, label: 'Em Andamento' },
      'completed': { variant: 'default' as const, label: 'Concluído', className: 'bg-green-500 hover:bg-green-600' },
      'cancelled': { variant: 'destructive' as const, label: 'Cancelado' },
    };
    const config = variants[status];
    return <Badge variant={config.variant} className={(config as { className?: string }).className ?? ""}>{config.label}</Badge>;
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      clientName: order.clientName,
      date: order.date,
      deliveryDate: order.deliveryDate,
      status: order.status,
    });
    setOrderItems(order.items);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ordens de Serviço</CardTitle>
              <CardDescription>Gerencie todas as ordens de serviço</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingOrder(null); setOrderItems([]); setFormData({ clientName: '', date: new Date().toISOString().split('T')[0], deliveryDate: new Date().toISOString().split('T')[0], status: 'pending' }); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Ordem
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingOrder ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}</DialogTitle>
                  <DialogDescription>
                    {editingOrder ? 'Edite os dados da ordem de serviço' : 'Crie uma nova ordem de serviço'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="client">Cliente</Label>
                      <Select
                        value={formData.clientName}
                        onValueChange={(value) => setFormData({ ...formData, clientName: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem key={client} value={client}>
                              {client}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deliveryDate">Data de Entrega</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Adicionar Serviços</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {mockServices.map((service) => (
                          <Button
                            key={service.id}
                            type="button"
                            variant="outline"
                            onClick={() => handleAddItem('service', service.id)}
                            className="justify-start"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            {service.name} - R$ {service.price.toFixed(2)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {orderItems.length > 0 && (
                      <div className="grid gap-2">
                        <Label>Itens Selecionados</Label>
                        <div className="border rounded-md p-3 space-y-2">
                          {orderItems.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="flex items-center justify-between">
                              <span className="text-sm">
                                {item.name} x{item.quantity} - R$ {(item.price * item.quantity).toFixed(2)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id, item.type)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span>R$ {calculateTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={orderItems.length === 0}>
                      {editingOrder ? 'Salvar Alterações' : 'Criar Ordem'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar ordens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="w-[150px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-500">
                      Nenhuma ordem encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.clientName}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(order.deliveryDate).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewingOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status !== 'completed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(order.id, 'completed')}
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPrintingOrder(order)}
                          >
                            <Printer className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(order)}
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {viewingOrder && (
        <Dialog open={!!viewingOrder} onOpenChange={() => setViewingOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Ordem #{viewingOrder.id}</DialogTitle>
              <DialogDescription>
                Informações completas da ordem de serviço
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Cliente</Label>
                <p>{viewingOrder.clientName}</p>
              </div>
              <div>
                <Label>Data</Label>
                <p>{new Date(viewingOrder.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <Label>Data de Entrega</Label>
                <p>{new Date(viewingOrder.deliveryDate).toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(viewingOrder.status)}</div>
              </div>
              <div>
                <Label>Itens</Label>
                <div className="border rounded-md p-3 mt-2 space-y-2">
                  {viewingOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} ({item.type === 'service' ? 'Serviço' : 'Produto'}) x{item.quantity}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span>Total:</span>
                    <span>R$ {viewingOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingOrder(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {printingOrder && (
        <ThermalPrint order={printingOrder} onClose={() => setPrintingOrder(null)} />
      )}
    </div>
  );
}