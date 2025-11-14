'use client'

import { useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Printer } from 'lucide-react';

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

interface ThermalPrintProps {
  order: Order;
  onClose: () => void;
}

export function ThermalPrint({ order, onClose }: ThermalPrintProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && printRef.current) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Ordem de Serviço #${order.id}</title>
            <style>
              @page {
                size: 80mm auto;
                margin: 0;
              }
              
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
              }
              
              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.4;
                width: 80mm;
                margin: 0 auto;
                padding: 5mm;
                background: white;
              }
              
              .center {
                text-align: center;
              }
              
              .bold {
                font-weight: bold;
              }
              
              .divider {
                border-top: 1px dashed #000;
                margin: 5px 0;
              }
              
              .double-divider {
                border-top: 2px solid #000;
                margin: 5px 0;
              }
              
              .header {
                text-align: center;
                margin-bottom: 10px;
              }
              
              .header h1 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
              }
              
              .header p {
                margin: 2px 0;
                font-size: 11px;
              }
              
              .info-row {
                display: flex;
                justify-content: space-between;
                margin: 3px 0;
              }
              
              .item {
                margin: 5px 0;
              }
              
              .item-header {
                display: flex;
                justify-content: space-between;
                font-weight: bold;
              }
              
              .item-details {
                font-size: 11px;
                margin-left: 5px;
              }
              
              .total-section {
                margin-top: 10px;
                padding-top: 5px;
                border-top: 2px solid #000;
              }
              
              .total-row {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                font-weight: bold;
                margin: 5px 0;
              }
              
              .footer {
                margin-top: 15px;
                text-align: center;
                font-size: 11px;
              }
              
              .signature-area {
                margin-top: 20px;
                padding-top: 30px;
                border-top: 1px solid #000;
                text-align: center;
                font-size: 11px;
              }
            </style>
          </head>
          <body>
            ${printRef.current.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      'pending': 'PENDENTE',
      'in-progress': 'EM ANDAMENTO',
      'completed': 'CONCLUÍDO',
      'cancelled': 'CANCELADO',
    };
    return statusMap[status];
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Impressão Térmica</DialogTitle>
          <DialogDescription>
            Pré-visualização da ordem de serviço
          </DialogDescription>
        </DialogHeader>

        <div ref={printRef} className="bg-white p-4 border-2 border-dashed border-slate-300 rounded-lg" style={{ fontFamily: 'Courier New, monospace', fontSize: '12px', width: '80mm', margin: '0 auto' }}>
          <div className="header" style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h1 className="bold" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>SAPATARIA</h1>
            <p style={{ margin: '2px 0', fontSize: '11px' }}>Rua Exemplo, 123 - Centro</p>
            <p style={{ margin: '2px 0', fontSize: '11px' }}>Tel: (11) 1234-5678</p>
          </div>

          <div className="double-divider" style={{ borderTop: '2px solid #000', margin: '10px 0' }}></div>

          <div className="center bold" style={{ textAlign: 'center', fontSize: '14px', margin: '10px 0', fontWeight: 'bold' }}>
            ORDEM DE SERVIÇO
          </div>

          <div className="divider" style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
            <span>Nº:</span>
            <span className="bold" style={{ fontWeight: 'bold' }}>#{order.id}</span>
          </div>
          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
            <span>Data:</span>
            <span>{new Date(order.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
            <span>Entrega:</span>
            <span className="bold" style={{ fontWeight: 'bold' }}>{new Date(order.deliveryDate).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
            <span>Cliente:</span>
            <span className="bold" style={{ fontWeight: 'bold' }}>{order.clientName}</span>
          </div>
          <div className="info-row" style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0' }}>
            <span>Status:</span>
            <span className="bold" style={{ fontWeight: 'bold' }}>{getStatusText(order.status)}</span>
          </div>

          <div className="divider" style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

          <div className="bold center" style={{ textAlign: 'center', margin: '5px 0', fontWeight: 'bold' }}>SERVIÇOS</div>

          <div className="divider" style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

          {order.items.map((item, index) => (
            <div key={index} className="item" style={{ margin: '8px 0' }}>
              <div className="item-header" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{item.name}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="item-details" style={{ fontSize: '11px', marginLeft: '5px', color: '#666' }}>
                {item.quantity} x R$ {item.price.toFixed(2)}
              </div>
            </div>
          ))}

          <div className="total-section" style={{ marginTop: '10px', paddingTop: '5px', borderTop: '2px solid #000' }}>
            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', margin: '5px 0', fontWeight: 'bold' }}>
              <span className="bold">TOTAL:</span>
              <span className="bold">R$ {order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="divider" style={{ borderTop: '1px dashed #000', margin: '10px 0' }}></div>

          <div className="footer" style={{ textAlign: 'center', fontSize: '11px', margin: '10px 0' }}>
            <p style={{ margin: '2px 0' }}>Obrigado pela preferência!</p>
            <p style={{ margin: '2px 0' }}>Volte sempre!</p>
          </div>

          <div className="signature-area" style={{ marginTop: '20px', paddingTop: '30px', borderTop: '1px solid #000', textAlign: 'center', fontSize: '11px' }}>
            <p style={{ margin: 0 }}>_______________________________</p>
            <p style={{ margin: '5px 0' }}>Assinatura do Cliente</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}