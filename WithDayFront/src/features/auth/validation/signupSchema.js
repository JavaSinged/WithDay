import * as yup from "yup";

export const signupSchema = yup.object({
    email: yup
        .string()
        .email("올바른 이메일 형식이 아닙니다")
        .required("이메일은 필수입니다"),

    password: yup
        .string()
        .min(8, "비밀번호는 최소 8자 이상입니다")
        .required("비밀번호는 필수입니다"),

    content: yup
        .string()
        .max(200, "200자 이하로 작성해주세요"),
});