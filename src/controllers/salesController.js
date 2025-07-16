import { getSalesService, getSaleByIdService, getSalesWithTotalService, getSalesByCustomerService, getTopProductsService, updateCouponUsedService, getSalesWithCouponAvailableService } from "../services/salesService.js";

export const getAllSales = async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : undefined;
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : undefined;
        const sales = await getSalesService(page, pageSize);
        res.json(sales);
    } catch (error) {
        console.log("Error fetching sales: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/sales/:id
export const getSaleById = async (req, res) => {
    try {
        const sale = await getSaleByIdService(req.params.id);
        if (!sale) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.json(sale);
    } catch (error) {
        console.log("Error obteniendo venta por ID: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/sales/total
export const getSalesWithTotal = async (req, res) => {
    try {
        const sales = await getSalesWithTotalService();
        res.json(sales);
    } catch (error) {
        console.log("Error obteniendo ventas con total: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/sales/customer/:email

export const getSalesByCustomer = async (req, res) => {
    try {
        const sales = await getSalesByCustomerService(req.params.email);

        if (!sales || sales.length === 0) {
            return res.status(200).json({
                message: `No se encontraron ventas para el cliente con email: ${req.params.email}`,
                ventas: []
            });
        }

        res.status(200).json({
            message: `Se encontraron ${sales.length} venta(s) para el cliente con email: ${req.params.email}`,
            ventas: sales
        });
    } catch (error) {
        console.log("Error obteniendo ventas por cliente: ", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


// PUT /api/sales/:id/coupon-used
export const updateCouponUsed = async (req, res) => {
    try {
        const result = await updateCouponUsedService(req.params.id);

        switch (result.status) {
            case "not_found":
                return res.status(404).json({ message: "Venta no encontrada" });
            case "already_used":
                return res.status(200).json({ message: "El cupón ya fue utilizado anteriormente" });
            case "updated":
                return res.status(200).json({
                    message: "Cupón actualizado correctamente",
                    updatedSale: result.data,
                });
            default:
                return res.status(500).json({ message: "Error interno del servidor" });
        }
    } catch (error) {
        console.error("Error actualizando cupón en controller:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};



// GET /api/sales/top-products
export const getTopProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;
        const topProducts = await getTopProductsService(limit);
        res.json(topProducts);
    } catch (error) {
        console.log("Error obteniendo top productos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSalesWithCouponAvailable = async (req, res) => {
    try {
        const sales = await getSalesWithCouponAvailableService();
        res.json({
            cantidad: sales.length,
            ventas: sales
        });
    } catch (error) {
        console.log("Error obteniendo ventas con cupón disponible:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
