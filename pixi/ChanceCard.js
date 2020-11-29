class ChanceCard{
    constructor(chance, monopoly_man, background_texture) {
        this.chance = chance;
        this.background_texture = background_texture;
        this.monopoly_man = monopoly_man;
        this.shape = null;
        this.closed = true;
    }

    draw() {
        if (this.shape != null) {
            return this.shape;
        }
        this.shape = this.createShape();
    }

    flip(){
        if(this.closed){
            let flipInterval = setInterval(()=>{
                this.shape.children[this.shape.children.length - 1].alpha -= 0.05;
                if(this.shape.children[this.shape.children.length - 1].alpha <= 0){
                    this.shape.children[this.shape.children.length - 1].alpha = 0;
                    clearInterval(flipInterval);
                }
            }, 50);
            this.closed = false;
        }else{
            let flipInterval = setInterval(()=>{
                this.shape.children[this.shape.children.length - 1].alpha += 0.05;
                if(this.shape.children[this.shape.children.length - 1].alpha >= 1){
                    this.shape.children[this.shape.children.length - 1].alpha = 1;
                    clearInterval(flipInterval);
                }
            }, 50);
            this.closed = true;
        }
    }

    createShape() {
        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        let card = new PIXI.Container();
        let title = new PIXI.Container();
        let informations = new PIXI.Container();

        let flipBorder = new PIXI.Sprite(this.background_texture);
        flipBorder.width = 400;
        flipBorder.height = 200;
        flipBorder.alpha = 1;

        let border = new PIXI.Graphics();
        border.beginFill(0xFFFFFF);
        border.lineStyle(5, 0x333333);
        border.drawRect(0, 0, 400, 200);
        let bg = new PIXI.Sprite(this.monopoly_man);
        let mask = new PIXI.Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(0, 0, 400, 200);
        bg.mask = mask;
        bg.alpha = 0.1;

        function formatText(description) {
            let arr = description.split(" ");
            let result = "";
            let count = 0;
            arr.forEach(word => {
                if (count > 4) {
                    count = 0;
                    result += "\n";
                }
                result += word + " ";
                count++;
            });
            return result;
        }

        let formatted = formatText(this.chance.description);

        let titleText = new PIXI.Text(formatted, {...style, fontSize: 18, align: "center"});
        titleText.anchor.x = 0.5;
        titleText.anchor.y = 0.5;
        titleText.x = border.getBounds().x + border.getBounds().width / 2;
        titleText.y = border.getBounds().y + border.getBounds().height / 2;

        let test = new PIXI.Graphics();
        test.beginFill(0xFF0000);
        test.lineStyle(5, 0x333333);
        test.drawRect(0, 0, 40, 20);

        card.addChild(border);
        card.addChild(mask);
        card.addChild(bg);
        card.addChild(titleText);
        card.addChild(flipBorder);

        card.interactive = true;
        let move = false;
        let xoff = 0;
        let yoff = 0;
        card.on("mousemove", (e) => {
            if (move) {
                card.x = e.data.global.x - xoff;
                card.y = e.data.global.y - yoff;
            }
        });
        card.on("mousedown", (e) => {
            console.log(e);
            move = true;
            xoff = e.data.global.x - card.x;
            yoff = e.data.global.y - card.y;

        });

        card.on("mouseup", (e) => {
            move = false;
        });
        return card;
    }

}