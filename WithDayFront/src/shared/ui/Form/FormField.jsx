import styles from "./Form.module.css";

const FormField = ({ label, error, helperText, children }) => {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}

      {children}

      {error ? (
        <span className={styles.errorText}>{error.message}</span>
      ) : (
        helperText && <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
};

export default FormField;
