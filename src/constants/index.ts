import {
  HomeIcon,
  BookAIcon,
  UsersIcon,
  BookmarkIcon,
  SquarePenIcon,
  UserRoundSearchIcon,
} from "lucide-react";

export const startingFeatures = ["確立主題", "尋找目標受眾", "與用戶即時互動"];

export const newFeatures = [
  {
    imgSource: "1",
    title: "社群共享和合作",
    subtitle:
      "建立一個強大的社群平台，不僅提供募資功能，還促進創作者、投資者和支持者之間的交流和合作。這可以通過討論區、專家分享、合作計劃等方式實現。",
  },
  {
    imgSource: "2",
    title: "即時互動",
    subtitle:
      "建立一個即時互動的平台，讓使用者可以參與項目的發展過程，提供意見和建議，並參與投票選擇優秀的項目。這可以增加使用者的參與感和滿意度。",
  },
];

export const sidebarLinks = [
  { icon: HomeIcon, to: "/", label: "首頁" },
  { icon: UserRoundSearchIcon, to: "/social", label: "社群" },
  { icon: BookAIcon, to: "/browser", label: "瀏覽" },
  { icon: UsersIcon, to: "/all-users", label: "使用者" },
  {
    icon: BookmarkIcon,
    to: "/bookmarks",
    label: "書籤",
  },
  {
    icon: SquarePenIcon,
    to: "/create-post",
    label: "發布",
  },
];

export const bottombarLinks = [
  { icon: HomeIcon, to: "/", label: "首頁" },
  { icon: UserRoundSearchIcon, to: "/social", label: "社群" },
  { icon: BookAIcon, to: "/browser", label: "瀏覽" },
  {
    icon: BookmarkIcon,
    to: "/bookmarks",
    label: "書籤",
  },
  {
    icon: SquarePenIcon,
    to: "/create-post",
    label: "發布",
  },
];
