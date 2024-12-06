import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import PieChart from "../PieChart/PieChart";
import AddEdit from "../AddEdit/AddEdit";
import Items from "../Items/Items";
import Pagination from "./Pagination";

const Home = () => {
  const [edit, setEdit] = useState(false);
  const [att, setAtt] = useState("expense");
  const [transactions, setTransactions] = useState(() => {
    if (localStorage.getItem("transaction")) {
      let arr = JSON.parse(localStorage.getItem("transaction"));
      return arr;
    }
    return [];
  });
  const [bars, setBars] = useState({ food: 1, travel: 1, entertaiment: 1 });
  const [Indexes, setIndexes] = useState({
    first: 0,
    last: 3,
  });
  const [existingDataObj, setExistingDataObj] = useState({});
  const [balance_expenses, setBalanceExpense] = useState({
    balance: 5000,
    expense: 0,
    orgBalance: 5000,
  });

  const handleAddBalance = (addBalance) => {
    if (addBalance) {
      setBalanceExpense((prev) => ({
        ...prev,
        orgBalance: prev.balance + parseInt(addBalance),
        balance: prev.balance + parseInt(addBalance),
      }));
    }
    return;
  };
  const handleBalance_expenses = () => {
    let total_expense = 0;
    if (transactions.length) {
      transactions.forEach((e) => {
        total_expense += parseInt(e.price);
      });
    }

    const balance = balance_expenses.orgBalance - total_expense;

    setBalanceExpense((prev) => ({
      ...prev,
      balance: balance,
      expense: total_expense,
    }));
    return;
  };
  const handleNewTransactions = (newTransactionObj, oldtitle) => {
    const { title, price, date, category } = newTransactionObj;
    if (!title || !price || !date || !category) return;

    if (oldtitle) {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.title === oldtitle ? newTransactionObj : transaction
        )
      );
    } else {
      setTransactions((prev) => [...prev, newTransactionObj]);
    }
  };

  const handleEdit = (text, existingData) => {
    text === "income" ? setAtt("income") : text === "edit_Expense" ? setAtt("edit_Expense") : setAtt("expense");
    if (existingData) {
      setExistingDataObj(existingData);
    }
    setEdit(true);
  };
  const cancelAtt = (bool) => {
    if (!bool) setEdit(false);
  };
  const removetransaction = (title) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.title !== title)
    );
  };

  const handelcurrentPage = (data) => {
    const itemsPerPage = 3;
    const indexOfLastItem = itemsPerPage * data;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setIndexes({ first: indexOfFirstItem, last: indexOfLastItem });
  };
  const calculateBarLengths = (expenses) => {
    const totalExpenses = Object.values(expenses).reduce(
      (total, amount) => total + amount,
      0
    );
    const percentages = {};

    for (const category in expenses) {
      percentages[category] = (expenses[category] / totalExpenses) * 100;
    }
    const boxLength = 296; 
    const barLengths = {};

    for (const category in percentages) {
      barLengths[category] = Math.floor(
        (boxLength / 100) * percentages[category]
      );
    }
    setBars(barLengths);
  };

  useEffect(() => {
    handleBalance_expenses();
    if (transactions.length) {
      localStorage.setItem("transaction", JSON.stringify(transactions));
    }
  }, [transactions]);

  return (
    <div>
      <div className={styles.home}>
        <div className={styles.heading}>Expense Tracker</div>
        <div className={styles.top}>
          <div className={styles.top1}>
          <div className={styles.box}>
            <div>
              <span style={{color:'white'}}>Wallet Balance:</span>
              <span style={{ fontWeight: "700", color: '#9DFF5B'
}}>
                ₹{balance_expenses.balance}
              </span>
            </div>
            <button onClick={() => handleEdit("income")}>+Add Income</button>
          </div>
          <div className={styles.box}>
            <div>
              <span style={{color:'white'}}>Expenses:</span>
              <span style={{ fontWeight: "700" ,color: '#F4BB4A'}}>
                ₹{balance_expenses.expense}
              </span>
            </div>
            <button
              onClick={() => handleEdit("expense")}
              className={styles.expenseBtn}
            >
              +Add Expense
            </button>
          </div>
          </div>
          <div className={styles.graph}>
            <PieChart
              graphData={transactions}
              calculateBarLengths={calculateBarLengths}
            />
          </div>
        </div>
        <div className={styles.bottom}>
          <div className={styles.transactions}>
            <div className={styles.headings_1}>Recent Transactions</div>
            <div className={styles.transactionsDetails}>
              {transactions
                .slice(Indexes.first, Indexes.last)
                .map((transaction, index) => {
                  return (
                    <Items
                      data={transaction}
                      key={index}
                      handleEditfn={handleEdit}
                      removeFn={removetransaction}
                    />
                  );
                })}
              <div className={styles.pagination}>
                <Pagination
                  currentPageFn={handelcurrentPage}
                  transactionData={transactions}
                />
              </div>
            </div>
          </div>
          <div className={styles.top_expenses}>
            <div className={styles.headings_1}>Top Expenses</div>
            <div className={styles.horizontalGraph}>
              <div className={styles.YaxisNames}>
                <div className={styles.name}>Entertainment</div>
                <div className={styles.name}>Food</div>
                <div className={styles.name}>Travel</div>
              </div>
              <div className={styles.bars}>
                <div
                  className={styles.entertaiment}
                  style={{ width: `${bars.entertaiment}px` }}
                ></div>
                <div
                  className={styles.food}
                  style={{ width: `${bars.food}px` }}
                ></div>
                <div
                  className={styles.travel}
                  style={{ width: `${bars.travel}px` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {edit ? (
        <div className={styles.addMoney}>
          {att === "expense" ? (
            <AddEdit
              cancelfn={cancelAtt}
              attr={"expense"}
              editOrAdd={"Add"}
              handleNewTransactions={handleNewTransactions}
              currentBalance={balance_expenses.balance}
            />
          ) : att === "edit_Expense" ? (
            <AddEdit
              cancelfn={cancelAtt}
              attr={"expense"}
              editOrAdd={"Edit"}
              handleNewTransactions={handleNewTransactions}
              existingData={existingDataObj}
              currentBalance={balance_expenses.balance}
            />
          ) : (
            <AddEdit
              cancelfn={cancelAtt}
              attr={"income"}
              editOrAdd={"Add"}
              handleBalance={handleAddBalance}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Home;
