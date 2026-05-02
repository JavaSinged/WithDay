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

/**
 * 컴포넌트 사용 예시
import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";

function Example() {
  return (
    <>
      <Input label="이메일" placeholder="email 입력" />

      <Button variant="primary">로그인</Button>
      <Button variant="accent">회원가입</Button>
      <Button variant="outline">취소</Button>
    </>
  );
}

import { Input, TextArea } from "@/shared/ui/Form/Form";

function Example() {
  return (
    <>
      <Input placeholder="이름 입력" />
      <Input placeholder="이메일" error />

      <TextArea placeholder="내용 입력" />
    </>
  );
}
 * 
 */
