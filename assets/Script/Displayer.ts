import {
  _decorator,
  Button,
  Component,
  EditBox,
  Node,
  NodeEventType,
} from "cc";
import { contactweb, LocationMsg, RoomMsg, CardMsg } from "./contactweb";
const { ccclass, property } = _decorator;

enum StateType {
  LOGOUT,
  LOBBY,
  ROOM,
}

@ccclass("Displayer")
export class Displayer extends Component {
  @property({
    type: Node,
    tooltip: "Login scene",
  })
  private LoginScene: Node = null;

  @property({
    type: Button,
    tooltip: "Join Lobby Button",
  })
  private JoinLobbyButton: Button = null;

  @property({
    type: Button,
    tooltip: "Exit Lobby Button",
  })
  private ExitLobbyButton: Button = null;

  @property({
    type: Button,
    tooltip: "JoinRoomButton",
  })
  private JoinRoomButton: Button = null;

  @property({
    type: Button,
    tooltip: "ExitRoomButton",
  })
  private ExitRoomButton: Button = null;

  @property({
    type: Button,
    tooltip: "SetCardButton",
  })
  private SetCardButton: Button = null;

  onLoad() {
    // 設定Client Callback
    contactweb.SetCallback("LocationMsg", (message: LocationMsg) => {
      if (message.Location === StateType.LOGOUT) {
        //
      } else if (message.Location === StateType.LOBBY) {
        //大廳介面
        this.LoginScene.active = false;
      } else if (message.Location === StateType.ROOM) {
        //room介面
      } else {
        console.error("error type");
      }
    });

    contactweb.SetCallback("RoomMsg", (message: RoomMsg) => {
      console.log(message);
    });
    contactweb.SetCallback("CardMsg", (message: CardMsg) => {
      console.log(message);
    });
    // 連線
    contactweb.Connect("13poker.garbagedee.edu.kg:2345");

    this.JoinLobbyButton.node.on(NodeEventType.MOUSE_DOWN, () => {
      contactweb.SendMessage("join.lobby", "Glenn");
    });

    this.ExitLobbyButton.node.on(NodeEventType.MOUSE_DOWN, () => {
      contactweb.SendMessage("exit.lobby", "");
    });

    this.JoinRoomButton.node.on(NodeEventType.MOUSE_DOWN, () => {
      contactweb.SendMessage("join.room", "GlennRoom");
    });

    this.ExitRoomButton.node.on(NodeEventType.MOUSE_DOWN, () => {
      contactweb.SendMessage("exit.room", "");
    });

    this.SetCardButton.node.on(NodeEventType.MOUSE_DOWN, () => {
      contactweb.SendMessage(
        "set.card",
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      );
    });
  }

  // 如果有連上server，將GameState設為active(可開始遊戲)
  inConnect(connect: boolean) {
    if (!connect) {
      alert("無法連上伺服器");
    }
  }
}
