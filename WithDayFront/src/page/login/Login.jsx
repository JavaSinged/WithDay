import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";

import { Snackbar, Alert } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useAuthStore } from "../../features/auth/store/authStore";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { loginSchema } from "../../features/auth/validation/authSchema";
import { loginUser, googleLoginUser } from "../../features/auth/api";

import FormField from "../../shared/ui/Form/FormField";
import { Input } from "../../shared/ui/Form/Form"; //
import Button from "../../shared/ui/Button/Button";
import styles from "./Auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 페이지 정보를 저장. 이전 페이지에서 넘겨준 state의 값을 받을수 있음
  const setLogin = useAuthStore((state) => state.setLogin); // 로그인 정보를 보관하는 useAuthStore에서 setLogin정보(로그인하면 받는 토큰및 이메일등의 정보) 가져옴.

  // 알림창 상태: 열림/닫힘, 메시지 내용, 성공/실패 색상
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [showPw, setShowPw] = useState(false); // 비밀번호 마스킹(***)을 풀지 말지 결정하는 스위치

  // 💡 [UX 핵심] 페이지가 처음 딱 켜졌을 때(mount) 1번만 실행됨
  useEffect(() => {
    // 만약 회원가입 페이지에서 "가입 성공!" 쪽지(toastMessage)를 들고 이리로 넘어왔다면?
    if (location.state?.toastMessage) {
      setToast({
        open: true,
        message: location.state.toastMessage,
        severity: "success",
      }); // 성공 알림 띄우기
      // 새로고침하면 똑같은 알림이 또 뜨는 걸 막기 위해, 현재의 history state를 빈 껍데기로 덮어씌워 쪽지를 찢어버림
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // 알림창 x 버튼 누르거나 시간 지나면 닫히게 하는 함수
  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return; // 바깥 클릭해서 닫히는 건 막음
    setToast((prev) => ({ ...prev, open: false }));
  };

  // 📋 React Hook Form 초기화 및 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema), // "loginSchema 규칙대로 검사해줘!"
    mode: "onSubmit", // 타이핑할 때마다 검사하지 말고, '제출(submit)' 버튼 누를 때만 검사해!
  });

  // 🚀 일반 이메일 로그인 Mutation (백엔드 통신 담당)
  const mutation = useMutation({
    mutationFn: loginUser, // api.js에 있는 POST 요청 함수 실행
    onSuccess: (data) => {
      // 통신 성공! 백엔드가 준 데이터에서 토큰과 유저 정보를 꺼냄
      const { token, user } = data;
      setLogin(token, user); // 전역 금고에 저장! (이제 우리 사이트 전체가 로그인된 걸 앎)
      // 💡 딜레이 없이 즉시 메인 페이지로 이동! (네이버 스타일)
      navigate("/");
    },
    onError: (error) => {
      // 실패 시 서버가 준 에러 메시지를 알림창에 띄움
      const errMsg =
        error.response?.data?.message || error.response?.data || error.message;
      setToast({
        open: true,
        message: `로그인 실패: ${typeof errMsg === "object" ? JSON.stringify(errMsg) : errMsg}`,
        severity: "error",
      });
    },
  });

  // 🚀 구글 로그인 전용 Mutation
  const googleMutation = useMutation({
    mutationFn: googleLoginUser,
    onSuccess: (data, variables) => {
      // variables: 우리가 서버로 보냈던 구글 데이터 원본
      if (data.isRegistered === false) {
        // [신규 유저] 백엔드가 "이 사람 우리 회원 아님!"이라고 응답한 경우
        // 회원가입 마무리 페이지(/signup/extra)로 보내는데, 이때 구글 데이터(variables)를 보따리에 싸서 보냄!
        navigate("/signup/extra", { state: { googleData: variables } });
      } else {
        // [기존 유저] 정상 로그인 처리
        const { token, user } = data;
        setLogin(token, user);
        navigate("/"); // 딜레이 없이 즉시 메인 이동
      }
    },
    onError: (error) => {
      setToast({
        open: true,
        message: "구글 로그인 실패. 다시 시도해주세요.",
        severity: "error",
      });
    },
  });

  // 폼에서 [로그인] 버튼을 눌렀을 때 실행될 함수 (handleSubmit이 에러가 없을 때만 이걸 실행시켜줌)
  const onSubmit = (data) => {
    mutation.mutate(data); // 백엔드로 슛!
  };

  // 구글 버튼 누르고 구글 서버에서 성공적으로 응답을 받았을 때 실행됨
  const handleGoogleSuccess = (credentialResponse) => {
    // 구글이 준 암호 덩어리(credential)를 해석함
    const decodedPayload = jwtDecode(credentialResponse.credential);
    // 우리 백엔드가 좋아하는 입맛대로 데이터를 포장함
    const googleData = {
      email: decodedPayload.email,
      nickname: decodedPayload.name,
      providerId: decodedPayload.sub,
      profileImage: decodedPayload.picture,
    };
    googleMutation.mutate(googleData); // 우리 백엔드에 슛!
  };

  /* 🎨 여기서부터는 진짜 화면에 보여지는 UI (JSX) 부분입니다 */
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>WithDay 로그인</h1>
          <p className={styles.subtitle}>당신의 여행 일정을 확인해보세요.</p>
        </div>

        {/* handleSubmit(onSubmit): HTML 기본 제출 기능을 막고, React Hook Form의 검증을 거친 후 onSubmit을 실행시킴 */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* FormField: 팀장님이 만든 래퍼. error 속성에 errors.email을 넘기면 알아서 빨간 글씨를 띄워줌 */}
          <FormField label="이메일" error={errors.email}>
            {/* {...register('email')}: 이 input창을 폼 감시 대상 'email'로 등록함! */}
            <Input
              type="email"
              placeholder="이메일을 입력하세요"
              {...register("email")}
            />
          </FormField>

          <FormField label="비밀번호" error={errors.password}>
            <div className={styles.pwInputWrap}>
              <Input
                type={showPw ? "text" : "password"} // showPw 상태에 따라 글자가 보일지 마스킹될지 바뀜
                placeholder="비밀번호를 입력하세요"
                {...register("password")} // 'password' 감시 대상으로 등록
                style={{ paddingRight: "40px" }} // 글씨가 눈알 아이콘을 파고들지 않게 오른쪽 여백 줌
              />
              {/* 눈알 아이콘을 누르면 showPw 상태가 반대로 뒤집힘 (true <-> false) */}
              <div className={styles.pwIcon} onClick={() => setShowPw(!showPw)}>
                {showPw ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </div>
            </div>
          </FormField>

          {/* 버튼: 서버와 통신 중(isPending)일 때는 버튼을 비활성화(disabled) 시켜서 유저가 여러 번 누르는 걸 막음 */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={mutation.isPending || googleMutation.isPending}
          >
            {mutation.isPending ? "로그인 중..." : "로그인"}
          </Button>
        </form>

        <div className={styles.googleLoginWrap}>
          {/* 구글에서 제공하는 공식 컴포넌트 */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setToast({
                open: true,
                message: "구글 로그인 창이 닫혔거나 실패했습니다.",
                severity: "error",
              })
            }
          />
        </div>

        <p className={styles.linkText}>
          아직 계정이 없으신가요?{" "}
          <span
            className={styles.linkClickable}
            onClick={() => navigate("/signup")}
          >
            회원가입하기
          </span>
        </p>
      </div>

      {/* MUI 알림창: toast 상태에 따라 화면 하단에 스르륵 나타났다가 3초(3000ms) 후 사라짐 */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
