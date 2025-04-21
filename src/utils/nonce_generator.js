const NonceGenerator =  (length=32) => {
    const str = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", len = str.length;
    let tmp = "";
    for (var i = 0; i < length; i++)
        tmp += str.charAt(Math.floor(Math.random() * len));
    return tmp;
}

export default NonceGenerator;