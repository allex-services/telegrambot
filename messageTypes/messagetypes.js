function createMessageTypes(execlib){
  return {
    Message : require('./message.js')(execlib),
    InlineQuery : require('./inlinequery.js')(execlib),
    CallbackQuery: require('./callbackquery.js')(execlib),
    ReplyMessage : require('./replymessage.js')(execlib), //used for sendMessage method
    EditMessage : require('./editmessage.js')(execlib),
    ReplyInlineQuery: require('./replyinlinequery.js')(execlib), //used for answerInlineQuery 
    InlineQueryResultArticle: require('./inlinequeryresultarticle.js')(execlib),
    ChosenInlineResult: require('./choseninlineresult.js')(execlib),
    InlineKeyboardButton: require('./inlinekeyboardbutton.js')(execlib),
    InlineKeyboardMarkup : require('./inlinekeyboardmarkup.js')(execlib),
    KeyboardButton: require('./keyboardbutton.js')(execlib),
    ReplyKeyboardMarkup : require('./replykeyboardmarkup.js')(execlib),
    InProcessRequest: require('./inprocessrequest.js')(execlib)
  };
}

module.exports = createMessageTypes;
