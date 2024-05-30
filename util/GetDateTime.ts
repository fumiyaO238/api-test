function GetDateTime() {
  let date = new Date();
  let y = date.getFullYear();
  let m = ('0' + (date.getMonth() + 1)).slice(-2);
  let d = ('0' + date.getDate()).slice(-2);
  let h = ('0' + date.getHours()).slice(-2);
  let min = ('0' + date.getMinutes()).slice(-2);
  let s = ('0' + date.getSeconds()).slice(-2);
  let getDateTime = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
  return getDateTime;
}

export default GetDateTime;