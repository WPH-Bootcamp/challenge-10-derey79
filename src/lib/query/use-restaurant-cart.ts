import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRestaurantDetail } from '@/lib/api/resto';
import { useRouter } from 'next/navigation';
import { cartService } from '@/lib/api/cart';
import { CART_QUERY_KEYS } from '@/lib/query/queries';
import { getErrorMessage } from '@/lib/api/axios';
import type { BackendCartDataResponse } from '@/types/cart';
import { useAuthStore } from '@/store/useAuthStore';

export function useRestaurantCart(restoId: string) {
  const queryClient = useQueryClient();
  const cleanRestoId = parseInt(restoId, 10);
  const cartKey = CART_QUERY_KEYS.list();

  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  // 1. READ DATA RESTORAN
  const restaurantQuery = useQuery({
    queryKey: ['restaurant-detail', restoId],
    queryFn: () => fetchRestaurantDetail(restoId),
    enabled: !isNaN(cleanRestoId),
  });

  // 2. READ DATA KERANJANG
  const cartQuery = useQuery<BackendCartDataResponse>({
    queryKey: cartKey,
    queryFn: async () => {
      const response = (await cartService.getCart()) as unknown;
      if (response && typeof response === 'object') {
        if ('data' in response) {
          const axiosResponse = response as {
            data: { cart?: unknown; summary?: unknown };
          };
          if (
            axiosResponse.data &&
            typeof axiosResponse.data === 'object' &&
            'cart' in axiosResponse.data
          ) {
            return axiosResponse.data as unknown as BackendCartDataResponse;
          }
        }
        if ('cart' in response) {
          return response as unknown as BackendCartDataResponse;
        }
      }
      return {
        cart: [],
        summary: { totalItems: 0, totalPrice: 0, restaurantCount: 0 },
      } as BackendCartDataResponse;
    },
    enabled: !!user,
  });

  // Fungsi pembantu untuk memanipulasi cache secara lokal (Optimistic)
  const setOptimisticCart = (menuId: number, nextQty: number) => {
    queryClient.setQueryData<BackendCartDataResponse>(cartKey, (old) => {
      if (!old) return old;

      const updatedCart = old.cart.map((group) => {
        if (Number(group.restaurant?.id) !== cleanRestoId) return group;

        // Jika kuantitas menjadi 0, hapus item dari daftar lokal
        if (nextQty <= 0) {
          return {
            ...group,
            items: group.items.filter((i) => Number(i.menu?.id) !== menuId),
          };
        }

        // Jika masih ada sisa kuantitas, perbarui angkanya langsung
        return {
          ...group,
          items: group.items.map((i) =>
            Number(i.menu?.id) === menuId ? { ...i, quantity: nextQty } : i
          ),
        };
      });

      // Filter grup restoran yang kosong jika semua itemnya habis terhapus
      const filteredCart = updatedCart.filter(
        (group) => group.items.length > 0
      );

      return {
        ...old,
        cart: filteredCart,
      };
    });
  };

  // 3. MUTATION: POST /api/cart (Hanya dipakai saat membuat item BARU di keranjang)
  const cartMutation = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: cartKey });
      alert(`Gagal menambahkan ke keranjang: ${getErrorMessage(err)}`);
    },
  });

  // 4. MUTATION: PUT /api/cart/{id} (Dipakai untuk memperbarui kuantitas item yang SUDAH ADA)
  const updateCartItemMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: number;
      quantity: number;
    }) => cartService.updateQuantity(cartItemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: cartKey });
      alert(`Gagal memperbarui kuantitas: ${getErrorMessage(err)}`);
    },
  });

  // 5. MUTATION: DELETE /api/cart/{id} (Dipakai murni saat kuantitas mencapai angka 0)
  const deleteMutation = useMutation({
    mutationFn: (cartItemId: number) => cartService.removeItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
    onError: (err: unknown) => {
      queryClient.invalidateQueries({ queryKey: cartKey });
      alert(`Gagal menghapus item: ${getErrorMessage(err)}`);
    },
  });

  // 6. LOGIKA NAVIGASI TOMBOL (MENGGUNAKAN ENPOINT MUTLAK / ABSOLUTE)
  const updateQuantity = async (menuId: number, delta: number) => {
    if (isNaN(cleanRestoId) || isNaN(menuId)) return;
    if (!user) {
      // Jika belum login, tendang ke halaman login
      router.push('/login?callback=/resto/' + cleanRestoId);
      alert(
        'Silakan login terlebih dahulu untuk menambahkan makanan ke keranjang!'
      );
      return;
    }
    const groups = cartQuery.data?.cart || [];
    const group = groups.find((g) => Number(g.restaurant?.id) === cleanRestoId);
    const item = group?.items?.find((i) => Number(i.menu?.id) === menuId);

    // Membatalkan fetch yang sedang berjalan agar tidak menimpa state optimistis
    await queryClient.cancelQueries({ queryKey: cartKey });

    // KASUS A: MENU BELUM ADA DI KERANJANG (Klik Tombol "Add" Pertama Kali)
    if (!item) {
      if (delta === 1) {
        setOptimisticCart(menuId, 1); // Pasang UI instan bernilai 1

        cartMutation.mutate({
          restaurantId: cleanRestoId,
          menuId,
          quantity: 1, // Buat baris baru di DB dengan kuantitas awal 1
        });
      }
      return;
    }

    // KASUS B: MENU SUDAH ADA DI KERANJANG (Klik Tombol + atau - Selanjutnya)
    const targetQty = item.quantity + delta; // Hitung nilai mutlak tujuan (misal: 77 - 1 = 76 atau 77 + 1 = 78)

    // Terapkan Optimistic Update ke UI lokal terlebih dahulu
    setOptimisticCart(menuId, targetQty);

    // B1. Jika kuantitas turun menjadi 0, panggil endpoint DELETE
    if (targetQty <= 0) {
      deleteMutation.mutate(item.id);
      return;
    }

    // B2. Jika naik atau turun di atas angka 0, gunakan API PUT secara mutlak
    // Tidak ada alur hapus-tambah, server langsung mengubah nilai kuantitas ke targetQty
    updateCartItemMutation.mutate({
      cartItemId: item.id,
      quantity: targetQty,
    });
  };

  // Gabungkan seluruh status pemrosesan mutasi untuk mengunci tombol UI secara aman
  const isActionPending =
    cartMutation.isPending ||
    updateCartItemMutation.isPending ||
    deleteMutation.isPending;

  return {
    restaurant: restaurantQuery.data,
    isLoading: restaurantQuery.isLoading || cartQuery.isLoading,
    isActionPending,
    isError: restaurantQuery.isError || cartQuery.isError,
    error: restaurantQuery.error || cartQuery.error,
    cartData: cartQuery.data,
    updateQuantity,
  };
}
