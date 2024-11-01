import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } 
    else if (e.target.classList.contains('reply-btn')) {
        handleReplyBtnClick(e.target.dataset.replyTweet)
    } 
    else if (e.target.classList.contains('remove-tweet')) {
        handleRemoveTweetClick(e.target.dataset.removeTweet)
    } 
    else if (e.target.classList.contains('remove-reply')) {
        handleRemoveReplyClick(
            e.target.dataset.replyResponse,
            e.target.dataset.replyPost
        )
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    document.getElementById(`reply-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(),
            isMyTweet: true
        })
    render()
    tweetInput.value = ''
    }

}

function handleReplyBtnClick(tweetId) {
    const replyText = document.getElementById(tweetId).value;
    if(replyText) {
        const replyTweet = {
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyText,
            uuid: uuidv4(),
            isMyReply: true
        }

        const matchedTweet = tweetsData.filter((tweet) => tweet.uuid === tweetId)[0]
        matchedTweet.replies.push(replyTweet)
        render()
        document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
        document.getElementById(`reply-${tweetId}`).classList.remove('hidden')
        document.getElementById(tweetId).value = ''
    } else {
        console.log('write reply text first');
    }
}

function handleRemoveTweetClick(tweetId) {
    const tweetIndex = tweetsData.findIndex((tweet) => tweet.uuid === tweetId);
    if (tweetIndex !== -1) {
        tweetsData.splice(tweetIndex, 1);
    }
    render();
}

function handleRemoveReplyClick(replyTweetUUID, repliedTweetUUID) {
    const repliedTweet = tweetsData.find((tweet) => tweet.uuid === repliedTweetUUID);
    
    if(repliedTweet) {
        repliedTweet.replies = repliedTweet.replies.filter((reply) => reply.uuid !== replyTweetUUID)
        render();
        document.getElementById(`replies-${repliedTweetUUID}`).classList.remove('hidden')
        document.getElementById(`reply-${repliedTweetUUID}`).classList.remove('hidden')
    } else {
        console.log('Replied tweet not found');
    }
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }

        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">
                                    ${reply.handle}
                                    ${reply.isMyReply ? `<i class="fa fa-times remove-reply" data-reply-response="${reply.uuid}" data-reply-post="${tweet.uuid}"></i>` : ''}
                                </p>
                                <p class="tweet-text">${reply.tweetText}</p>
                                
                            </div>
                            
                        </div>
                </div>
                `
            })
        }
             
        feedHtml += `
        <div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">
                    ${tweet.handle}
                    ${tweet.isMyTweet ? `<i class="fa fa-times remove-tweet" data-remove-tweet="${tweet.uuid}"></i>` : ''}
                    </p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots"
                            data-reply="${tweet.uuid}" 
                            ></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}"
                            data-like="${tweet.uuid}"
                            ></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet ${retweetIconClass}"
                            data-retweet="${tweet.uuid}"
                            ></i>
                            ${tweet.retweets}
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}
            </div>
            <div class="hidden reply-window" id="reply-${tweet.uuid}">
                <div class="tweet-inner">
                    <img src="./images/scrimbalogo.png" class="profile-pic">
                    <textarea 
                    class="reply-text"
                    id="${tweet.uuid}"
                    placeholder="Reply this tweet"></textarea>
                </div>
                <button class="reply-btn" data-reply-tweet="${tweet.uuid}">Reply</button>
            </div>
        </div>
        `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()