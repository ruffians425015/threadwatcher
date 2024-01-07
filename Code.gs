function doGet(e) {
  var vidID = e.parameter.v
  // var vidID = "J0I3T3pM8nY"
  var res = UrlFetchApp.fetch("https://www.youtube.com/watch?bpctr=9999999999&has_verified=1&v="+vidID)
  // var res = UrlFetchApp.fetch("https://webhook.site/2e61c16f-fbde-4501-a77b-d2c55d3ff3cd")
  var resParsed = {
    actualStartTime: "",
    actualEndTime: "",
  }
  var resText = res.getContentText()
  var startTSRegex = new RegExp(/"startTimestamp":"([^"]+)"/,"g")
  var endTSRegex = new RegExp(/"endTimestamp":"([^"]+)"/,"g")
  var uploadDateRegex = new RegExp(/"uploadDate":"([^"]+)"/,"g")
  var lengthSecRegex = new RegExp(/"lengthSeconds":"([^"]+)"/,"g")

  var startTSArr = startTSRegex.exec(resText)
  if (startTSArr != null && startTSArr.length > 1) {
    resParsed.actualStartTime = startTSArr[1]
  } else {
    var uploadDateArr = uploadDateRegex.exec(resText)
    if (uploadDateArr != null && uploadDateArr.length > 1) {
      resParsed.actualStartTime = uploadDateArr[1]
    }
  }
  var endTSArr = endTSRegex.exec(resText)
  if (endTSArr != null && endTSArr.length > 1) {
    resParsed.actualEndTime = endTSArr[1]
  } else {
    var lengthSecArr = lengthSecRegex.exec(resText)
    if (lengthSecArr != null && lengthSecArr.length > 1) {
      var lengthSec = Number(lengthSecArr[1])
      var startDate = new Date(resParsed.actualStartTime)
      startDate.setTime(startDate.getTime()+lengthSec*1000)
      resParsed.actualEndTime = startDate.toISOString()
    }
  }
  if (resParsed.actualStartTime == "" || resParsed.actualEndTime == "") {
    resParsed = {
      error: 'unknown error',
    }
  }

  var toSend = resParsed
  Logger.log(JSON.stringify(toSend))
  return responseJSON(toSend)
}

function responseJSON(data) {
   return ContentService
            .createTextOutput(JSON.stringify(data))
            .setMimeType(ContentService.MimeType.JSON);
}