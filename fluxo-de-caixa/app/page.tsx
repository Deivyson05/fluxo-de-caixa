'use client'

//import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientsSection } from '@/components/ClientsSection';
import { ServicesSection } from '@/components/ServicesSection';
import { OrdersSection } from '@/components/OrdersSection';
import { ShoppingBag, Users, Wrench, FileText } from 'lucide-react';

export default function Home() {
  
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/icone.png" alt="icon" className='h-10' />
            <div>
              <h1 className="text-slate-900">AG Sapataria</h1>
              <p className="text-slate-600 text-sm">Gerenciamento de pedidos</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="orders" className="flex items-center gap-2 cursor-pointer">
              <FileText className="w-4 h-4" />
              Ordens de Serviço
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2 cursor-pointer">
              <Users className="w-4 h-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2 cursor-pointer">
              <Wrench className="w-4 h-4" />
              Serviços
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersSection />
          </TabsContent>

          <TabsContent value="clients">
            <ClientsSection />
          </TabsContent>

          <TabsContent value="services">
            <ServicesSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}