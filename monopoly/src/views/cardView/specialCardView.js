import CardView from "./cardView";
import * as PIXI from 'pixi.js';
import Globals from "../../globals"

class SpecialCardView extends CardView{
    constructor(id) {
        super(id);
        //this.specialCard = specialCard;
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
        titleBackground.drawRect(this.border.x, this.border.y, this.border.width-2, this.border.height/5);
        titleBackground.alpha = 0.9;
        this.title.addChild(titleBackground);
        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        let titleText =new PIXI.Text("Jail Free Card", {...style, fontSize: 20, align: "center", fontWeight: "bold"});
        titleText.name = "titleText";
        titleText.anchor.x =0.5;
        titleText.anchor.y =0.5;
        titleText.x = titleBackground.getBounds().x + titleBackground.getBounds().width / 2;
        titleText.y = titleBackground.getBounds().y + titleBackground.getBounds().height / 2;
        this.title.addChild(titleText);

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

        let formatted = formatText("You can exit from Jail by using this card!!");
        let infoText = new PIXI.Text(formatted, {...style, fontSize: 18, align: "center"});
        infoText.anchor.x = 0.5;
        infoText.anchor.y = 0.5;
        infoText.x = this.border.getBounds().x + this.border.getBounds().width / 2;
        infoText.y = (this.border.getBounds().y + this.border.getBounds().height+50) / 2.5;
        this.content.addChild(infoText);
    }

}

export default SpecialCardView;