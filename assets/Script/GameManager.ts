import { _decorator, Button, Component, EditBox, Label, Node, NodeEventType } from 'cc';
import { contactweb, LocationMsg, RoomMsg, CardMsg, RoomInfo } from './contactweb';
import { GameStart } from './Displayer';
const { ccclass, property } = _decorator;
const Start_Money = 10;

@ccclass('GameManager')
export class GameManager extends Component {
    @property({
        type: Number,
        tooltip: 'Money',
    })
    private Money: number = null;

    start() {}

    onLoad() {
        if (GameStart == true) {
            this.Money = Start_Money;
        }
    }

    update() {}
}
