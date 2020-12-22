import CardView from "./cardView";
import * as PIXI from 'pixi.js';
import Globals from "../../globals"

class SpecialCardView extends CardView{
    constructor(id) {
        super(id);
        this.content = new PIXI.Container();
        this.content.name = "content";
        this.title = new PIXI.Container();
        this.title.name = "title";
        this.card.addChild(this.title);
        this.card.addChild(this.content);
        this.initializeDrawings();
    }

    initializeDrawings() {
        super.initializeDrawings();
        let titleBackground = new PIXI.Graphics();
        titleBackground.name = "titleBackground";
        titleBackground.beginFill(0xf0f7f1);
        titleBackground.lineStyle(2, 0x333333);
        console.log(this.border);
        titleBackground.drawRect(this.border.x, this.border.y, this.border.width-2, this.border.height/5);
        titleBackground.alpha = 0.9;
        this.title.addChild(titleBackground);

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
            fontSize : 16,
        });
        this.titleText =new PIXI.Text("Exit Jail Card", {...style, fontSize: 16, align: "center", fontWeight: "bold"});
        this.titleText.name = "titleText";
        this.titleText.anchor.x =0.5;
        this.titleText.anchor.y =0.5;
        this.titleText.x = this.border.x + this.border.width / 2;
        this.titleText.y = titleBackground.y + titleBackground.height / 2;
        this.title.addChild(this.titleText);

        function formatText(description) {
            let arr = description.split(" ");
            let result = "";
            let count = 0;
            arr.forEach(word => {
                if (count > 3) {
                    count = 0;
                    result += "\n";
                }
                result += word + " ";
                count++;
            });
            return result;
        }

        let formatted = formatText("You can exit from the Jail by Using this card!!");
        let infoText = new PIXI.Text(formatted, {...style, fontSize: 18, align: "center"});
        infoText.anchor.x = 0.5;
        infoText.anchor.y = 0.5;
        infoText.x = this.border.x + this.border.width / 2 + 10;
        infoText.y = this.border.y + 140;
        this.content.addChild(infoText);
    }

}

export default SpecialCardView;