var board = new Array();
var score = 0;
var hasConflicated = new Array();
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

$(document).ready(function () {
    prepareForMobile();
    newgame();
});

function prepareForMobile(){
    //网页端处理，太大的界面则固定大小
    if(documentWidth > 500){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }

    //手动设置css和.css哪个先生效问题？
    $("#grid-container").css("width", gridContainerWidth - 2 * cellSpace);
    $("#grid-container").css("height", gridContainerWidth  - 2 * cellSpace);
    $("#grid-container").css("padding", cellSpace);
    $("#grid-container").css("border-radius", 0.02 * gridContainerWidth);

    $(".grid-cell").css("width", cellSideLength);
    $(".grid-cell").css("height", cellSideLength);
    $(".grid-cell").css("border-radius", 0.02 * cellSideLength);
}

function newgame(){
    //初始化棋盘
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

//初始化
function init(){
    for(var i = 0; i < 4; ++i){
        for(var j = 0; j < 4; ++j){
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i , j));
        }
    }

    for(var i = 0; i < 4; ++i){
        board[i] = new Array();
        hasConflicated[i] = new Array();
        for(var j = 0; j < 4; ++j){
            board[i][j] = 0;
            hasConflicated[i][j] = false;
        }
    }

    //更新界面
    updateBoardView();

    score = 0;
    updateScore(score);
}

function updateBoardView() {
    $(".number-cell").remove();
    for(var i = 0; i < 4; ++i){
        for(var j = 0; j < 4; ++j){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if(0 == board[i][j]){
                theNumberCell.css("width", "0px");
                theNumberCell.css("heigth", "0px");
                theNumberCell.css("top", getPosTop(i, j) + cellSideLength / 2);
                theNumberCell.css("left", getPosLeft(i, j) + cellSideLength / 2);
                theNumberCell.css("font-size", 0.6 * cellSideLength + "px");
            }else{
                theNumberCell.css("width", cellSideLength);
                theNumberCell.css("heigth", cellSideLength);
                theNumberCell.css("top", getPosTop(i, j));
                theNumberCell.css("left", getPosLeft(i, j));

                //不同数字显示不同的背景色
                theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color", getNumberColor(board[i][j]));
                theNumberCell.css("font-size", getNumberFontSize(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicated[i][j] = false;
        }
    }

    //行高
    $(".number-cell").css("line-height", cellSideLength + "px");
}

function generateOneNumber(){
    if(noSpace(board)){
        return false;
    }

    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while(times < 50){
        if(board[randx][randy] == 0){
            break;
        }

        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));

        times++;
    }

    //50次都未成功生成随机位置
    if(times == 50){
        for(var i = 0; i < 4; ++i)
            for(var j = 0; j < 4; ++j){
                if(board[i][j] == 0)
                    randx = i;
                    randy = j;
            }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4; //50%概率生产2或4
    //randNumber = 1024;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}

//检测键盘按下
$(document).keydown(function (event) {
    switch(event.which){
        case 37: //left
            event.preventDefault(); //事件不再继续传递，防止上下时滚动条也进行上下移动
            if(moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 38: //up
            event.preventDefault(); //事件不再继续传递，防止上下时滚动条也进行上下移动
            if(moveUp()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 39: //right
            event.preventDefault(); //事件不再继续传递，防止上下时滚动条也进行上下移动
            if(moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 40: //down
            event.preventDefault(); //事件不再继续传递，防止上下时滚动条也进行上下移动
            if(moveDown()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        default:
            break;
    }
});

//触摸开始
document.addEventListener("touchstart", function(event){
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;

    //event.preventDefault();
});

document.addEventListener("touchmove", function(event){
    event.preventDefault(); //事件不再继续传递，防止上下时滚动条也进行上下移动
}, { passive: false });

//触摸结束
document.addEventListener("touchend", function(event){
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var deltX = endX - startX;
    var deltY = endY - startY;

    //判断是否为有效的滑动
    if(Math.abs(deltX) < 0.3 * documentWidth && Math.abs(deltY) < 0.3 * documentWidth){
        return;
    }

    if(Math.abs(deltX) >= Math.abs(deltY)){
        if(deltX > 0){
            //move rigth
            if(moveRight()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
    }else{
        if (deltY > 0) {
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }else{
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
        }
    }
});

//解决sfari浏览器内核，滑动拖动页面的bug
$("body").on("touchmove", function(event){
    event.preventDefault();
});

//判断游戏是否结束
function isGameOver(){
    if(noSpace(board) && noMove(board)){
        GameOver();
    }
}

function GameOver(){
    alert("💪😘🐖");
}

//左移
function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }

    //moveleft
    for(var i = 0; i < 4; ++i){
        for(var j = 1; j < 4; ++j){
            if(board[i][j] != 0){
                for(var k = 0; k < j; ++k){
                    if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicated[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicated[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }

    //重新赋值后，刷新
    //这边settimeout，主要为了能显示showMoveAnimation动画
    setTimeout("updateBoardView()", 200);
    
    return true;
}

//右移
function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }

    //moveright
    for(var i = 0; i < 4; ++i){
        for(var j = 2; j >= 0; --j){
            if(board[i][j] != 0){
                for(var k = 3; k > j; --k){
                    if(board[i][k] == 0 && noBlockHorizontal(i, j, k, board)){
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicated[i][k]){
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicated[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }

    //重新赋值后，刷新
    //这边settimeout，主要为了能显示showMoveAnimation动画
    setTimeout("updateBoardView()", 200);
    
    return true;
}

//上移
function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }

    //moveup
    for(var i = 1; i < 4; ++i){
        for(var j = 0; j < 4; ++j){
            if(board[i][j] != 0){
                for(var k = 0; k < i; ++k){
                    if(board[k][j] == 0 && noBlockVertical(j, k, i, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        
                        continue;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicated[k][j]){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        hasConflicated[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }

    //重新赋值后，刷新
    //这边settimeout，主要为了能显示showMoveAnimation动画
    setTimeout("updateBoardView()", 200);
    
    return true;
}

//下移
function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }

    //movedown
    for(var i = 2; i >= 0; --i){
        for(var j = 0; j < 4; ++j){
            if(board[i][j] != 0){
                for(var k = 3; k > i; --k){
                    if(board[k][j] == 0 && noBlockVertical(j, i, k, board)){
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        continue;
                    }else if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicated[k][j]){
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        
                        hasConflicated[k][j] = true;

                        continue;
                    }
                }
            }
        }
    }

    //重新赋值后，刷新
    //这边settimeout，主要为了能显示showMoveAnimation动画
    setTimeout("updateBoardView()", 200);
    
    return true;
}