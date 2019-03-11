import React from "react";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import RemoveFromCart from "./RemoveFromCart";

interface CartItemProps {
  cartItem: {
    id: string;
    item: {
      image: string;
      title: string;
      price: number;
    };
    quantity: number;
  };
}

const CartItemStyles = styled.li`
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem: React.SFC<CartItemProps> = ({ cartItem }) => {
  // Handle the case where item has been added to users cart but has been deleted from site.
  if (!cartItem.item)
    return (
      <CartItemStyles>
        <p>This item is no longer available</p>
      </CartItemStyles>
    );
  return (
    <CartItemStyles>
      <img width="100" src={cartItem.item.image} alt={cartItem.item.title} />
      <div className="cart-item-details">
        <h3>{cartItem.item.title}</h3>
        <p>
          {formatMoney(cartItem.item.price * cartItem.quantity)}
          {" - "}
          <em>
            {cartItem.quantity} &times; {formatMoney(cartItem.item.price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
};

export default CartItem;
