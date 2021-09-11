import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

function SaleProductActionButtons() {
  return (
    <>
      <FontAwesomeIcon
        icon={faMinus}
        onClick={(e) => decreaseSaleProductQuantity(`${saleProduct.id}`)}
      />
      <FontAwesomeIcon
        icon={faPlus}
        onClick={(e) => increaseSaleProductQuantity(`${saleProduct.id}`)}
      />
      <FontAwesomeIcon
        icon={faTrash}
        onClick={(e) => deleteSaleProduct(`${saleProduct.id}`)}
      />
    </>
  );
}

export default SaleProductActionButtons;
