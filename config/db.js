if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://jhonathanrozwod:<1BXcZRjOKpcCWCnX>@cluster0.bntsybc.mongodb.net/"}
}else{
module.exports = {mongoURI: "mongodb://127.0.0.1:27017/blogapp'"}

}
