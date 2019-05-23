class Test {
    constructor() {
        this.i = "123";
        this.j = "456";
    }
    change() {
        let obj2 = {
            i: "111",
            j: "222"
        };
        this.transferDatabaseUserObjToThis(obj2);
    }
    getK() {
        let newObj = {};
        for (let key in this) {
            newObj[key] = this[key];
        }
        return newObj;
    }
    transferDatabaseUserObjToThis(userInfo) {
        for (let key in userInfo) {
            this[key] = userInfo[key];
        }
    }
}
let obj = new Test();
obj.change();

console.log(obj.getK());