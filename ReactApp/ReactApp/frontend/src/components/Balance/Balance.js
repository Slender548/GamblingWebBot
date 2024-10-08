import React from "react";
// import styles from "./NavBar.module.css";

//TODO Web Template Studio: Add a new link in the NavBar for your page here.
// A skip link is included as an accessibility best practice. For more information visit https://www.w3.org/WAI/WCAG21/Techniques/general/G1.

const balance = 213;

const balance_ending = balance % 10 === 1 && balance % 100!== 11? "а" : balance % 10 >= 2 && balance % 10 <= 4 && (balance % 100 < 10 || balance % 100 >= 20)? "ы" : "ов";

const Balance = () => {
  return (
    <React.Fragment>
      <div class="page-title">
    <div class="page-title-cell">
        <b class="page-title-cell-title">Баланс:</b> { balance } монет{ balance_ending }
    </div>
</div>
<div class="page-other">
    <button class="cell btn-active" id="btn-withdraw">
        Вывод средств
    </button>
    <button class="cell btn-active" id="btn-deposit">
        Депозит средств
    </button>
    <button class="cell btn-active" id="btn-history">
        История выводов и депозитов
    </button>
</div>
    </React.Fragment>
  );
}
export default Balance;