const request = require('request');

function fetch(tokenURI) {
    const options =  {
        url: tokenURI,
        method: 'GET',
        json: true
    }
    const array = [];
    request(options, function(err, response, body) {
        if(err) console.log(err);
        const name = body.name;
        const id = body.id;
        const homeAddress = body.description.homeAddress;
        const rent = body.description.rent;
        const layout = body.description.layout;
        const area = body.description.area;
        const floor = body.description.floor;
        const direction = body.description.direction;
        const builtYear = body.description.builtYear;
        const mailAddress = body.description.mailAddress;
        const image = body.image;
        const data = {
            "name": name,
            "id": id,
            "homeAddress": homeAddress,
            "rent": rent,
            "layout": layout,
            "area": area,
            "floor": floor,
            "direction": direction,
            "builtYear": builtYear,
            "mailAddress": mailAddress,
            "image": image,
        }
        array.push(data);
    });
    return array;
}

export default fetch;