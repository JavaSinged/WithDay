import { Input, TextArea } from "../../shared/ui/Form/Form";
import styles from "./WriteSchedule.module.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ko } from "date-fns/locale";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import Button from "../../shared/ui/Button/Button";
import { useQuery } from "@tanstack/react-query";
import { getDetailRegion, getRegion } from "../../features/region/api";
import { insertSchedule } from "../../features/schedule/api";
import { useAuthStore } from "../../features/auth/store/authStore";

import { insertSchema } from "../../features/schedule/validation/insertSchema";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

registerLocale("ko", ko);

const WriteSchedule = () => {
  const navigate = useNavigate();

  // DB Enum 매핑용 카테고리 리스트
  const categories = [
    { label: "선택하세요", value: "" },
    { label: "여행", value: "travel" },
    { label: "팝업", value: "popup" },
    { label: "식사", value: "food" },
    { label: "액티비티", value: "activity" },
    { label: "문화", value: "culture" },
    { label: "기타", value: "etc" },
  ];

  const [post, setPost] = useState({
    email: useAuthStore.getState().user.email,
    title: "",
    description: "",
    category: "", // 초기값 빈 문자열
    region: "",
    detailRegion: "",
    chatLink: "",
    startDate: new Date(),
    endDate: new Date(),
    recruitStartDate: new Date(),
    recruitEndDate: new Date(),
    minParticipants: 2,
    maxParticipants: 10,
    ageMin: 20,
    ageMax: 50,
    genderLimit: "all", // DB Enum: 'all', 'male', 'female'
    totalPrice: "",
    costType: "per_person", // DB Enum: 'per_person', 'host_covered', 'free', 'custom'
    thumbnail: "",
  });

  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [detailSchedule, setDetailSchedule] = useState([]);

  useEffect(() => {
    return () => {
      // 페이지 벗어날 때 초기화
      setPost({
        email: "",
        title: "",
        description: "",
        category: "",
        region: "",
        detailRegion: "",
        chatLink: "",
        startDate: new Date(),
        endDate: new Date(),
        recruitStartDate: new Date(),
        recruitEndDate: new Date(),
        minParticipants: null,
        maxParticipants: null,
        ageMin: null,
        ageMax: null,
        genderLimit: "all",
        totalPrice: null,
        costType: "per_person",
        thumbnail: "",
      });
      setFiles([]);
      setDetailSchedule([]);
    };
  }, []);

  /* 시/도 조회 */
  const { data: regions = [] } = useQuery({
    queryKey: ["region"],
    queryFn: getRegion,
  });

  /* 군/구 조회 */
  const { data: detailRegions = [] } = useQuery({
    queryKey: ["detailRegion", post.region],
    queryFn: () => getDetailRegion(post.region),
    enabled: !!post.region,
  });

  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await insertSchema.validate(
        { post, files, detailSchedule },
        { abortEarly: false }
      );

      const payload = insertSchema.cast({
        post,
        files,
        detailSchedule,
      });

      const res = await insertSchedule(payload, files, detailSchedule);
      console.log("등록 성공:", res);
      navigate("/schedules"); // 성공 시 리스트로 이동 예시
    } catch (err) {
      if (err.name === "ValidationError") {
        const messages = err.inner.map((e) => e.message);
        setAlertMessage(messages.join("\n"));
        setAlertOpen(true);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <>
      <header className={styles.header}></header>
      <main className={styles.main}>
        <div className={styles.contentWrap}>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className={styles.inputContentWrap}>
              <h2 className={styles.inputTitle}>기본 정보</h2>

              {/* 일정명 */}
              <ul className={`${styles.inputWrap} ${styles.title}`}>
                <li>
                  <label htmlFor="title">일정명</label>
                </li>
                <li>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={post.title}
                    onChange={(e) =>
                      setPost({ ...post, title: e.target.value })
                    }
                  />
                </li>
              </ul>

              {/* 설명 */}
              <ul className={`${styles.inputWrap} ${styles.description}`}>
                <li>
                  <label htmlFor="description">일정 설명</label>
                </li>
                <li>
                  <TextArea
                    name="description"
                    id="description"
                    value={post.description}
                    onChange={(e) =>
                      setPost({ ...post, description: e.target.value })
                    }
                  />
                </li>
              </ul>

              {/* 일정 종류 (Category Enum) */}
              <ul className={`${styles.inputWrap} ${styles.category}`}>
                <li>
                  <label htmlFor="category">일정 종류</label>
                </li>
                <li>
                  <select
                    value={post.category}
                    onChange={(e) =>
                      setPost({ ...post, category: e.target.value })
                    }
                  >
                    {categories.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </li>
              </ul>

              {/* 지역 선택 */}
              <ul className={`${styles.inputWrap} ${styles.region}`}>
                <li>
                  <label htmlFor="region">지역(시/도)</label>
                </li>
                <li>
                  <select
                    value={post.region || ""}
                    onChange={(e) =>
                      setPost({
                        ...post,
                        region: e.target.value,
                        detailRegion: "",
                      })
                    }
                  >
                    <option value="">시/도</option>
                    {regions?.map((item) => (
                      <option key={item.regionId} value={item.regionName}>
                        {item.regionName}
                      </option>
                    ))}
                  </select>
                </li>
              </ul>
              <ul className={`${styles.inputWrap} ${styles.detailRegion}`}>
                <li>
                  <label htmlFor="detailRegion">지역(시/군/구)</label>
                </li>
                <li>
                  <select
                    value={post.detailRegion || ""}
                    onChange={(e) =>
                      setPost({ ...post, detailRegion: e.target.value })
                    }
                  >
                    <option value="">시/군/구</option>
                    {detailRegions?.map((item) => (
                      <option key={item.detailId} value={item.detailName}>
                        {item.detailName}
                      </option>
                    ))}
                  </select>
                </li>
              </ul>

              {/* 오픈채팅 링크 */}
              <ul className={`${styles.inputWrap} ${styles.link}`}>
                <li>
                  <label htmlFor="link">오픈 채팅 링크</label>
                </li>
                <li>
                  <Input
                    type="text"
                    value={post.chatLink}
                    onChange={(e) =>
                      setPost({ ...post, chatLink: e.target.value })
                    }
                  />
                </li>
              </ul>
            </div>

            <div className={styles.inputContentWrap}>
              <h2 className={styles.inputTitle}>인원 및 성별 정보</h2>
              <div className={styles.gridContainer}>
                {/* 최소/최대 인원 및 연령 로직 (기존과 동일하되 명칭만 Enum 대응 확인) */}
                <ul className={styles.inputWrap}>
                  <li>최소 인원</li>
                  <li>
                    <Input
                      type="number"
                      value={post.minParticipants ?? ""}
                      onChange={(e) =>
                        setPost({
                          ...post,
                          minParticipants: Number(e.target.value),
                        })
                      }
                    />{" "}
                    명
                  </li>
                </ul>
                <ul className={styles.inputWrap}>
                  <li>최대 인원</li>
                  <li>
                    <Input
                      type="number"
                      value={post.maxParticipants ?? ""}
                      onChange={(e) =>
                        setPost({
                          ...post,
                          maxParticipants: Number(e.target.value),
                        })
                      }
                    />{" "}
                    명
                  </li>
                </ul>

                {/* 성별 제한 (GenderLimit Enum) */}
                <ul className={`${styles.inputWrap} ${styles.genderInfo}`}>
                  <li>성별 제한</li>
                  <li>
                    <Button
                      type="button"
                      variant={
                        post.genderLimit === "all" ? "primary" : "outline"
                      }
                      onClick={() => setPost({ ...post, genderLimit: "all" })}
                    >
                      성별 무관
                    </Button>
                    <Button
                      type="button"
                      variant={
                        post.genderLimit === "male" ? "primary" : "outline"
                      }
                      onClick={() => setPost({ ...post, genderLimit: "male" })}
                    >
                      남성
                    </Button>
                    <Button
                      type="button"
                      variant={
                        post.genderLimit === "female" ? "primary" : "outline"
                      }
                      onClick={() =>
                        setPost({ ...post, genderLimit: "female" })
                      }
                    >
                      여성
                    </Button>
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.inputContentWrap}>
              <h2 className={styles.inputTitle}>일정 및 모집 기간</h2>
              <CalendarRange post={post} setPost={setPost} />

              <ul className={`${styles.inputWrap} ${styles.recruitmentPeriod}`}>
                <li>
                  <label>모집 마감일</label>
                </li>
                <li>
                  <DatePicker
                    locale="ko"
                    selected={post.recruitEndDate}
                    onChange={(date) =>
                      setPost({ ...post, recruitEndDate: date })
                    }
                    minDate={new Date()}
                    maxDate={post.startDate}
                    customInput={
                      <button type="button" className={styles.dateButton}>
                        📅{" "}
                        {post.recruitEndDate?.toLocaleDateString() ||
                          "날짜 선택"}
                      </button>
                    }
                  />
                </li>
              </ul>
            </div>

            <div className={styles.inputContentWrap}>
              <h2 className={styles.inputTitle}>상세 일정</h2>
              <ScheduleTable
                startDate={post.startDate}
                endDate={post.endDate}
                detailSchedule={detailSchedule}
                setDetailSchedule={setDetailSchedule}
              />
            </div>

            <div className={styles.inputContentWrap}>
              <h2 className={styles.inputTitle}>정산 방식</h2>
              <ul className={`${styles.inputWrap} ${styles.costWrap}`}>
                <li>총액</li>
                <li className={styles.cost}>
                  <input
                    type="text"
                    className={styles.costInput}
                    value={formatNumber(post.totalPrice)}
                    onChange={(e) =>
                      setPost({
                        ...post,
                        totalPrice: e.target.value.replace(/[^0-9]/g, ""),
                      })
                    }
                  />
                  <span className={styles.won}>₩</span>
                </li>
              </ul>

              {/* 정산 방식 (CostType Enum) */}
              <ul className={`${styles.inputWrap} ${styles.costSharingWrap}`}>
                <li>정산 방식</li>
                <li className={styles.costSharingContent}>
                  <div className={styles.costSharing}>
                    <Button
                      type="button"
                      variant={
                        post.costType === "per_person" ? "primary" : "outline"
                      }
                      onClick={() =>
                        setPost({ ...post, costType: "per_person" })
                      }
                    >
                      총액 1 / N<div className={styles.desc}>나누어 지불</div>
                    </Button>
                    <Button
                      type="button"
                      variant={
                        post.costType === "host_covered" ? "primary" : "outline"
                      }
                      onClick={() =>
                        setPost({ ...post, costType: "host_covered" })
                      }
                    >
                      호스트 지불
                      <div className={styles.desc}>호스트 전액 부담</div>
                    </Button>
                    <Button
                      type="button"
                      variant={post.costType === "free" ? "primary" : "outline"}
                      onClick={() => setPost({ ...post, costType: "free" })}
                    >
                      무료
                      <div className={styles.desc}>비용 없음</div>
                    </Button>
                    <Button
                      type="button"
                      variant={
                        post.costType === "custom" ? "primary" : "outline"
                      }
                      onClick={() => setPost({ ...post, costType: "custom" })}
                    >
                      인당 고정
                      <div className={styles.desc}>정해진 금액 지불</div>
                    </Button>
                  </div>
                </li>
              </ul>
            </div>

            <div className={styles.inputContentWrap}>
              <h2 className={styles.inputTitle}>첨부 이미지</h2>
              <AddThumbnail
                images={images}
                setImages={setImages}
                files={files}
                setFiles={setFiles}
              />
            </div>

            <div className={styles.registButtonWrap}>
              <Button type="submit">등록</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                취소
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ whiteSpace: "pre-line" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

/* --- 서브 컴포넌트들 (기존 로직 유지) --- */

const CalendarRange = ({ post, setPost }) => {
  const [state, setState] = useState([
    {
      startDate: post.startDate || new Date(),
      endDate: post.endDate || new Date(),
      key: "selection",
    },
  ]);

  const handleChange = (item) => {
    const selection = item.selection;
    setState([selection]);
    setPost((prev) => ({
      ...prev,
      startDate: selection.startDate,
      endDate: selection.endDate,
    }));
  };

  return (
    <div className={styles.calendarWrapper}>
      <DateRange
        locale={ko}
        ranges={state}
        onChange={handleChange}
        minDate={new Date()}
      />
      <div className={styles.dateWrap}>
        <p>시작: {post.startDate?.toLocaleDateString()}</p>
        <p>종료: {post.endDate?.toLocaleDateString()}</p>
      </div>
    </div>
  );
};

const ScheduleTable = ({
  startDate,
  endDate,
  detailSchedule,
  setDetailSchedule,
}) => {
  useEffect(() => {
    const diff = endDate - startDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    const arr = Array.from({ length: days }, (_, i) => ({
      dayNumber: i + 1,
      title: "",
      description: "",
    }));
    setDetailSchedule(arr);
  }, [startDate, endDate]);

  const handleChange = (index, key, value) => {
    setDetailSchedule((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  return (
    <div className={styles.scheduleTableWrap}>
      <table className={styles.scheduleTable}>
        <thead>
          <tr>
            <th>일차</th>
            <th>제목</th>
            <th>소개</th>
          </tr>
        </thead>
        <tbody>
          {detailSchedule.map((row, i) => (
            <tr key={i}>
              <td>{row.dayNumber}</td>
              <td>
                <input
                  value={row.title}
                  onChange={(e) => handleChange(i, "title", e.target.value)}
                />
              </td>
              <td>
                <textarea
                  value={row.description}
                  onChange={(e) =>
                    handleChange(i, "description", e.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddThumbnail = ({ images, setImages, files, setFiles }) => {
  const fileInputRef = useRef(null);
  const addImage = (file) => {
    if (images.length >= 3) return alert("최대 3장까지 가능합니다.");
    setImages((prev) => [...prev, URL.createObjectURL(file)]);
    setFiles((prev) => [...prev, file]);
  };

  return (
    <div className={styles.imageZone}>
      <div
        className={styles.dropZone}
        onClick={() => fileInputRef.current.click()}
      >
        이미지를 드롭하거나 클릭하세요 (최대 3장)
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => Array.from(e.target.files).forEach(addImage)}
        style={{ display: "none" }}
      />
      <div className={styles.previewGrid}>
        {images.map((img, i) => (
          <div key={i} className={styles.imageWrap}>
            <img src={img} alt="preview" className={styles.image} />
            <button
              type="button"
              onClick={() => {
                setImages(images.filter((_, idx) => idx !== i));
                setFiles(files.filter((_, idx) => idx !== i));
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WriteSchedule;
