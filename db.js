class Database {
    constructor(_bot) {
        this.bot = _bot;
        this.data = new Map();
    }

    mapToObj(map) {
        const obj = {}
        for (let [k,v] of map.entries())
          obj[k] = v
        
        return obj
    }

    load() {
        let data = require('./data/db.json');
        this.data = new Map(Object.entries(data))
    }

    save() {
        this.bot.fs.writeFile('./data/db.json', JSON.stringify(this.mapToObj(this.data)), (err) => {
            if (err) throw err;
            console.log('Saved...');
        });
    }

    fetch(id) {
        return this.data.get(id);
    }

    add(id, val) {
        if(this.data.has(id)) {
            this.data.set(id, this.data.get(id) + val);
        } else {
            console.log("Invalid ID to add to - " + id + "/" + val);
            this.data.set(id, val);
        }

        this.save();
    }

    subtract(id, val) {
        if(this.data.has(id)) {
            this.data.set(id, this.data.get(id) - val);
        } else {
            console.log("Invalid ID to remove from - " + id + "/" + val);
            this.data.set(id, -val);
        }

        this.save();
    }

    set(id, val) {
        this.data.set(id, val);
        this.save();
    }

    delete(id) {
        this.data.delete(id);
        this.save();
    }
}

module.exports = Database;