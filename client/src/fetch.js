const request = require('request');

function fetch (tokenURIs) {
    var array = [];
    for(var i = 0; i < tokenURIs.length; i++) {
        const options =  {
            url: tokenURIs[i],
            method: 'GET',
            json: true
        }
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
            //console.log(data);
            array.push(data);
        })
    }
    return array;
}

export default fetch;
