'use client';

// import React, { useState } from 'react';
import { X, MapPin, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { UserAddress } from '@/types';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: UserAddress[];
  selectedAddressId: string;
  onSelectAddress: (address: UserAddress) => void;
  onAddNewAddressClick: () => void;
}

export function AddressModal({
  isOpen,
  onClose,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddressClick,
}: AddressModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200'>
      <div className='bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200'>
        {/* HEADER MODAL */}
        <div className='flex items-center justify-between border-b pb-4 mb-4'>
          <div className='flex items-center gap-2'>
            <MapPin className='text-orange-500 h-5 w-5' />
            <h3 className='text-lg font-bold text-slate-900'>
              Pilih Alamat Pengiriman
            </h3>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer'
          >
            <X size={18} className='text-slate-500' />
          </button>
        </div>

        {/* LIST ALAMAT */}
        <div className='flex-1 overflow-y-auto space-y-3 pr-1 py-1'>
          {addresses.length === 0 ? (
            <p className='text-sm text-slate-500 text-center py-6'>
              Anda belum menyimpan alamat.
            </p>
          ) : (
            addresses.map((addr) => {
              const isSelected = addr.id === selectedAddressId;
              return (
                <div
                  key={addr.id}
                  onClick={() => {
                    onSelectAddress(addr);
                    onClose();
                  }}
                  className={cn(
                    'border rounded-2xl p-4 transition-all cursor-pointer select-none relative group text-left',
                    isSelected
                      ? 'border-orange-500 bg-orange-50/30 ring-1 ring-orange-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  )}
                >
                  <div className='flex items-start justify-between gap-4'>
                    <div className='space-y-1 min-w-0'>
                      <div className='flex items-center gap-2 flex-wrap'>
                        <span className='font-bold text-sm text-slate-900'>
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className='text-[10px] font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider'>
                            Utama
                          </span>
                        )}
                      </div>
                      <p className='text-xs font-semibold text-slate-700'>
                        {addr.receiverName} • {addr.phone}
                      </p>
                      <p className='text-xs text-slate-500 leading-relaxed truncate-2-lines'>
                        {addr.fullAddress}
                      </p>
                    </div>

                    {isSelected && (
                      <div className='rounded-full bg-orange-500 p-1 text-white shrink-0 mt-0.5 shadow-sm shadow-orange-500/20'>
                        <Check size={12} className='stroke-3' />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER MODAL (TAMBAH ALAMAT BARU) */}
        <div className='border-t pt-4 mt-4'>
          <Button
            onClick={() => {
              onClose();
              onAddNewAddressClick();
            }}
            variant='outline'
            className='w-full rounded-xl border-dashed border-slate-300 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center gap-2 h-11 text-xs sm:text-sm font-semibold'
          >
            <Plus size={16} />
            Tambah Alamat Baru
          </Button>
        </div>
      </div>
    </div>
  );
}
