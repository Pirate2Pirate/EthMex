import React from "react";

interface Props {
    order: Order;
}

export const OrderItem: React.FC<Props> = ({ order }) => {
    return (
        <div className="pure-u-4-5">
            <div className="pure-u-1-4">
                {order.reputation}
            </div>
            <div className="pure-u-1-4">
                {order.price}
            </div>
            <div className="pure-u-1-4">
                {order.amountBase}
            </div>
            <div className="pure-u-1-4">
                {order.amountToken}
            </div>
        </div>
    );
}