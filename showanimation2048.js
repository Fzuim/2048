function showNumberWithAnimation(i, j, randNumber){
    var numberCell = $("#number-cell-" + i + "-" + j);
    numberCell.css("background-color", getNumberBackgroundColor(randNumber));
    numberCell.css("color", getNumberColor(randNumber));
    //numberCell.css("font-size", randNumber > 512 ? "40px" : "60px");
    numberCell.text(randNumber);

    numberCell.animate({
        width: cellSideLength,
        heigth: cellSideLength,
        top: getPosTop(i , j),
        left: getPosLeft(i , j)
    }, 100);
}

function showMoveAnimation(fromX, fromY, toX, toY){
    var numberCell = $("#number-cell-" + fromX + "-" + fromY);

    numberCell.animate({
        top: getPosTop(toX, toY),
        left: getPosLeft(toX, toY)
    }, 200);
}

var g_showMsg = false;

function updateScore(score){
    $("#score").text(score);
    if(score > 10313)
    {
        $("#love").fadeIn(3000);
    }
    else if(score == 520){
        alert("😘我爱你😘");
    }
    else if(score > 1314 && !g_showMsg){
        g_showMsg = true;
        $("#msg").fadeIn(3000);
        setTimeout(function(){
            $("#msg").text("猪告辞了。。。加油✨");
        },2000);

        $("#msg").fadeOut(3000);
    }
}