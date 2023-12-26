import React from "react";
import { Image } from "react-native";
import {
  HomeSolidIcon,
  LeaderboardSolidIcon,
  SearchSolidIcon,
  MoreActionSolidIcon,
  FollowSolidIcon,
  CommentSolidIcon,
  ShareSolidIcon,
  TournamentSolidIcon,
  FriendsSolidIcon,
  BellOutlineIcon,
  ChatOutlineIcon,
} from "../../assets/customIcons/colored";
import {
  HomeOutlineIcon,
  LeaderboardOutlineIcon,
  SearchOutlineIcon,
  MoreActionsOutlineIcon,
  FollowOutlineIcon,
  CommentOutlineIcon,
  ShareOutlineIcon,
  TournamentOutlineIcon,
  FriendsOutlineIcon,
  BellOutlineIconGrey,
  ChatOutlineIconGrey,
} from "../../assets/customIcons/grey";
import likeIcon from "../../assets/gg.png";
import { DarkModeStatus } from "../app/useStore";

const CustomIconPack = [
  { name: "home", activeImage: HomeSolidIcon, inactiveImage: HomeOutlineIcon },
  {
    name: "leaderboard",
    activeImage: LeaderboardSolidIcon,
    inactiveImage: LeaderboardOutlineIcon,
  },
  {
    name: "search",
    activeImage: SearchSolidIcon,
    inactiveImage: SearchOutlineIcon,
  },
  {
    name: "options",
    activeImage: MoreActionSolidIcon,
    inactiveImage: MoreActionsOutlineIcon,
  },
  {
    name: "follow",
    activeImage: FollowSolidIcon,
    inactiveImage: FollowOutlineIcon,
  },
  {
    name: "comment",
    activeImage: CommentSolidIcon,
    inactiveImage: CommentOutlineIcon,
  },
  {
    name: "share",
    activeImage: ShareSolidIcon,
    inactiveImage: ShareOutlineIcon,
  },
  {
    name: "tournament",
    activeImage: TournamentSolidIcon,
    inactiveImage: TournamentOutlineIcon,
  },
  {
    name: "people",
    activeImage: FriendsSolidIcon,
    inactiveImage: FriendsOutlineIcon,
  },
  {
    name: "notifications",
    activeImage: BellOutlineIcon,
    inactiveImage: BellOutlineIconGrey,
  },
  {
    name: "chat",
    activeImage: ChatOutlineIcon,
    inactiveImage: ChatOutlineIconGrey,
  },
  { name: "like", activeImage: likeIcon, inactiveImage: likeIcon },
];

export function CustomIcon(props) {
const mode = DarkModeStatus()
  const sizeResponser = () => {
    if (props.active == true) {
      return props.size ? props.size : 25;
    } else {
      return props.size ? props.size - 2 : 24;
    }
  };

  let size = sizeResponser();
  let name = props.name ? props.name : "home";
  let iconIndex = CustomIconPack.findIndex((icon) => icon.name === name);
  let iconSource = props.active
    ? CustomIconPack[iconIndex].activeImage
    : CustomIconPack[iconIndex].inactiveImage;

  return (
    <Image
      source={iconSource}
      style={[{ width: size, height: size , tintColor : props.active ? props.color : ( mode ? '#fff' :  '#ccc')  }, props.style]}
    />
  );
}
