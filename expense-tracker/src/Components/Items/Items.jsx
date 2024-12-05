/* eslint-disable react/prop-types */
import styles from "./Items.module.css";
import pencil from "../../assets/pencil.svg";
import cross from "../../assets/cross.svg";

const Items = ({
  data = { title: "", price: "", category: "", date: "" },
  handleEditfn,
  removeFn,
}) => {
  const handleRemovetransaction = () => {
    removeFn(data.title);
  };
  const handleChangeTransaction = () => {
    let obj = data;
    handleEditfn("edit_Expense", obj);
    return;
  };

  return (
    <div className={styles.Item}>
      <div className={styles.details}>
        <div className={styles.nameDate}>
          <div className={styles.name}>{data.title}</div>
          <div className={styles.date}>{data.date}</div>
        </div>
        <div className={styles.actions}>
          <div className={styles.cost}>₹{data.price}</div>
          <button
            className={styles.cancelBtn}
            onClick={handleRemovetransaction}
          >
            <img src={cross} alt="comments" className={styles.pencil} />
          </button>
          <button
            className={styles.pencilBtn}
            onClick={handleChangeTransaction}
          >
            <img src={pencil} alt="comments" className={styles.pencil} />
          </button>
        </div>
      </div>
      <div className={styles.line}></div>
    </div>
  );
};

export default Items;
