// the exports. syntax is specifically for nodejs
exports.Cryptocoin = class {
    constructor(id, name, price_usd) {
        this.id = id;
        this.name = name;
        this.price_usd = price_usd;
    }

    // method to convert
    convert_to(other_coin) {
        return this.price_usd / other_coin.price_usd;
    }
}