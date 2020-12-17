import CardView from "./cardView";
import * as PIXI from 'pixi.js';
import Globals from "../../globals"

class SpecialCardView extends CardView{
    constructor(specialCard) {
        super();
        this.specialCard = specialCard;
        this.content = new PIXI.Container();
        this.content.name = "content";
        this.card.addChild(this.content);
        this.initializeDrawings();
    }

    initializeDrawings() {
        super.initializeDrawings();

        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        this.titleText =new PIXI.Text(this.specialCard.title, {...style, fontSize: 36, align: "center", fontWeight: "bold"});
        this.titleText.name = "titleText";
        this.titleText.anchor.x =0.5;
        this.titleText.anchor.y =0.5;
        this.titleText.x = 10 + 115;
        this.titleText.y = 10 + 25;
        this.card.addChild(this.titleText);

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

        let formatted = formatText(this.specialCard.info);
        let infoText = new PIXI.Text(formatted, {...style, fontSize: 18, align: "center"});
        infoText.anchor.x = 0.5;
        infoText.anchor.y = 0.5;
        infoText.x = this.border.getBounds().x + this.border.getBounds().width / 2;
        infoText.y = (this.border.getBounds().y + this.border.getBounds().height+50) / 2;
        this.content.addChild(infoText);
    }

}

export default SpecialCardView;