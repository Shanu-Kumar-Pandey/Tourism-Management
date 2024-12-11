

module.exports=async function(app, db) {

    const routers = [
        require("./user.js"),
    ];

    routers.forEach(router => {
        router(app, db);
    });
}