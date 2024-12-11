module.exports=async function(app, db) {

    const routers = [
        require("./ratings.js"),
    ];

    routers.forEach(router => {
        router(app, db);
    });
}