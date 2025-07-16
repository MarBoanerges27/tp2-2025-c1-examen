import { findAllSales, findSaleById, findSalesWithTotal, findSalesByCustomer, updateCouponUsedById, findTopProducts, findSalesWithCouponAvailable } from "../data/salesData.js";

export const getSalesService = async (page, pageSize) => {
    return await findAllSales(page, pageSize);
}

export const getSaleByIdService = async (id) => {
    return await findSaleById(id);
};

export const getSalesWithTotalService = async () => {
    return await findSalesWithTotal();
};

export const getSalesByCustomerService = async (email) => {
    return await findSalesByCustomer(email);
};


export const getTopProductsService = async (limit) => {
    return await findTopProducts(limit);
};

export const updateCouponUsedService = async (id) => {
    const result = await updateCouponUsedById(id);

    if (result === null) return { status: "not_found" };
    if (result === "already_used") return { status: "already_used" };

    return { status: "updated", data: result };
};

export const getSalesWithCouponAvailableService = async () => {
    return await findSalesWithCouponAvailable();
};
