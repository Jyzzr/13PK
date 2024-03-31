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
  Rooms: RoomInfo[]; //All Rooms info
}

export interface RoomInfo {
  Name: string; // Room's name
  Players: string[]; // String array of length 4, the name of the players in this room, empty means space
}

export interface CardMsg {
  Type: string; // Response type
  Cards: number[][]; // Player's location, 0: Logout, 1: Lobby, 2: Room
}

export class contactweb {
  // contactweb private variable
  static ws: WebSocket;
  static uri: string = "ws://localhost";
  static callbackList: CallbackFunc[] = [];
  static messageList: Message[] = [];

  // contactweb public variable
  static IsOpen: boolean = false;
  static OnConnect(): void {}
  static OnDisconnect(): void {}

  //
  public static SetCallback(name: string, callback: any) {
    for (let i = 0; i < contactweb.callbackList.length; i++) {
      if (contactweb.callbackList[i].Type == name) {
        contactweb.callbackList[i].callback = callback;
        console.log(this.callbackList);
        return;
      }
    }
    contactweb.callbackList.push({ Type: name, callback });
  }

  public static Connect(uri: string) {
    // Create socket
    contactweb.uri = "ws://" + uri;
    contactweb.ws = new WebSocket(contactweb.uri);

    //
    contactweb.ws.onopen = async function () {
      contactweb.IsOpen = true;
      contactweb.messageList = [];
      contactweb.OnConnect();
      console.log("connected to " + contactweb.uri);

      //
      while (contactweb.IsOpen) {
        if (contactweb.messageList.length > 0) {
          const message = contactweb.messageList[0];
          contactweb.messageList.shift();
          for (let i = 0; i < contactweb.callbackList.length; i++) {
            if (contactweb.callbackList[i].Type == message.Type) {
              //console.log("await callback: " + message.Path);
              await contactweb.callbackList[i].callback(message);
            }
          }
        } else {
          await sleep(10);
        }
      }
    };

    contactweb.ws.onclose = function (event) {
      contactweb.IsOpen = false;
      contactweb.messageList = [];
      contactweb.OnDisconnect();
      console.log("connection closed (" + event.code + ")");
    };

    contactweb.ws.onmessage = async function (event) {
      const data = JSON.parse(event.data);
      contactweb.messageList.push(data);
    };
  }

  public static Close() {
    contactweb.ws.close();
  }

  public static SendMessage(mType: string, data?: any) {
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
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
