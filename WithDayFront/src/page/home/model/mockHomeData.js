import heroImage from "../../../assets/hero.png";

export const HOME_BANNERS = [
  {
    id: "banner-sunset-trip",
    title: "같이 떠나면\n더 즐거운 모든 순간",
    description: "여행, 팝업, 공연, 맛집까지\n새로운 사람들과 함께해요",
    imageUrl: heroImage,
    accent: "sunset",
  },
  {
    id: "banner-night-culture",
    title: "오늘 저녁,\n가볍게 합류할 모임 찾기",
    description: "퇴근 후 전시, 공연, 야간 산책까지\n혼자보다 덜 어색한 만남을 준비했어요",
    imageUrl: heroImage,
    accent: "night",
  },
  {
    id: "banner-weekend-food",
    title: "이번 주말,\n취향 맞는 사람들과 한 끼",
    description: "혼밥은 잠시 쉬고\n근처 맛집 탐방 모임을 둘러보세요",
    imageUrl: heroImage,
    accent: "dawn",
  },
];

export const HOME_CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "travel", label: "여행" },
  { id: "popup", label: "팝업" },
  { id: "food", label: "식사" },
  { id: "culture", label: "공연" },
  { id: "activity", label: "운동/액티비티" },
  { id: "etc", label: "기타" },
];

export const HOME_SCHEDULES = [
  {
    id: "home-schedule-seongsu-pop",
    title: "성수 팝업 같이 가요!",
    category: "popup",
    location: "서울 성수동",
    startDate: "2026-05-20T14:00:00+09:00",
    endDate: "2026-05-20T17:00:00+09:00",
    participants: 6,
    maxParticipants: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "home-schedule-busan-trip",
    title: "부산 1박 2일 여행 함께해요",
    category: "travel",
    location: "부산 해운대",
    startDate: "2026-05-24T08:30:00+09:00",
    endDate: "2026-05-25T20:00:00+09:00",
    participants: 3,
    maxParticipants: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "home-schedule-hongdae-show",
    title: "홍대 인디밴드 공연 보러 가요!",
    category: "culture",
    location: "서울 홍대",
    startDate: "2026-05-18T19:00:00+09:00",
    endDate: "2026-05-18T22:00:00+09:00",
    participants: 2,
    maxParticipants: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "home-schedule-wangsimni-food",
    title: "왕십리 맛집 탐방할 사람?",
    category: "food",
    location: "서울 왕십리",
    startDate: "2026-05-19T13:00:00+09:00",
    endDate: "2026-05-19T15:30:00+09:00",
    participants: 4,
    maxParticipants: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "home-schedule-hangang-run",
    title: "한강 야간 러닝 같이 뛰어요",
    category: "activity",
    location: "서울 여의도",
    startDate: "2026-05-17T20:00:00+09:00",
    endDate: "2026-05-17T21:30:00+09:00",
    participants: 5,
    maxParticipants: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "home-schedule-seoul-forest",
    title: "서울숲 피크닉 모임",
    category: "etc",
    location: "서울 서울숲",
    startDate: "2026-05-26T11:00:00+09:00",
    endDate: "2026-05-26T15:00:00+09:00",
    participants: 1,
    maxParticipants: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=1200&q=80",
  },
];
