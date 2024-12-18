import './createPost.js';

import { Devvit, useState } from '@devvit/public-api';

// Defines the messages that are exchanged between Devvit and Web View
type WebViewMessage =
  | {
      type: 'initialData';
      data: { username: string; currentCounter: number };
    }
  | {
      type: 'setCounter';
      data: { newCounter: number };
    }
  | {
      type: 'updateCounter';
      data: { currentCounter: number };
    };

Devvit.configure({
  redditAPI: true,
  redis: true,
});



// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Welcome to Play Scrabble Rush.',
  height: 'tall',
  render: (context) => {
    // Load username with `useState` hook
    const [username] = useState(async () => {
      const currUser = await context.reddit.getCurrentUser();
      return currUser?.username ?? 'anon';
    });

    // ** For the game this is where the high score will be stored
    // Load latest counter from redis with `useState` hook
    const [counter, setCounter] = useState(async () => {
      const redisCount = await context.redis.get(`counter_${context.postId}`);
      return Number(redisCount ?? 0);
    });

    // Create a reactive state for web view visibility
    const [webviewVisible, setWebviewVisible] = useState(false);

    // This is where we deal with messages that are comming from the WebView.
    // When the web view invokes `window.parent.postMessage` this function is called
    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case 'setCounter':
          await context.redis.set(`counter_${context.postId}`, msg.data.newCounter.toString());
          context.ui.webView.postMessage('myWebView', {
            type: 'updateCounter',
            data: {
              currentCounter: msg.data.newCounter,
            },
          });
          // setting the counter variable.
          setCounter(msg.data.newCounter);
          break;
        case 'initialData':
        case 'updateCounter':
          break;

        default:
          throw new Error(`Unknown message type: ${msg satisfies never}`);
      }
    };

    // When the button is clicked, send initial data to web view and show it
    const onShowWebviewClick = () => {
      setWebviewVisible(true);
      context.ui.webView.postMessage('myWebView', {
        type: 'initialData',
        data: {
          username: username,
          currentCounter: counter,
        },
      });
    };


    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack
          grow={!webviewVisible}
          height={webviewVisible ? '0%' : '100%'}
          alignment="center middle"
          backgroundColor="#c17540"
        >
          <text size="xxlarge" weight="bold" alignment="top center" outline="thick">
            SCRABBLE RUSH
          </text>
          <spacer />
          <vstack alignment="center middle">
            <hstack>
              <text size="medium">Welcome: {username ?? ''}</text>
            </hstack>
            <spacer />

            <hstack>
            <text>
              How to play:
              </text>
            </hstack>
            <spacer />
            <hstack>
            <text>
              1. Objective: Get the most words in 2:30 minutes to score the highest points.
              </text>
            </hstack>
            <hstack>
            <text>
              2. Gameplay: Form words by matching letter tiles from the shuffle.
              </text>
            </hstack>
            <hstack>
            <text>
              3. Bonus: A four-letter word and above earns a double bonus, doubling its points.
              </text>
            </hstack>
            <spacer/>
            <spacer/>
            <hstack>
              <text size="medium">Current Score: {counter ?? ''}</text>
            </hstack>
          </vstack>
          <spacer />
          <spacer />
          <button onPress={onShowWebviewClick} icon='play' size='large'></button>
          
        </vstack>
        <vstack grow={webviewVisible} height={webviewVisible ? '100%' : '0%'}>
          <vstack border="thick" borderColor="black" height={webviewVisible ? '100%' : '0%'}>
            <webview
              id="myWebView"
              url="page.html"
              onMessage={(msg) => onMessage(msg as WebViewMessage)}
              grow
              height={webviewVisible ? '100%' : '0%'}
            />
          </vstack>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
