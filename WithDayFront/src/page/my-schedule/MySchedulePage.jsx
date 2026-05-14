import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MySchedulePage.module.css";
import { useRequireAuth } from "../../features/auth/hooks/useRequireAuth";
import { PARTICIPATION_TABS } from "../../features/participation/model/constants";
import {
  useMySchedulesQuery,
  useParticipationMutation,
} from "../../features/participation/model/queries";
import ParticipationFeedback from "../../features/participation/ui/ParticipationFeedback/ParticipationFeedback";
import ParticipationTabs from "../../features/participation/ui/ParticipationTabs/ParticipationTabs";
import {
  ParticipationModal,
  ScheduleList,
} from "../../features/participation/ui";

const DEFAULT_SCHEDULES = {
  participating: [],
  pending: [],
  hosting: [],
};

const INITIAL_MODAL_STATE = {
  open: false,
  title: "",
  description: "",
  confirmLabel: "확인",
  payload: null,
};

const buildModalContent = (item) => {
  if (item.dbStatus === "PENDING") {
    return {
      title: "신청 취소",
      description: "이 일정에 대한 참여 신청을 취소하시겠습니까?",
      confirmLabel: "신청 취소",
    };
  }

  return {
    title: "참여 내역 삭제",
    description: "거절되거나 종료된 참여 내역을 목록에서 삭제하시겠습니까?",
    confirmLabel: "삭제",
  };
};

const MySchedulePage = () => {
  const [activeTab, setActiveTab] = useState("participating");
  const [feedback, setFeedback] = useState(null);
  const [modalState, setModalState] = useState(INITIAL_MODAL_STATE);

  const navigate = useNavigate();
  const { authEmail, isAuthenticated } = useRequireAuth();
  const email = authEmail;

  const {
    data: schedules = DEFAULT_SCHEDULES,
    isPending,
    error,
  } = useMySchedulesQuery(email);
  const {
    cancelParticipation,
    deleteParticipation,
    isPending: isMutationPending,
  } = useParticipationMutation(email);

  const currentItems = useMemo(
    () => schedules[activeTab] ?? [],
    [activeTab, schedules]
  );

  const errorMessage = useMemo(
    () =>
      error?.response?.data?.message ?? "내 일정 정보를 불러오지 못했습니다.",
    [error]
  );

  const emptyMessage = email
    ? "해당하는 일정이 없습니다."
    : "로그인 후 내 일정을 확인해 주세요.";

  const handleCloseFeedback = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedback(null);
  }, []);

  const showFeedback = useCallback((severity, message) => {
    setFeedback({ severity, message });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState(INITIAL_MODAL_STATE);
  }, []);

  const runScheduleMutation = useCallback(
    async ({ request, successMessage, failureMessage }) => {
      try {
        await request();
        showFeedback("success", successMessage);
      } catch (mutationError) {
        showFeedback(
          "error",
          mutationError?.response?.data?.message ?? failureMessage
        );
      }
    },
    [showFeedback]
  );

  const handleScheduleAction = useCallback(
    async (item) => {
      if (!email) {
        navigate("/login", { replace: true });
        return;
      }

      if (item.myRole === "host" || item.dbStatus === "APPROVED") {
        navigate(`/schedule/${item.scheduleId}`);
        return;
      }

      if (item.dbStatus === "PENDING") {
        setModalState({
          open: true,
          payload: item,
          ...buildModalContent(item),
        });
        return;
      }

      if (item.dbStatus === "REJECTED" || item.dbStatus === "KICKED") {
        setModalState({
          open: true,
          payload: item,
          ...buildModalContent(item),
        });
      }
    },
    [email, navigate]
  );

  const handleConfirmModal = useCallback(async () => {
    const targetItem = modalState.payload;

    if (!targetItem || !email) {
      handleCloseModal();
      return;
    }

    if (targetItem.dbStatus === "PENDING") {
      await runScheduleMutation({
        successMessage: "신청이 취소되었습니다.",
        failureMessage:
          "신청 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        request: () =>
          cancelParticipation({
            participationId: targetItem.participationId,
            email,
          }),
      });
    }

    if (
      targetItem.dbStatus === "REJECTED" ||
      targetItem.dbStatus === "KICKED"
    ) {
      await runScheduleMutation({
        successMessage: "참여 내역이 삭제되었습니다.",
        failureMessage: "삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        request: () =>
          deleteParticipation({
            participationId: targetItem.participationId,
            email,
          }),
      });
    }

    handleCloseModal();
  }, [
    cancelParticipation,
    deleteParticipation,
    email,
    handleCloseModal,
    modalState.payload,
    runScheduleMutation,
  ]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2 className={styles.title}>내 일정</h2>
      </div>

      <ParticipationFeedback
        feedback={feedback}
        onClose={handleCloseFeedback}
      />

      <ParticipationModal
        open={modalState.open}
        title={modalState.title}
        description={modalState.description}
        confirmLabel={modalState.confirmLabel}
        loading={isMutationPending}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
      />

      <ParticipationTabs
        tabs={PARTICIPATION_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <ScheduleList
        items={currentItems}
        loading={isPending}
        errorMessage={error ? errorMessage : ""}
        emptyMessage={emptyMessage}
        onItemAction={handleScheduleAction}
        isActionLoading={isMutationPending}
      />
    </div>
  );
};

export default MySchedulePage;
