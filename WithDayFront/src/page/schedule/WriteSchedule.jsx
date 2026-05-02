import { Input } from "../../widgets/commons/Form";
import styles from "./WriteSchedule.module.css";
import { useState } from "react";

const WriteSchedule = () => {
  const [post, setPost] = useState({
    title: "",
    contentHTML: "",
    contentText: "",
    category: "",
    region: "",
    startDate: "",
    endDate: "",
    recruitmentPeriod: "",
    maxParticipants: "",
    minAge: "",
    maxAge: "",
    gender: "",
    cost: "",
    costSharing: "",
    thumbnail: "",
  });

  return (
    <main className={styles.main}>
      <div></div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          autoComplete="off"
        >
          <ul className={`${styles.info_input_wrap} ${styles.member_name}`}>
            <li>
              <label htmlFor="title">Title</label>
            </li>
            <li>
              <Input
                type="text"
                name="title"
                id="title"
                onChange={(e) => {
                  setPost({ ...post, title: e.target.value });
                }}
              ></Input>
            </li>
          </ul>
        </form>
      </div>
    </main>
  );
};
