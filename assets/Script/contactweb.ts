import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

ccclass("contactweb");

interface CallbackFunc {
  Type: string;
  callback(data: object): Promise<void>;
}

export interface Message {
  Type: string;
  Data: string;
}

export interface LocationMsg {
  Type: string; // Response type
  Location: number; // Player's location, 0: Logout, 1: Lobby, 2: Room
  Name: string; // Location name
}

export interface RoomMsg {
  Type: string; // Response type
  Location: number; // Player's location, 0: Logout, 1: Lobby, 2: Room
  Name: string; // Location name
}

export interface CardMsg {
  Type: string; // Response type
  Location: number; // Player's location, 0: Logout, 1: Lobby, 2: Room
  Name: string; // Location name
}

export class contactweb extends Component {
  static ws: WebSocket;
  static uri: string = "ws://localhost";
  static callbackList: CallbackFunc[] = [];
  static messageList: Message[] = [];
  private socket: WebSocket = null;

  // web public variable
  static IsOpen: boolean = false;
  static OnConnect(): void {}
  static OnDisconnect(): void {}

  /////待檢查
  public static SetCallback(type: string, callback: any) {
    for (let i = 0; i < contactweb.callbackList.length; i++) {
      if (contactweb.callbackList[i].Type == type) {
        contactweb.callbackList[i].callback = callback;
        console.log(this.callbackList);
        return;
      }
    }
    contactweb.callbackList.push({ Type: type, callback });
  }

  /////待檢查
  public static Connect(uri: string) {
    // Create socket
    contactweb.uri = "ws://" + uri;
    contactweb.ws = new WebSocket(contactweb.uri);
  }

  protected onLoad(): void {
    this.socket = new WebSocket("ws://13poker.garbagedee.edu.kg:2345");
    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = this.onClose.bind(this);
  }

  private onOpen(event: Event): void {
    console.log("WebSocket connection established");
    // 连接成功后的逻辑
    // 可以在这里发送消息给服务器
    // this.socket.send('Hello, server!');
  }

  private onMessage(event: MessageEvent): void {
    console.log("Message from server:", event.data);
    // 收到服务器发送的消息后的逻辑
  }

  private onError(event: Event): void {
    console.error("WebSocket error:", event);
    // 连接发生错误后的处理逻辑
  }

  private onClose(event: CloseEvent): void {
    console.log("WebSocket connection closed");
    // 连接关闭后的逻辑
  }

  public send(message: string): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.warn("WebSocket is not open. Message not sent:", message);
    }
  }
  /////待檢查
  public static SendMessage(mType: string, data: any) {
    if (contactweb.IsOpen) {
      if (mType == "join.lobby") {
        contactweb.ws.send(JSON.stringify({ Type: mType, Name: data }));
      } else if (mType == "join.room") {
        contactweb.ws.send(JSON.stringify({ Type: mType, Name: data }));
      } else if (mType == "set.card") {
        contactweb.ws.send(
          JSON.stringify({
            Type: mType,
            Cards: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          })
        );
      }
    }
  }

  public close(): void {
    this.socket.close();
  }
}
