function basicErrorHandler(res, err){
    console.error(err);
    res.status(500).json({
        status: 500,
        message: "Error Message!"
    })
}

module.exports = {
    basicErrorHandler
}