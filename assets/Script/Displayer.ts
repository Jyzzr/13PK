import {
  _decorator,
  Button,
  Component,
  EditBox,
  Label,
  log,
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
    type: Node,
    tooltip: "Lobby scene",
  })
  private LobbyScene: Node = null;

  @property({
    type: Node,
    tooltip: "Room scene",
  })
  private Room1Scene: Node = null;

  @property({
    type: Node,
    tooltip: "Room scene",
  })
  private Room2Scene: Node = null;

  @property({
    type: Node,
    tooltip: "Room scene",
  })
  private Room3Scene: Node = null;

  @property({
    type: Node,
    tooltip: "Room scene",
  })
  private Room4Scene: Node = null;

  @property({
    type: Number,
    tooltip: "Room member",
  })
  private r: number = 4;

  @property({
    type: Number,
    tooltip: "Room member",
  })
  private r1: number = 0;

  @property({
    type: Number,
    tooltip: "Room member",
  })
  private r2: number = 0;

  @property({
    type: Number,
    tooltip: "Room member",
  })
  private r3: number = 0;

  @property({
    type: Number,
    tooltip: "Room member",
  })
  private r4: number = 0;

  @property({
    type: EditBox,
    tooltip: "Name",
  })
  private Name: EditBox = null;

  @property({
    type: Label,
    tooltip: "Namedis",
  })
  private Namedisplay: Label = null;

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
  private JoinRoomButton1: Button = null;

  @property({
    type: Button,
    tooltip: "JoinRoomButton",
  })
  private JoinRoomButton2: Button = null;

  @property({
    type: Button,
    tooltip: "JoinRoomButton",
  })
  private JoinRoomButton3: Button = null;

  @property({
    type: Button,
    tooltip: "JoinRoomButton",
  })
  private JoinRoomButton4: Button = null;

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
    this.Room1Scene.active = false;
    this.Room2Scene.active = false;
    this.Room3Scene.active = false;
    this.Room4Scene.active = false;
    this.LoginScene.active = true;
    this.LobbyScene.active = false;
    // 設定Client Callback
    contactweb.SetCallback("LocationMsg", (message: LocationMsg) => {
      if (message.Location === StateType.LOGOUT) {
        //
      } else if (message.Location === StateType.LOBBY) {
        //大廳介面
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
      this.LoginScene.active = false;
      this.LobbyScene.active = true;
      this.Namedisplay.string = this.Name.string;
      contactweb.SendMessage("join.lobby", this.Name);
    });

    this.ExitLobbyButton.node.on(NodeEventType.MOUSE_DOWN, () => {
      this.LoginScene.active = true;
      this.LobbyScene.active = false;
      contactweb.SendMessage("exit.lobby", "");
    });

    this.JoinRoomButton1.node.on(NodeEventType.MOUSE_DOWN, () => {
      if (this.r1 < this.r) {
        this.r1++;
        this.r1 = this.r1;
      } else {
        this.JoinRoomButton1.interactable = false;
      }
      this.LobbyScene.active = false;
      this.Room1Scene.active = true;
      contactweb.SendMessage("join.room", "");
    });

    this.JoinRoomButton2.node.on(NodeEventType.MOUSE_DOWN, () => {
      this.LobbyScene.active = false;
      this.Room2Scene.active = true;
      contactweb.SendMessage("join.room", "");
    });

    this.JoinRoomButton3.node.on(NodeEventType.MOUSE_DOWN, () => {
      this.LobbyScene.active = false;
      this.Room3Scene.active = true;
      contactweb.SendMessage("join.room", "");
    });

    this.JoinRoomButton4.node.on(NodeEventType.MOUSE_DOWN, () => {
      this.LobbyScene.active = false;
      this.Room4Scene.active = true;
      contactweb.SendMessage("join.room", "");
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
  update(deltaTime: number) {
    if (!this.Name || this.Name.string === "") {
      this.JoinLobbyButton.interactable = false;
    } else {
      this.JoinLobbyButton.interactable = true;
    }
  }
}
