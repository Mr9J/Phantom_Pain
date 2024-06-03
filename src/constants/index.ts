import {
  HomeIcon,
  BookAIcon,
  UsersIcon,
  BookmarkIcon,
  SquarePenIcon,
  UserRoundSearchIcon,
} from "lucide-react";

export const startingFeatures = [
  "Create a project plan and define your goals",
  "Identify your target audience and conduct market research",
  "Develop a compelling project pitch and create a captivating project description",
];

export const newFeatures = [
  {
    imgSource: "1",
    title: "A new world",
    subtitle:
      "we have the latest update with new world for you to try never mind",
  },
  {
    imgSource: "2",
    title: "More realistic",
    subtitle:
      "In the latest update, your eyes are narrow, making the world more realistic than ever",
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
