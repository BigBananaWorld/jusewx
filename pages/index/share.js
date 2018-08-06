
const ctx = wx.createCanvasContext('myCanvas');
let draw = function (data) { //{icon:头像, qrcode:二维码, calorie:消耗卡路里,title:相当于.., signTime:签到次数}
  const z = data.z;
  const grd = ctx.createLinearGradient(430 * z, 62 * z, 430 * z, 100 * z)
  console.log(ctx)
  grd.addColorStop(0, '#EC6764')
  grd.addColorStop(1, '#F2A66A')

  ctx.save();
  let r = 50 * z;
  let cx = (87 * z) + r
  let cy = (56 * z) + r
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, 2 * Math.PI)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(data.icon, cx - r, cy - r, r * 2, r * 2);
  ctx.restore()

  //头像结束
  ctx.setTextBaseline('top')
  ctx.setTextAlign('left');
  ctx.setFontSize(30 * z);
  ctx.fillText("今天消耗了", 198 * z, 60 * z)
  ctx.save();
  ctx.setFillStyle(grd);
  ctx.fillText(data.calorie, 360 * z, 62 * z);
  ctx.fillText('Cal', 400 * z, 62 * z)
  ctx.restore()

  ctx.setFillStyle('#999999')
  ctx.fillText(data.title, 200 * z, 110 * z);

  ctx.setLineDash([6 * z, 2 * z], 5 * z);
  ctx.setStrokeStyle('#F1F1F1');
  ctx.beginPath();
  ctx.moveTo(87 * z, 172 * z);
  ctx.lineTo(517 * z, 172 * z);
  ctx.stroke();

  ctx.setFillStyle('#000');
  ctx.setFontSize(26 * z)
  ctx.fillText('并在减肥计划中已连续打卡      天', 110 * z, 188 * z)

  ctx.setFillStyle('#ff6666');
  ctx.fillText(data.signTime, 425 * z, 188 * z);

  ctx.drawImage(data.qrcode, 110 * z, 288 * z, 400 * z, 400 * z)
  ctx.draw();
}

module.exports = draw ;