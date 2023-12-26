

const defaultFilter=[
    {gameName:'pubg',filterName:'KD',filterValue:'kd'},
    {gameName:'coc',filterName:'Trophies',filterValue:'trophies'},
    {gameName:'cod',filterName:'KD',filterValue:'kd'},
    {gameName:'valorant',filterName:'Wins',filterValue:'wins'},
    {gameName:'lol',filterName:'Rank',filterValue:'rank'},
    // {gameName:'overWatch',filterName:'KDR',filterValue:'kdr'},
]

const pubgFilter =[
    {filterName:'Rank',filterValue:'rank'},
    {filterName:'KD',filterValue:'kd'},
    {filterName:'Wins',filterValue:'wins'},
    {filterName:'Kills',filterValue:'kills'},
    {filterName:'Games',filterValue:'games'},

]


const lolFilter =[
    {filterName:"Rank",filterValue:"rank"},
    {filterName:'Wins',filterValue:'wins'},
    {filterName:'Level',filterValue:'level'},
    {filterName:'Loss',filterValue:'loss'}, // ,  
    {filterName:'Win Ratio',filterValue:'winRatio'}, 

]


const codFilter=[
    {filterName:'Rank',filterValue:'rank'},
    {filterName:'KD',filterValue:'kd'},
    {filterName:'Kills',filterValue:'kills'},
    {filterName:'Level',filterValue:'level'},
    {filterName:'Wins',filterValue:'wins'},

]

const ValorantFilter=[
    {filterName:'Rank',filterValue:'rank'},
    {filterName:'Wins',filterValue:'wins'},
    {filterName:'Competitive tier',filterValue:'competitiveTier'},

]


const cocFilter=[
    {filterName:'Rank',filterValue:'rank'},
    {filterName:'Trophies',filterValue:'trophies'},
    {filterName:'Attack win',filterValue:'attackWins'},
    {filterName:'Defense win',filterValue:'defenseWins'},
    {filterName:'Exp',filterValue:'expLevel'}
]

const overWatchFilter=[
    {filterName:'Rank',filterValue:'rank'},
    {filterName:'Level',filterValue:'level'},
    {filterName:'Skill Rating',filterValue:'skillRating'},
    {filterName:'KDR',filterValue:'kdr'},
    {filterName:'Win Ratio',filterValue:'winRatio'},
    {filterName:'Wins',filterValue:'wins'},
    {filterName:'Loss',filterValue:'loss'},

]

const bannerData = [
    {title:'PUBG PC',slug:"pubg",filterList:pubgFilter,filterAllowed:true,img:'https://static.toiimg.com/thumb/msid-88854584,width-1280,height-720,resizemode-4/.jpg'},
    {title:'Clash of clans',slug:"coc",filterList:cocFilter,filterAllowed:true,img:'https://playerassist.com/wp-content/uploads/2021/01/clash-of-clans-how-to-start-town-hall-12.jpeg'},
    {title:'Call of Duty',slug:"cod",filterList:codFilter,filterAllowed:true,img:'https://www.cnet.com/a/img/resize/15b5e25b33358c49c5d09c25eaf718856e57b98b/2019/09/18/c07d7cfa-5cc7-4d64-a3bb-aabf6b778dcc/call-of-duty-mobile.jpg?auto=webp&fit=crop&height=675&width=1200'},
    {title:'Valorant',slug:"valorent",filterList:ValorantFilter,filterAllowed:true,img:'https://images.livemint.com/img/2020/06/03/1600x900/Valorant_1591218052835_1591218061187.jpg'},
    {title:'League of Legends',slug:"lol",filterList:lolFilter,filterAllowed:true,img:'https://nerdbot.com/wp-content/uploads/2022/01/league-of-legends-2022-official-art.jpg'},
    // {title:'Over Watch 2',slug:'overWatch',filterList:overWatchFilter,filterAllowed:true,img:'https://knowtechie.com/wp-content/uploads/2022/04/overwatch-2-banner.jpg'}
]

const apiBoddyAttributes=[
    {"game":'pubg',"attribute":{"mode":"squad","region":"pc-as"}},
    {"game":'coc',"attribute":{"season":``}},
    {"game":'cod',"attribute":{}},
    {"game":'valorent',"attribute":{"start":"0","size":"10"}},
    {"game":'lol',"attribute":{"start":"0","size":"10"}},
    // {"game":"overWatch"}
]


const LeaderBoardConfig = {
    bannerData,
    filter:{
        defaultFilter,
        pubgFilter,
        lolFilter,
        codFilter,
        ValorantFilter,
        cocFilter,
        overWatchFilter,
    },
    apiBoddyAttributes
}

export default LeaderBoardConfig;