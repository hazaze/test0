// 启动函数

window.addEventListener("DOMContentLoaded", function () {
  initCrumbs();
  leftOption();
  bottomOption();
  zoom();
  thumb();
  thumbClick();
  goodsBaseInfo();
  goodsParamsInfo();
});

// 大图的下标
var imgIndex  = 0;

// 初始化面包屑导航数据
function initCrumbs() {
  var path = goodData.path;
  // console.log(path);
  var strPath = "";
  path.forEach(function (item, index) {
    if (index !== path.length - 1) {
      strPath += `<a href='${item.url}'>${item.title}</a>`;
    } else {
      strPath += `<a>${item.title}</a>`;
    }
  });
  $(".con .conPoin").html(strPath);
  // console.log(strPath);
}

// 左选项
function leftOption() {
  var h4Tw = document.querySelectorAll(
    ".wrap .productDetail .aside .tabWrap h4"
  );
  var lefDiv = document.querySelectorAll(
    ".wrap .productDetail .aside .tabContent > div"
  );
  var h4TwZ = Array.from(h4Tw);
  var lefDivZ = Array.from(lefDiv);

  h4TwZ.forEach(function (item, index) {
    item.onclick = function () {
      for (var i = 0; i < h4TwZ.length; i++) {
        h4TwZ[i].classList.remove("active");
      }
      this.classList.add("active");

      for (var j = 0; j < lefDivZ.length; j++) {
        lefDivZ[j].classList.remove("active");
      }
      lefDivZ[index].classList.add("active");
    };
  });
}

// 底部选项
function bottomOption() {
  var tabWli = document.querySelectorAll(
    ".wrap .productDetail .detail .intro .tabWrap li"
  );
  var tabCdiv = document.querySelectorAll(
    ".wrap .productDetail .detail .intro .tabContent > div"
  );

  tabWli.forEach(function (item, index) {
    item.onclick = function () {
      for (var i = 0; i < tabWli.length; i++) {
        tabWli[i].classList.remove("active");
      }
      item.classList.add("active");

      for (var j = 0; j < tabWli.length; j++) {
        tabCdiv[j].classList.remove("active");
      }
      tabCdiv[index].classList.add("active");
    };
  });
}

// 放大镜
function zoom() {
  // 获取放大镜效果对象
  var preview = document.querySelector(".preview");
  var gDImg = goodData.imgsrc;
  // 小图
  var zooM = document.querySelector(
    ".wrap .con .mainCon .previewWrap .preview .zoom"
  );
  // var zooMsmall = new Image(); // 创建img 对象方法一
  zooM.innerHTML = `<img src="${gDImg[0].s}" alt="">`;
  // var bigImgBox = null;
  zooM.onmouseenter = function () {
    // 遮拦
    mask = document.createElement("div");
    mask.className = "mask";
    zooM.append(mask);

    // 创建大图片对象
    bigImgBox = document.createElement("div");
    var bigImg = document.createElement("img"); // 创建img 对象方法二
    // 添加类名
    bigImgBox.className = "bigBox";

    preview.append(bigImgBox);
    bigImgBox.append(bigImg);
    bigImg.src = gDImg[imgIndex].b;

    // 移动
    zooM.onmousemove = function (e) {
      // e.clientX:相对于浏览器客户端x坐标
      // e.pageX:相对于文档所在x坐标
      // console.log("e.pageX:"+e.pageX);
      // console.log("clientX:"+e.clientX);
      var maskLeft =
        e.clientX - zooM.getBoundingClientRect().left - mask.offsetWidth / 2;

      var maskTop =
        e.clientY - zooM.getBoundingClientRect().top - mask.offsetHeight / 2;

      var maskLimitsLeft = zooM.clientWidth - mask.offsetWidth;
      var maskLimitsTop = zooM.clientHeight - mask.offsetHeight;

      if (maskLeft > maskLimitsLeft) {
        maskLeft = maskLimitsLeft;
      } else if (maskLeft < 0) {
        maskLeft = 0;
      }

      if (maskTop > maskLimitsTop) {
        maskTop = maskLimitsTop;
      } else if (maskTop < 0) {
        maskTop = 0;
      }
      mask.style.left = maskLeft + "px";
      mask.style.top = maskTop + "px";

      // 大图
      // 控制大图的移动
      // 比例关系： 遮盖的移动距离(maskLeft) / 遮盖最大的移动距离(maskLeft) = 大图的移动距离(未知) / 大图最大的移动距离（未知）
      // 大图最大的移动距离left = 大图宽度 - 大盒的宽度
      // 大图最大的移动距离left = 大图宽度 - 大盒的宽度
      var bigLimitsLeft = bigImg.offsetWidth - bigImgBox.clientWidth;
      var bigLimitstop = bigImg.offsetHeight - bigImgBox.clientHeight;

      // 大图的移动距离 = (遮盖的移动距离 * 大图最大的移动距离) / 遮盖最大的移动距离
      var bigMoveLeft = (maskLeft * bigLimitsLeft) / maskLimitsLeft;
      var bigMoveTop = (maskTop * bigLimitstop) / maskLimitsTop;

      bigImg.style.left = -bigMoveLeft + "px";
      bigImg.style.top = -bigMoveTop + "px";
    };
    // 鼠标离开事件
    zooM.onmouseleave = function () {
      zooM.removeChild(mask);
      preview.removeChild(bigImgBox);
      zooM.onmousemove = null;
      zooM.onmouseleave = null;
    };
  };
}

