// pages/2048game/2048game.js
var app = getApp();
Page({
  data: {
    score: 0,//保存得分
    status: 0,
    width: 0,
    d: [],
    c: [],
  },
  move: false,
  CN: 4,
  RN: 4,
  val: [],
  startPoint: [0, 0],
  

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var w = 0
    wx.getSystemInfo({
      success: function (res) {
        w = res.windowWidth;
      }
    })
    this.setData({
      width: parseInt((w - 80) / 4)
    })


    this.start();
    this.audioCtx = wx.createAudioContext('audio'),
    this.audioCtx.setSrc('http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46')
    this.audioCtx.play()

  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  /*funplay: function (e) {

    this.audio.play();
  },*/
  touchStart: function (e) {
    this.startPoint = [e.touches[0].pageX, e.touches[0].pageY],
      this.move = true
  },
  touchEnd: function (e) {
    if (!this.move) {
      return
    }
    console.log("tounch end");
    var curPoint = [e.touches[0].pageX, e.touches[0].pageY]
    var startPoint = this.startPoint;

    if (curPoint[0] <= startPoint[0]) {

      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        console.log("left move")
        this.moveLeft();
      } else {
        if (curPoint[1] >= startPoint[1]) {
          console.log("down move")
          this.moveDown();
        } else {
          console.log("up move")
          this.moveUp();
        }
      }
    } else {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        console.log("right move")
        this.moveRight();
      } else {
        if (curPoint[1] >= startPoint[1]) {
          console.log("down move")
          this.moveDown();
        } else {
          console.log("up move")
          this.moveUp();
        }
      }
    }
    this.move = false

  },
  restart: function () {
    this.start();
  },
  start: function () {
    //将游戏状态重置为运行中
    this.setData({
      status: 0,
      score: 0,//将得分归零
      d: [],
      c: [],
    })
    this.val = [];

    //r从0到<RN
    for (var r = 0; r < this.RN; r++) {
      //向data中压入一个空的子数组
      this.val.push([]);
      //c从0到<CN结束
      for (var c = 0; c < this.CN; c++) {
        //为data中r行c位置保存一个0
        this.val[r][c] = 0;
      }
    }
    //随机生成2个2或4
    this.randomNum();

    this.randomNum();

    //将data中的数据更新到页面div中
    this.updateView();
    //为当前页面添加键盘按下事件处理函数
  },

  randomNum: function () {

    while (true) {//反复
      //在0~RN-1之间生成一个随机整数保存在r
      var r = parseInt(Math.random() * this.RN);
      //在0~CN-1之间生成一个随机整数保存在c
      var c = parseInt(Math.random() * this.CN);
      //如果data中r行c列的值为0
      if (this.val[r][c] == 0) {
        //为data中r行c列随机保存一个2或4
        this.val[r][c] =
          Math.random() < 0.5 ? 2 : 4;
        break;//退出循环
      }
    }

  },

  updateView: function () {

    var val = this.data.d;
    var cls = this.data.c;
    for (var r = 0; r < this.RN; r++) {//遍历data
      for (var c = 0; c < this.CN; c++) {
        //用r,c拼对应div的id
        //如果data中r行c列不为0
        if (this.val[r][c] != 0) {
          //将data0中r行c列的值保存到div的内容
          val[r * this.RN + c] = this.val[r][c]

          //设置div的class为n+data[r][c]
          cls[r * this.CN + c] = "n" + this.val[r][c];

        } else {//否则，清空div的内容
          val[r * this.RN + c] = "";
          //清除div的class
          cls[r * this.CN + c] = "";
        }
      }
    }

    this.setData({
      d: val,
      c: cls,
    });
  },

  isGAMEOVER: function () {
    //遍历data
    for (var r = 0; r < this.RN; r++) {
      for (var c = 0; c < this.CN; c++) {
        //如果当前元素是0，就返回false
        if (this.val[r][c] == 0) return false;
        //如果c<CN-1且当前元素等于右侧元素
        if (c < this.CN - 1
          && this.val[r][c] == this.val[r][c + 1])
          return false;//就返回false
        //如果r<RN-1且当前元素等于下方元素
        if (r < this.RN - 1
          && this.val[r][c] == this.val[r + 1][c])
          return false;//就返回false
      }
    }
    
    return true;//返回true
  },

  moveLeft: function () {

    var s = this.data.score;
    var CN = this.CN;
    var RN = this.RN;
    var val = this.val;
    function moveLeftInRow(r) {

      for (var c = 0; c < CN - 1; c++) {
        //找r行c右侧下一个不为0的位置nextc
        var nextc = getNextcInRow(r, c);
        //如果没找到，就退出循环
        if (nextc == -1) break;
        else {//否则
          //如果c位置的值为0
          if (val[r][c] == 0) {
            //将nextc位置的值赋值给c位置
            val[r][c] = val[r][nextc];
            //将nextc位置的值置为0
            val[r][nextc] = 0;
            c--;//将c-1
          } else if (val[r][c]
            == val[r][nextc]) {
            //否则如果c位置的值等于nextc位置的值
            //将c位置的值*2
            val[r][c] *= 2;
            //将*2后的元素值累加到score中
            s += val[r][c];
            //将nextc位置的值置为0
            val[r][nextc] = 0;
          }
        }
      }
    }
    //找r行c列右侧下一个不为0的位置
    function getNextcInRow(r, c) {
      //nextc从c+1开始,到<CN结束
      for (var nextc = c + 1; nextc < CN; nextc++) {
        //如果data中r行nextc位置不等于0
        if (val[r][nextc] != 0)
          return nextc;//就返回nextc
      }
      return -1;//返回-1
    }
    //将data转为字符串保存在before中
    var before = String(this.val);
    for (var r = 0; r < RN; r++) {//r从0到<RN
      moveLeftInRow(r);//左移第r行
    }
    //将data转为字符串保存在after中
    var after = String(this.val);
    //如果before不等于after
    if (before != after) {
      this.setData({
        score: s
      })
      this.randomNum();//随机生成一个2或4
      //如果游戏结束
      if (this.isGAMEOVER())
        //修改游戏状态为GAMEOVER
        this.setData({
          status: 1
        })
      this.updateView();//更新页面
    }
    this.val = val;
  },

  moveRight: function () {
    var s = this.data.score;
    var CN = this.CN;
    var RN = this.RN;
    var val = this.val;
    function moveRightInRow(r) {
      //c从CN-1开始，到>0结束,递减1
      for (var c = CN - 1; c > 0; c--) {
        //查找r行c列左侧前一个不为0的位置prevc
        var prevc = getPrevcInRow(r, c);
        //如果没找到就退出循环
        if (prevc == -1) break;
        else {//否则
          //如果c位置的值为0
          if (val[r][c] == 0) {
            //用prevc位置的值代替c位置的值
            val[r][c] = val[r][prevc];
            //将prevc位置的值置为0
            val[r][prevc] = 0;
            c++;//c+1
          } else if (val[r][c]
            == val[r][prevc]) {
            //否则如果c位置的值等于prevc位置的值
            //将c位置的值*2
            val[r][c] *= 2;
            //将*2后的元素值累加到score中
            s += val[r][c];
            //将prevc位置的值置为0
            val[r][prevc] = 0;
          }
        }
      }
    }

    function getPrevcInRow(r, c) {
      //prevc从c-1开始，到>=0，递减1
      for (var prevc = c - 1; prevc >= 0; prevc--) {
        //如果data中r行prevc位置的值不等于0
        if (val[r][prevc] != 0)
          return prevc;//返回prevc
      }
      return -1;//返回-1
    }
    //将data转为字符串保存在before中
    var before = String(this.val);
    //r从0开始，到<RN结束
    for (var r = 0; r < this.RN; r++) {
      moveRightInRow(r);//右移第r行
    }
    //将data转为字符串保存在after中
    var after = String(this.val);
    //如果before不等于after时
    if (before != after) {
      this.randomNum();//随机生成2或4
      this.setData({
        score: s
      })
      //如果游戏结束
      if (this.isGAMEOVER())
        //修改游戏状态为GAMEOVER
        this.setData({
          status: 1
        })
      this.updateView();//更新页面
    }
    this.val = val;
  },
  moveUp: function () {
    var s = this.data.score;
    var CN = this.CN;
    var RN = this.RN;
    var val = this.val;
    function moveUpInCol(c) {
      //r从0到<RN-1
      for (var r = 0; r < RN - 1; r++) {
        //找r行c列下方下一个不为0的位置nextr
        var nextr = getNextrInCol(r, c);
        //如果没找到,就退出循环
        if (nextr == -1) break;
        else {//否则
          //如果r行c列的值为0
          if (val[r][c] == 0) {
            //就用nextr行c列的值代替r行c列
            val[r][c] = val[nextr][c];
            //将nextr行c列的值置为0
            val[nextr][c] = 0;
            r--;//r留在原地
          } else if (val[r][c]
            == val[nextr][c]) {
            //否则如果r行c列的值等于nextr行c列的值
            //就将r行c列的值*2
            val[r][c] *= 2;
            //将*2后的元素值累加到score中
            s += val[r][c];
            //将nextr行c列的值置为0
            val[nextr][c] = 0;
          }
        }
      }
    }
    //查找r行c列下方下一个不为0的位置
    function getNextrInCol(r, c) {
      //nextr从r+1开始,到<RN结束
      for (var nextr = r + 1; nextr < RN; nextr++) {
        //如果nextr行c列的值不为0
        if (val[nextr][c] != 0)
          return nextr;//就返回nextr
      }
      return -1;//返回-1
    }

    //将data转为字符串保存在before中
    var before = String(this.val);
    //c从0到<CN
    for (var c = 0; c < this.CN; c++) {
      moveUpInCol(c);//上移第c列
    }
    //将data转为字符串保存在after中
    var after = String(this.val);
    //如果before不等于after
    if (before != after) {
      this.setData({
        score: s
      })
      this.randomNum();//随机生成一个2或4

      //如果游戏结束
      if (this.isGAMEOVER())
        //修改游戏状态为GAMEOVER
        this.setData({
          status: 1
        })
      this.updateView();//更新页面
    }
    this.val = val;
  },

  moveDown: function () {
    var s = this.data.score;
    var CN = this.CN;
    var RN = this.RN;
    var val = this.val;
    function moveDownInCol(c) {
      for (var r = RN - 1; r > 0; r--) {
        var prevr = getPrevrInCol(r, c);
        if (prevr != -1) {
          if (val[r][c] == 0) {
            val[r][c] = val[prevr][c];
            val[prevr][c] = 0;
            r++;
          } else if (val[r][c] == val[prevr][c]) {
            val[r][c] *= 2;
            s += val[r][c];
            val[prevr][c] = 0;
          }
        } else break;
      }
    }
    function getPrevrInCol(r, c) {
      for (var prevr = r - 1; prevr >= 0; prevr--) {
        if (val[prevr][c] != 0)
          return prevr;
      }
      return -1;
    }

    var before = String(this.val);
    for (var c = 0; c < this.CN; c++) {
      moveDownInCol(c);
    }
    var after = String(this.val);
    if (before !== after) {
      this.setData({
        score: s
      })
      this.randomNum();//随机生成一个2或者4

      if (this.isGAMEOVER())
        //修改游戏状态为GAMEOVER
        this.setData({
          status: 1
        })
      this.updateView();
    }

    this.val = val;

  }

})