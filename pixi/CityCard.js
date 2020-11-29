class CityCard{
    constructor(city) {
        this.city = city;
        this.shape = null;
    }

    draw() {
        if (this.shape != null)
            return;
        this.shape = this.createShape();
    }

    createShape(){
        const style = new PIXI.TextStyle({
            fontFamily: "\"Times New Roman\", Times, serif",
        });
        let card = new PIXI.Container();
        let title = new PIXI.Container();
        let informations = new PIXI.Container();

        let border = new PIXI.Graphics();
        border.beginFill(0xFFFFFF);
        border.lineStyle(5, 0x333333);
        border.drawRect(0, 0, 250, 350);

        let titleBackground = new PIXI.Graphics();
        titleBackground.beginFill(this.city.color);
        titleBackground.lineStyle(5, 0x333333);
        titleBackground.drawRect(10, 10, 230, 50);

        let titleText = new PIXI.Text(this.city.name, style);
        titleText.anchor.x =0.5;
        titleText.anchor.y =0.5;
        titleText.x = titleBackground.getBounds().x + titleBackground.getBounds().width / 2;
        titleText.y = titleBackground.getBounds().y + titleBackground.getBounds().height / 2;

        let rentText = new PIXI.Text("Rent " + this.city.rent, {...style, align: "center", fontSize: 18});
        let propText = new PIXI.Text(`With 1 House ....................... ${this.city.price[0]}
With 2 House ....................... ${this.city.price[1]}
With 3 House ....................... ${this.city.price[2]}
With 4 House ....................... ${this.city.price[3]}
With Hotel ........................... ${this.city.price[4]}`,{...style, fontSize: 16});
        let costText = new PIXI.Text(`Mortgage Value ${this.city.mortgage}
Houses cost ${this.city.houseCost}. each
Hotels, ${this.city.hotelCost}. plus 4 houses`,{...style, align: "center", fontSize: 16});
        let infoText = new PIXI.Text(`If a player owns ALL the Lots of any
Color-Group, the rent is Doubled on
Unimproved Lots in that group.`,{...style, align: "center", fontSize: 10});

        rentText.anchor.x =0.5;
        rentText.anchor.y =0.5;
        rentText.x = border.getBounds().x + border.getBounds().width / 2;
        propText.anchor.x =0.5;
        propText.anchor.y =0.5;
        propText.x = border.getBounds().x + border.getBounds().width / 2;
        costText.anchor.x =0.5;
        costText.anchor.y =0.5;
        costText.x = border.getBounds().x + border.getBounds().width / 2;
        infoText.anchor.x =0.5;
        infoText.anchor.y =0.5;
        infoText.x = border.getBounds().x + border.getBounds().width / 2;

        rentText.y = 80;
        propText.y = 150;
        costText.y = 250;
        infoText.y = 320;


        informations.addChild(rentText);
        informations.addChild(propText);
        informations.addChild(costText);
        informations.addChild(infoText);

        title.addChild(titleBackground);
        title.addChild(titleText);

        card.addChild(border);
        card.addChild(title);
        card.addChild(informations);



        card.interactive = true;
        let move = false;
        let xoff = 0;
        let yoff = 0;
        card.on("mousemove", (e)=>{
            if(move){
                card.x = e.data.global.x - xoff;
                card.y = e.data.global.y- yoff;
            }
        });
        card.on("mousedown", (e)=>{
            move = true;
            xoff = e.data.global.x - card.x;
            yoff = e.data.global.y - card.y;
        });
        card.on("mouseup", (e)=>{
            move = false;
        });
        return card;
    }
}