// 初始化缩略图
function thumb() {
  // 添加数据
  goodData.imgsrc.forEach(function (item, index) {
    var listLi = document.createElement("li");
    var listImg = new Image();
    listImg.src = item.s;
    listLi.appendChild(listImg);

    var specScrolllist = document.querySelector(
      ".wrap .con .mainCon .previewWrap .specScroll .itemCon .list"
    );
    specScrolllist.appendChild(listLi);
  });

  // 左右点击
  var prev = document.querySelector(
    ".wrap .con .mainCon .previewWrap .specScroll .prev"
  );
  var next = document.querySelector(
    ".wrap .con .mainCon .previewWrap .specScroll .next"
  );
  var lis = document.querySelectorAll(
    ".wrap .con .mainCon .previewWrap .specScroll .itemCon .list > li"
  );
  var list = document.querySelector(
    ".wrap .con .mainCon .previewWrap .specScroll .itemCon .list"
  );

  // 获取dom节点最终的渲染之后的样式
  var marginRight = parseInt(window.getComputedStyle(lis[0]).marginRight);

  // 每次移动的距离
  var lisMove = lis[0].offsetWidth + marginRight;

  // 最大移动距离
  var num = 5; // 默认显示5张

  // 限制移动距离
  var maxListMove = (goodData.imgsrc.length - num) * lisMove;

  var moveNumList = 0; // 记录移动的距离

  // 右
  next.onclick = function () {
    if (moveNumList >= maxListMove) {
      return;
    }
    moveNumList += lisMove;
    list.style.left = -moveNumList + "px";
  };

  // 左
  prev.onclick = function () {
    if (moveNumList === 0) {
      return;
    }
    moveNumList -= lisMove;
    list.style.left = -moveNumList + "px";
  };
}

//  缩略图绑定事件
function thumbClick() {
  // 给所有的小缩略图绑定单击事件
  var imgs = document.querySelectorAll(
    ".wrap .con .mainCon .previewWrap .specScroll .itemCon .list > li img"
  );
  var smallImg = document.querySelector(
    ".wrap .con .mainCon .previewWrap .preview .zoom img"
  );

  imgs.forEach( function(item,index){
    item.onclick =  function(){
      smallImg.src = this.src;
      imgIndex = index
    }
  })
}

//  动态渲染商品的参数信息
function goodsBaseInfo(){
  var goods = goodData.goodsDetail;
  var goodsNode = document.querySelector('.wrap .con .mainCon .infoWrap .info1')
  var info = `<h3 class="infoName">${goods.title}</h3>
<p class="news">${goods.recommend}</p>
<div class="priceArea">
  <div class="priceArea1">
    <div class="title">价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</div>
    <div class="price">
      <i>￥</i>
      <em>${goods.price}</em>
      <span>降价通知</span>
    </div>
    <div class="remark">
      <i>累计评价</i>
      <span>${goods.evaluateNum}</span>
    </div>
  </div>
  <div class="priceArea2">
    <div class="title">促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</div>
    <div class="fixWidth">
      <i>${goods.promoteSales.type}</i>
      <span>${goods.promoteSales.content}</span>
    </div>
  </div>
</div>
<div class="support">
  <div>
    <div class="title">支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</div>
    <div class="fixWidth">${goods.support}</div>
  </div>
  <div>
    <div class="title">配&nbsp;送&nbsp;至</div>
    <div class="fixWidth">${goods.address}</div>
  </div>
</div>`

goodsNode.innerHTML = info;
}

//  动态渲染商品的参数信息
 function goodsParamsInfo(){
   /**
   * 思路：
   * 1. 获取商品参数数据（data.js）
   * 2. 循环数据，动态创建dl(dt，dd)
   * 3. 动态追加到页面指定的节点中
   */

  var goodsParams = goodData.goodsDetail.crumbData;
  console.log(goodsParams);
}