import { getDbSupplies } from "./connection.js";
import { ObjectId } from "mongodb";

export async function findAllSales(page, pageSize) {
    const db = getDbSupplies();
    if (page && pageSize) {
        const skip = (page - 1) * pageSize;
        const sales = await db.collection("sales")
            .find()
            .skip(skip)
            .limit(pageSize)
            .toArray();
        return sales;
    } else {
        // Sin paginación: trae todos los documentos
        const sales = await db.collection("sales").find().toArray();
        return sales;
    }
}

export async function findSaleById(id) {
    const db = getDbSupplies();
    try {
        return await db.collection("sales").findOne({ _id: new ObjectId(id) });
    }catch(error) {
        console.log("ID inválido:", error);
        return null;
    }
}

export async function findSalesWithTotal() {
    const db = getDbSupplies();
    const sales = await db.collection("sales").find().toArray();
   
    return sales.map(sale => {
        const total = sale.items.reduce((acc, item) => {
            const price = parseFloat(item.price?.$numberDecimal || item.price);
            return acc + price * item.quantity;
        }, 0);
        return {
            ...sale,
            total: total.toFixed(2)
        };
    });
}

export async function findSalesByCustomer(email) {
    const db = getDbSupplies();
    const sales = await db.collection("sales").find({ "customer.email": email }).toArray();

    return sales.map(sale => {
        const total = sale.items.reduce((acc, item) => {
            const price = parseFloat(item.price?.$numberDecimal || item.price);
            return acc + price * item.quantity;
        }, 0);

        return {
            ...sale,
            total: total.toFixed(2)
        };
    });
}


export async function updateCouponUsedById(id) {
    const db = getDbSupplies();

    const venta = await findSaleById(id);

    if (!venta) return null;
    if (venta.couponUsed === true) return "already_used";

    const result = await db.collection("sales").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { couponUsed: true } },
        { returnDocument: "after" }
    );

    return result.value;
}


export async function findTopProducts(limit = 5) {
    const db = getDbSupplies();

    const result = await db.collection("sales").aggregate([
        { $unwind: "$items" }, 
        {
            $group: {
                _id: "$items.name", 
                totalSold: { $sum: "$items.quantity" } 
            }
        },
        { $sort: { totalSold: -1 } }, 
        { $limit: limit }, 
        {
            $project: {
                product: "$_id", 
                totalSold: 1,
                _id: 0
            }
        }
    ]).toArray();

    return result;
}

export async function findSalesWithCouponAvailable() {
    const db = getDbSupplies();
    return await db.collection("sales").find({ couponUsed: false }, { projection: { _id: 1 } }).toArray();
}
