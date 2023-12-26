import React,{useState,createRef, useEffect} from "react";
import { View, Text, Image,StyleSheet, TouchableOpacity, Dimensions,FlatList } from "react-native";
import { Colors } from "../../../utils/colors";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CustomIcon } from "../../../components/customIconPack";
import VideoPlayerFullScreen from "../../../components/VideoPlayerFullScreen";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { UserToken } from "../../../app/useStore";
import { Routes } from "../../../utils/routes";
import { CommentSheet } from "../../../components/commentSheet";
import MateriaCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from "expo-linear-gradient";
import DiscoverScrollCard from "../../../components/DiscoverScrollCard";


export default function DiscoverScrollScreen({route, navigation }) {

    const token = UserToken()

    const fields={headers:{Authorization:`Bearer ${token}`}}

    const scrollFeed =  route.params.scrollFeed.filter(item=>item.media!==undefined && item.media!==null && item.media.length>0);

    const [discoverFeed, setDiscoverFeed] = useState(scrollFeed)
    const [pageNumber, setPageNumber] = useState(route.params.page);


    const getMorePosts = async()=>{
        const newPage = pageNumber+1
        let url = `${ApiCollection.postController.getMyDiscoverFeed}?page=${newPage}&filter=${route.params.filter}`

        await axios.get(url,{headers:{'Authorization':'Bearer '+token}})
        .then(response=>{
            setPageNumber(newPage)
            let temp = []
            const feed = response.data.data.filter(item=>item.media.length>0)
            //const mediaTypeFeed = feed.map(item=>item.media[0].type==scrollFeed[0].media[0]?.type)
            feed.forEach(element => {
                if(element.media[0].type==scrollFeed[0].media[0]?.type){
                    temp.push(element)
                }
            });
            console.log(temp)
            setDiscoverFeed(discoverFeed.concat(temp))
        })
    }

    const renderCard = ({item})=>(
        <DiscoverScrollCard postData={item}/>
    )
   

    return(
        
            <FlatList 
            decelerationRate={'normal'}
                scrollEnabled={discoverFeed.length>1 }
                data={discoverFeed}
                renderItem={renderCard}
                keyExtractor={(item,index) => (`${item._id}${index}`)}
                horizontal={false}
                onEndReached={getMorePosts}

                onEndReachedThreshold={1}
                snapToInterval={Dimensions.get('screen').height}
            />
    )
}

