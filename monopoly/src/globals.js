class Globals{
    constructor(){
        this.app = null;
        this.CONSTS = {
            USABLE_TYPE: {
                CHANCE: 0,
                CHEST: 1,
                QUEST: 2
            }
        };
        this.sizeOfBoard = 900;
        this.tiles = [
            {
                "type": "CornerTile",
                "image": this.resources.start_tile.texture, //Globals.resources.start_tile.texture
                "tile": 0
            },
            {
                "type": "CityTile",
                "id": 1,
                "name": "MEDITERRANEAN AVENUE",
                "rentPrice": [2, 10, 30, 90, 160, 250],
                "mortgagePrice": 30,
                "price": 60,
                "tile": 1,
                "houseCost": 50,
                "hotelCost": 50,
                "cityColor": 0x382b1c
            },
            {
                "type": "SpecialTile",
                "name": "COMMUNITY CHEST",
                "tile": 2,
                "image": this.resources.community.texture, //Globals.resources.community.texture
            },
            {
                "type": "CityTile",
                "id": 3,
                "name": "BALTIC AVENUE",
                "rentPrice": [4, 20, 60, 180, 320, 450],
                "mortgagePrice": 30,
                "price": 60,
                "tile": 3,
                "houseCost": 50,
                "hotelCost": 50,
                "cityColor": 0x382b1c
            },
            {
                "type": "SpecialTile",
                "name": "INCOME TAX",
                "tile": 4,
                "image": this.resources.income_tax.texture //Globals.resources.income_tax.texture
            },
            {
                "type": "StationTile",
                "id": 5,
                "name": "READING RAILROAD",
                "rentPrice": [25, 50, 100, 200],
                "mortgagePrice": 100,
                "price": 200,
                "tile": 5,
                "image": this.resources.railroad.texture //Globals.resources.railroad.texture
            },
            {
                "type": "CityTile",
                "id": 6,
                "name": "ORIENTAL AVENUE",
                "rentPrice": [6, 30, 90, 270, 400, 550],
                "mortgagePrice": 50,
                "price": 100,
                "tile": 6,
                "houseCost": 50,
                "hotelCost": 50,
                "cityColor": 0x3cb8de
            },
            {
                "type": "SpecialTile",
                "name": "CHANCE",
                "tile": 7,
                "image": this.resources.chance.texture //Globals.resources.chance.texture
            },
            {
                "type": "CityTile",
                "id": 8,
                "name": "VERMONT AVENUE",
                "rentPrice": [6, 30, 90, 270, 400, 550],
                "mortgagePrice": 50,
                "price": 100,
                "tile": 8,
                "houseCost": 50,
                "hotelCost": 50,
                "cityColor": 0x3cb8de
            },
            {
                "type": "CityTile",
                "id": 9,
                "name": "CONNECTICUT AVENUE",
                "rentPrice": [8, 40, 100, 300, 450, 600],
                "mortgagePrice": 60,
                "price": 120,
                "tile": 9,
                "houseCost": 50,
                "hotelCost": 50,
                "cityColor": 0x3cb8de
            },
            {
                "type": "CornerTile",
                "image": this.resources.visit_jail.texture, //Globals.resources.visit_jail.texture
                "tile": 10
            },
            {
                "type": "CityTile",
                "id": 11,
                "name": "ST. CHARLES PLACE",
                "rentPrice": [10, 50, 150, 450, 625, 750],
                "mortgagePrice": 70,
                "price": 140,
                "tile": 11,
                "houseCost": 100,
                "hotelCost": 100,
                "cityColor": 0xde3cd3
            },
            {
                "type": "UtilityTile",
                "id": 12,
                "name": "ELECTRIC COMPANY",
                "rentPrice": [4, 10],
                "mortgagePrice": 75,
                "price": 200,
                "tile": 12,
                "image": this.resources.electric.texture
            },
            {
                "type": "CityTile",
                "id": 13,
                "name": "STATES AVENUE",
                "rentPrice": [10, 50, 150, 450, 625, 750],
                "mortgagePrice": 70,
                "price": 140,
                "tile": 13,
                "houseCost": 100,
                "hotelCost": 100,
                "cityColor": 0xde3cd3
            },
            {
                "type": "CityTile",
                "id": 14,
                "name": "VIRGINIA AVENUE",
                "rentPrice": [12, 60, 180, 500, 700, 900],
                "mortgagePrice": 80,
                "price": 160,
                "tile": 14,
                "houseCost": 100,
                "hotelCost": 100,
                "cityColor": 0xde3cd3
            },
            {
                "type": "StationTile",
                "id": 15,
                "name": "PENNSYLVANIA RAILROAD",
                "rentPrice": [25, 50, 100, 200],
                "mortgagePrice": 100,
                "price": 200,
                "tile": 15,
                "image": this.resources.railroad.texture //Globals.resources.railroad.texture
            },
            {
                "type": "CityTile",
                "id": 16,
                "name": "ST. JAMES PLACE",
                "rentPrice": [14, 70, 200, 550, 750, 950],
                "mortgagePrice": 90,
                "price": 180,
                "tile": 16,
                "houseCost": 100,
                "hotelCost": 100,
                "cityColor": 0xde883c
            },
            {
                "type": "SpecialTile",
                "name": "COMMUNITY CHEST",
                "tile": 17,
                "image": this.resources.community.texture, //Globals.resources.community.texture
            },
            {
                "type": "CityTile",
                "id": 18,
                "name": "TENNESSEE AVENUE",
                "rentPrice": [14, 70, 200, 550, 750, 950],
                "mortgagePrice": 90,
                "price": 180,
                "tile": 18,
                "houseCost": 100,
                "hotelCost": 100,
                "cityColor": 0xde883c
            },
            {
                "type": "CityTile",
                "id": 19,
                "name": "NEW YORK AVENUE",
                "rentPrice": [16, 80, 220, 600, 800, 1000],
                "mortgagePrice": 100,
                "price": 200,
                "tile": 19,
                "houseCost": 100,
                "hotelCost": 100,
                "cityColor": 0xde883c
            },
            {
                "type": "CornerTile",
                "image": this.resources.free_parking.texture, //Globals.resources.start_tile.texture
                "tile": 20
            },
            {
                "type": "CityTile",
                "id": 21,
                "name": "KENTUCKY AVENUE",
                "rentPrice": [18, 90, 250, 700, 875,1050],
                "mortgagePrice": 110,
                "price": 220,
                "houseCost": 150,
                "hotelCost": 150,
                "cityColor": "0xD40B0A",
                "tileId": 21
            },
            {
                "type": "SpecialTile",
                "name": "CHANCEs",
                "tile": 22,
                "image": this.resources.chance.texture, //Globals.resources.community.texture
            },
            {
                "type": "CityTile",
                "id": 23,
                "name": "INDIANA AVENUE",
                "rentPrice": [18, 90, 250, 700, 875,1050],
                "mortgagePrice": 110,
                "price": 220,
                "houseCost": 150,
                "hotelCost": 150,
                "cityColor": "0xD40B0A",
                "tileId": 23
            },
            {
                "type": "CityTile",
                "id": 24,
                "name": "ILLINOIS AVENUE",
                "rentPrice": [20, 100, 300, 750, 925,1100],
                "mortgagePrice": 120,
                "price": 240,
                "houseCost": 150,
                "hotelCost": 150,
                "cityColor": "0xD40B0A",
                "tileId": 24
            },
            {
                "type": "StationTile",
                "name": "SHORT LINE",
                "id": 25,
                "rentPrice": [25, 50, 100, 200],
                "mortgagePrice": 100,
                "price": 200,
                "tileId": 25,
                "isMortgaged" : false,
                "image": this.resources.railroad.texture, //Globals.resources.community.texture

            },
            {
                "type": "CityTile",
                "id": 26,
                "name": "ATLANTIC AVENUE",
                "rentPrice": [22, 110, 330, 800, 975, 1150],
                "mortgagePrice": 130,
                "price": 260,
                "houseCost": 150,
                "hotelCost": 150,
                "cityColor": "0xFFC90F",
                "tileId": 26
            },
            {
                "type": "CityTile",
                "id": 27,
                "name": "VENTNOR AVENUE",
                "rentPrice": [22, 110, 330, 800, 975, 1150],
                "mortgagePrice": 130,
                "price": 260,
                "houseCost": 150,
                "hotelCost": 150,
                "cityColor": "0xFFC90F",
                "tileId": 27
            },
            {
                "type": "UtilityTile",
                "id": 28,
                "name": "WATER WORKS",
                "rentPrice": [4, 10],
                "mortgagePrice": 75,
                "price": 200,
                "tile": 28,
                "image": this.resources.water.texture
            },
            {
                "type": "CityTile",
                "id": 29,
                "name": "MARVIN GARDENS",
                "rentPrice": [24, 120, 360, 850, 1025, 1200],
                "mortgagePrice": 140,
                "price": 280,
                "houseCost": 150,
                "hotelCost": 150,
                "cityColor": "0xFFC90F",
                "tileId": 29
            },
            {
                "type": "CornerTile",
                "image": this.resources.goto_jail.texture, //Globals.resources.start_tile.texture
                "tile": 30
            },
            {
                "type": "CityTile",
                "id": 31,
                "name": "PACIFIC AVENUE",
                "rentPrice": [26, 130, 390, 900, 1100,1275],
                "mortgagePrice": 150,
                "price": 300,
                "houseCost": 200,
                "hotelCost": 200,
                "cityColor": "0x24733B",
                "tileId": 31
            },
            {
                "type": "CityTile",
                "id": 32,
                "name": "NORTH CAROLINA AVENUE",
                "rentPrice": [26, 130, 390, 900, 1100,1275],
                "mortgagePrice": 150,
                "price": 300,
                "houseCost": 200,
                "hotelCost": 200,
                "cityColor": "0x24733B",
                "tileId": 32
            },
            {
                "type": "SpecialTile",
                "name": "COMMUNIT CHEST",
                "tile": 33,
                "image": this.resources.luxury.texture, //Globals.resources.community.texture
            },
            {
                "type": "CityTile",
                "id": 34,
                "name": "PENNSYLVANIA AVENUE",
                "rentPrice": [28, 150, 450, 1000, 1200,1400],
                "mortgagePrice": 160,
                "price": 320,
                "houseCost": 200,
                "hotelCost": 200,
                "cityColor": "0x24733B",
                "tileId": 34
            },
            {
                "type": "StationTile",
                "name": "SHORT LINE",
                "id": 35,
                "rentPrice": [25, 50, 100, 200],
                "mortgagePrice": 100,
                "price": 200,
                "tileId": 35,
                "isMortgaged" : false,
                "image": this.resources.railroad.texture, //Globals.resources.community.texture

            },
            {
                "type": "SpecialTile",
                "name": "CHANCE",
                "tile": 36,
                "image": this.resources.chance.texture, //Globals.resources.community.texture
            },
            {
                "type": "CityTile",
                "id": 37,
                "name": "PARK PLACE",
                "rentPrice": [35, 175, 500, 1100, 1100,1300],
                "mortgagePrice": 175,
                "price": 350,
                "houseCost": 200,
                "hotelCost": 200,
                "cityColor": "0x0541CA",
                "tileId": 37
            },
            {
                "type": "SpecialTile",
                "name": "LUXURY TAX",
                "tile": 38,
                "image": this.resources.luxury.texture, //Globals.resources.community.texture
            },
            {
                "type": "CityTile",
                "id": 39,
                "name": "BOARDWALK",
                "rentPrice": [50, 200, 600, 1400, 1700,2000],
                "mortgagePrice": 200,
                "price": 400,
                "houseCost": 200,
                "hotelCost": 200,
                "cityColor": "0x0541CA",
                "tileId": 39
            },
        ];
    }
}
export default (new Globals())