module.exports=async function(app, db) {

    const routers = [
        require("./booking.js"),
    ];

    routers.forEach(router => {
        router(app, db);
    });
}