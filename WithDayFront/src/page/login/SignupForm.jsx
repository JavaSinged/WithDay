import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { Input, TextArea } from "@/shared/ui/Form/Form";
import FormField from "@/shared/ui/Form/FormField";

import { signupSchema } from "../validation/signupSchema";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: "onChange", // 실시간 검증
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="이메일" error={errors.email}>
        <Input
          type="email"
          placeholder="이메일 입력"
          {...register("email")}
          error={errors.email}
        />
      </FormField>

      <FormField label="비밀번호" error={errors.password}>
        <Input
          type="password"
          placeholder="비밀번호 입력"
          {...register("password")}
          error={errors.password}
        />
      </FormField>

      <FormField label="내용" error={errors.content}>
        <TextArea
          placeholder="내용 입력"
          {...register("content")}
          error={errors.content}
        />
      </FormField>

      <button type="submit">회원가입</button>
    </form>
  );
}

export default SignupForm;
