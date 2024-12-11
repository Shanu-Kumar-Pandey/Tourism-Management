

module.exports=async function(app, db) {

    const routers = [
        require("./tour.js"),
    ];

    routers.forEach(router => {
        router(app, db);
    });
}