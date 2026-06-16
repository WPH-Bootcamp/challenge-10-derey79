'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { NavBreadcrumb } from '@/components/shared/NavBreadcrumb';
import { Button } from '@/components/ui/button';

// IMPORT KELOMPOK REUSABLE COMPONENT KITA
import { ShippingAddress } from './ShippingAddress';
import { OrderSummaryList } from './OrderSummaryList';
import { PriceReceiptCard } from './PriceReceiptCard';
import { AddressModal } from './SetAddress';

import { cartService } from '@/lib/api/cart';
import { CART_QUERY_KEYS } from '@/lib/query/queries';
import { getErrorMessage } from '@/lib/api/axios';
import type { BackendCartDataResponse } from '@/types/cart';
import type { UserAddress } from '@/types';

// mock data untuk simulasi
const MOCK_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    label: 'Rumah Utama',
    receiverName: 'Jhon Doe',
    phone: '081234567890',
    fullAddress:
      'Jl. Margonda Raya No. 123, Kecamatan Pancoran Mas, Kota Depok, Jawa Barat, 16431',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Kantor',
    receiverName: 'Jhon Doe (Corporate)',
    phone: '089987654321',
    fullAddress:
      'Gedung Cyber 2 Lt. 17, Kuningan Timur, Setiabudi, Jakarta Selatan, DKI Jakarta, 12950',
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const cartKey = CART_QUERY_KEYS.list();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [activeAddress, setActiveAddress] = useState<UserAddress>(
    MOCK_ADDRESSES[0]
  );

  // fetch data
  const {
    data: cartData,
    isLoading,
    isError,
    error,
  } = useQuery<BackendCartDataResponse>({
    queryKey: cartKey,
    queryFn: async () => {
      const response = (await cartService.getCart()) as unknown;

      if (response && typeof response === 'object' && 'data' in response) {
        const wrapped = response as { data: BackendCartDataResponse };
        return wrapped.data;
      }

      return response as BackendCartDataResponse;
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });

  const cartGroups = cartData?.cart || [];
  const firstGroup = cartGroups[0];
  const restoName = firstGroup?.restaurant?.name || 'Name Resto';
  const restoId = firstGroup?.restaurant?.id || '';

  // KALKULASI HARGA BIAYA
  const itemTotal = cartData?.summary?.totalPrice || 0;
  const deliveryFee = cartGroups.length > 0 ? 15000 : 0;
  const platformFee = cartGroups.length > 0 ? 2000 : 0;
  const grandTotal = itemTotal + deliveryFee + platformFee;

  // submit
  const handlePayment = async () => {
    if (cartGroups.length === 0) return;
    if (!activeAddress) {
      alert('Silakan pilih alamat pengiriman terlebih dahulu!');
      return;
    }
    setSubmitting(true);
    try {
      await clearCartMutation.mutateAsync();
      alert('Pesanan berhasil dibuat! Mengalihkan ke pembayaran...');
      router.push('/order-success');
    } catch (err) {
      alert(`Gagal memproses pembayaran: ${getErrorMessage(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center gap-2 bg-slate-50'>
        <Loader2 className='h-6 w-6 animate-spin text-orange-600' />
        <span className='text-sm font-medium text-slate-600'>
          Memuat detail pesanan...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50 text-red-500 font-medium'>
        <p>
          ⚠️ Gagal memuat detail pesanan:{' '}
          {error ? getErrorMessage(error) : 'Terjadi kesalahan'}
        </p>
        <Button
          onClick={() => queryClient.invalidateQueries({ queryKey: cartKey })}
          variant='outline'
        >
          Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-50 pb-24'>
      <NavBreadcrumb
        currentPathName={restoName}
        restoId={restoId}
        isCheckoutPage={true}
      />

      <main className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-8 lg:grid-cols-3 mt-4 w-full'>
        <div className='lg:col-span-2 space-y-6'>
          <ShippingAddress
            address={activeAddress?.fullAddress}
            phone={activeAddress?.phone}
            onChangeAddressClick={() => setIsAddressModalOpen(true)}
          />

          <OrderSummaryList cartGroups={cartGroups} />
        </div>

        {/* reciept */}
        <PriceReceiptCard
          itemCount={cartData?.summary?.totalItems || 0}
          itemTotal={itemTotal}
          deliveryFee={deliveryFee}
          platformFee={platformFee}
          grandTotal={grandTotal}
          isDisable={cartGroups.length === 0}
          isSubmitting={submitting}
          onPayConfirm={handlePayment}
        />
      </main>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={MOCK_ADDRESSES}
        selectedAddressId={activeAddress.id}
        onSelectAddress={(addr) => setActiveAddress(addr)}
        onAddNewAddressClick={() => alert('Navigasi ke pembuatan alamat baru')}
      />
    </div>
  );
}
