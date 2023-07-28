import API from "./api";

const cryptoService = {
    getAllcrypto: () => {
        return API.get("/crypto/getallcrypto");
    },
};
    export default cryptoService;