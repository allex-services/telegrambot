function createMessageTypes(execlib){
  return {
    Message : require('./message.js')(execlib),
    InlineQuery : require('./inlinequery.js')(execlib),
    ReplyMessage : require('./replymessage.js')(execlib), //used for sendMessage method
    ReplyInlineQuery: require('./replyinlinequery.js')(execlib), //used for answerInlineQuery 
    InlineQueryResultArticle: require('./inlinequeryresultarticle.js')(execlib),
    ChosenInlineResult: require('./choseninlineresult.js')(execlib)
  };
}

module.exports = createMessageTypes;
