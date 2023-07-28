import { create } from "zustand";
import cryptoService from "../service/cryptoService";

const usecryptoStore = create((set, get) => ({
    cryptos: [],
    setCryptos: (cryptos) => set({ cryptos }),
    fetchCryptos: async () => {
        await cryptoService.getAllcrypto().then((res) => {
            if (res.status == 200) {
                set({ cryptos: res.data.cryptos });
            }
        });
    },
   
}));

export default usecryptoStore;