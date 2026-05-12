import { useCallback, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchScheduleDetail } from "../../features/schedule/api";
import { getAuthUser } from "../../features/auth/lib/getAuthUser";
import {
  useScheduleApplicantsQuery,
} from "../../features/participation/model/queries";
import {
  useUpdateParticipationStatusMutation,
} from "../../features/participation/model/mutations";
import ParticipationFeedback from "../../features/participation/ui/ParticipationFeedback/ParticipationFeedback";
import HostParticipationList from "../../features/participation/ui/HostParticipationList/HostParticipationList";

// 위젯 및 피처 불러오기
import ScheduleImageSlider from "../../features/schedule/ui/ScheduleImageSlider";
import ScheduleInfo from "../../features/schedule/ui/ScheduleInfo";
import ScheduleDailyPlan from "../../features/schedule/ui/ScheduleDailyPlan";
import ApplyScheduleButton from "../../features/schedule/ui/ApplyScheduleButton";

// 스타일
import styles from "./ScheduleDetail.module.css";

export default function ScheduleDetail() {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const authUser = useMemo(() => getAuthUser(), []);
  const authEmail = authUser?.email?.trim() ?? "";

  // 🌟 React Query 적용: 로딩 상태, 에러, 데이터 캐싱을 한 번에 관리
  const { data, isLoading, isError } = useQuery({
    queryKey: ["schedule", scheduleId],
    queryFn: () => fetchScheduleDetail(scheduleId),
    staleTime: 1000 * 60 * 5, // 5분 동안은 새로고침 없이 캐시 데이터 사용
  });

  const {
    data: applicants = [],
    isPending: isApplicantsLoading,
    error: applicantsError,
  } = useScheduleApplicantsQuery({
    scheduleId,
    email: authEmail,
    status: "PENDING",
  });

  const { updateParticipationStatus, isPending: isStatusUpdating } =
    useUpdateParticipationStatusMutation();

  const isApplicantsForbidden = applicantsError?.response?.status === 403;
  const applicantsErrorMessage = applicantsError && !isApplicantsForbidden
    ? applicantsError?.response?.data?.message ??
      applicantsError?.response?.data ??
      "신청자 목록을 불러오지 못했습니다."
    : "";

  const handleCloseFeedback = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedback(null);
  }, []);

  const handleApplicantAction = useCallback(
    async ({ participationId, status, reason }) => {
      if (!authEmail) {
        navigate("/login", { replace: true });
        return;
      }

      const confirmText =
        status === "APPROVED"
          ? "이 신청을 승인하시겠습니까?"
          : status === "REJECTED"
          ? "이 신청을 거절하시겠습니까?"
          : "승인을 취소하시겠습니까?";

      if (!window.confirm(confirmText)) {
        return;
      }

      try {
        await updateParticipationStatus({
          participationId,
          email: authEmail,
          status,
          reason,
        });

        setFeedback({
          severity: "success",
          message:
            status === "APPROVED"
              ? "신청을 승인했습니다."
              : status === "REJECTED"
              ? "신청을 거절했습니다."
              : "승인을 취소했습니다.",
        });
      } catch (error) {
        const message =
          error?.response?.data?.message ??
          error?.response?.data ??
          error?.message ??
          "상태 변경에 실패했습니다.";

        setFeedback({
          severity: "error",
          message: typeof message === "string" ? message : "상태 변경에 실패했습니다.",
        });
      }
    },
    [authEmail, navigate, updateParticipationStatus]
  );

  if (isLoading) return <div className={styles.container}>로딩 중...</div>;
  if (isError)
    return (
      <div className={styles.container}>데이터를 불러오는 데 실패했습니다.</div>
    );
  if (!data || !data.schedule)
    return <div className={styles.container}>일정 정보가 없습니다.</div>;

  const { schedule, details, images } = data;

  return (
    <div className={styles.container}>
      {/* 1. 이미지 슬라이더 영역 */}
      <ScheduleImageSlider
        images={images}
        thumbnail={schedule.thumbnailImage}
      />

      {/* 2. 상세 정보 영역 */}
      <ScheduleInfo schedule={schedule} />

      {/* 3. 세부 일정 (Day-by-Day) */}
      {details && details.length > 0 && (
        <>
          <hr className={styles.divider} />
          <ScheduleDailyPlan details={details} />
        </>
      )}

      {authEmail && !isApplicantsForbidden && (
        <HostParticipationList
          items={applicants}
          loading={isApplicantsLoading}
          errorMessage={applicantsErrorMessage}
          emptyMessage="승인 대기중인 신청자가 없습니다."
          hostEmail={authEmail}
          onItemAction={handleApplicantAction}
          isActionLoading={isStatusUpdating}
        />
      )}

      {/* 4. 하단 고정 신청 바 (Feature 렌더링) */}
      <footer className={styles.stickyFooter}>
        <div className={styles.footerInfo}>
          <span className={styles.recruitDeadline}>
            마감일: {schedule.recruitEndDate}
          </span>
        </div>

        {/* 🌟 분리해둔 기능(Feature) 컴포넌트 마운트 */}
        <ApplyScheduleButton scheduleId={schedule.id} status={schedule.status} />
      </footer>

      <ParticipationFeedback feedback={feedback} onClose={handleCloseFeedback} />
    </div>
  );
}
