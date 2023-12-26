import React, { useState, createRef, useEffect } from "react";
import {
  Alert,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  Colors,
  getDarkTheme,
  getLightTheme,
  inputDarkTheme,
} from "../../../utils/colors";
import { Chat, defaultTheme, MessageType } from "@flyerhq/react-native-chat-ui";
import * as ImagePicker from "expo-image-picker";
import { getDatabase, ref, onValue, set, get, off } from "firebase/database";
import { DarkModeStatus, UserId, UserToken } from "../../../app/useStore";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import LoadingModal from "../../../components/loadingModal";
import { BottomSheet } from "../../../components/BottomSheet";
import { Loading, ServerError } from "../../../components/exceptionHolders";
import { useIsFocused } from "@react-navigation/native";

export default function ChatMessageScreen({ route, navigation }) {
  const isFocused = useIsFocused();

  useEffect(() => {
    getMyProfile();
  }, []);

  useEffect(() => {
    getChatMessages();

    return () => {
      const reference = ref(db, "chats/" + `${chatId}/chats`);
      off(reference, "value");
    };
  }, []);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatPointer, setChatPointer] = useState(null);
  const [chatId, setChatId] = useState(route.params.user.chatId); // from profile

  const user = route.params.user;

  const token = UserToken();
  const currentUserId = UserId();

  const db = getDatabase();

  const BottomSheetRef = createRef();

  const mode = DarkModeStatus();

  const getMyProfile = async () => {
    setLoading(true);
    await axios
      .get(ApiCollection.userController.getMyProfile, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          setCurrentUser({
            name: response.data.data.name,
            username: response.data.data.username,
            profilePic: response.data.data.profilePic,
            id: response.data.data.id,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Session Expired", "Please Login again !");
        navigation.goBack();
      });
  };

  const getChatMessages = async () => {
    const reference = ref(db, "chats/" + `${chatId}/chats`);
    onValue(reference, (snapshot) => {
      let chats = snapshot.val();
      if (chats) {
        const memberRef = ref(db, "chats/" + `${chatId}/members`);
        get(memberRef).then((memberSnapshot) => {
          if (memberSnapshot.val()) {
            const filtered = memberSnapshot
              .val()
              .filter((member) => member.id == currentUserId);
            const memberPointer = memberSnapshot
              .val()
              .findIndex((member) => member.id == currentUserId);
            if (filtered.length !== 0 && memberPointer !== -1) {
              const memberObject = filtered[0];
              memberObject.readLatest = true;
              set(
                ref(db, "chats/" + `${chatId}/members/${memberPointer}`),
                memberObject
              );
            }
          }
        });
        setMessages(chats);
      } else {
        setMessages([]);
      }
    });
  };

  function updateFirebase(chatArray, message) {
    let chatSchema = {
      members: [
        {
          id: `${currentUserId}`,
          readLatest: true,
          name: `${currentUser.name}`,
          username: `${currentUser.username}`,
          avatar: `${currentUser.profilePic}`,
        },
        {
          id: `${user.id}`,
          readLatest: false,
          name: `${user.name}`,
          username: `${user.username}`,
          avatar: `${user.profilePic}`,
        },
      ],
      updatedAt: new Date().getTime(),
      chatId: `${chatId}`,
      creator: `${currentUserId}`,
      chats: chatArray,
    };
    const reference = ref(db, "chats/" + `${chatId}`);
    sendNotification(message);
    set(reference, chatSchema);
  }

  const sendNotification = async (message) => {
    const memberRef = ref(db, "chats/" + `${chatId}/members`);
    get(memberRef).then((memberSnapshot) => {
      if (memberSnapshot.val()) {
        const filtered = memberSnapshot
          .val()
          .filter((member) => member.id != currentUserId);
        filtered.forEach(async (member) => {
          axios.post(
            `${ApiCollection.notificationController.sendNotification}/${member.id}`,
            {
              title: `New message from ${currentUser.username} !`,
              content: `${
                message.type == "text" ? message.text : "Sent you a photo"
              }`,
            },
            { headers: { Authorization: "Bearer " + token } }
          );
          // if(member.readLatest==false){

          // }
        });
      }
    });
  };

  const addMessage = (message) => {
    setMessages([message, ...messages]);
    updateFirebase([message, ...messages], message);
    //sendNotification(message)
  };

  const handleSendPress = (message) => {
    const textMessage = {
      author: { id: currentUserId, imageUrl: `${currentUser.profilePic}` },
      createdAt: Date.now(),
      id: Date.now() + `__${currentUserId}`,
      text: message.text,
      type: "text",
    };
    addMessage(textMessage);
  };

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.JPEG,
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      let temp = [];
      const imageMessage = {
        height: result.height,
        name: result.uri?.split("/").pop() ?? "🖼",
        type: "image",
        uri: `data:image/*;base64,${result.base64}`,
        width: result.width,
        author: { id: currentUserId, imageUrl: `${currentUser.profilePic}` },
        createdAt: Date.now(),
        id: Date.now() + `__${currentUserId}`,
      };
      addMessage(imageMessage);
    }
  };

  const deleteChatMessage = () => {
    messages.splice(
      messages.findIndex((message) => message.id === chatPointer.id),
      1
    );
    setMessages([...messages]);
    updateFirebase([...messages]);
    BottomSheetRef.current.close();
  };

  const pointerHandler = (chat) => {
    setChatPointer(chat);
  };

  const longPressHandler = (chat) => {
    if (chat.author.id == currentUserId) {
      BottomSheetRef?.current?.open();
      pointerHandler(chat);
    }
  };

  return !loading ? (
    currentUser !== null ? (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: "black",
          },
          mode ? getDarkTheme : getLightTheme,
        ]}
      >
        <Chat
          messages={messages}
          onMessageLongPress={longPressHandler}
          onSendPress={handleSendPress}
          user={{ id: currentUserId, imageUrl: `${currentUser.profilePic}` }}
          showUserAvatars={true}
          onAttachmentPress={pickMedia}
          enableAnimation={true}
          theme={{
            ...defaultTheme,
            colors: {
              ...defaultTheme.colors,
              inputBackground: Colors.primary,
              secondary: "whitesmoke",
              primary: Colors.primary,
              background: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            },
          }}
        />
        <BottomSheet modeType={mode} ref={BottomSheetRef} heading={"Options"}>
          <TouchableOpacity
            onPress={deleteChatMessage}
            style={{
              padding: 5,
              width: "100%",
              paddingVertical: 10,
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: mode ? getDarkTheme.color : getLightTheme.color,
              }}
            >
              Delete Chat
            </Text>
          </TouchableOpacity>
        </BottomSheet>
      </View>
    ) : (
      <ServerError onRefresh={() => getMyProfile()} />
    )
  ) : (
    <Loading />
  );
}
