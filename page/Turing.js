function send(e){
    if(e instanceof KeyboardEvent && e.key !== 'Enter'){
        return ;
    }
    var value = document.getElementById('chatArea').value;
    var me = document.createElement('p');
    me.innerText ="我： " +  value;
    me.style.color="blue"
    document.getElementsByClassName('content')[0].appendChild(me);
    document.getElementById('chatArea').value = '';
    var ajax = new XMLHttpRequest();
    ajax.open('get','http://127.0.0.1:12306/chat?text='+ value);
    ajax.send()
    ajax.onreadystatechange = function(){
        if(ajax.status == 200 && ajax.readyState == 4){
            console.log((ajax.responseText))
            var temp = document.createElement('p');
            temp.innerText = '机器人:' + (JSON.parse(ajax.responseText)).text;
            document.getElementsByClassName('content')[0].appendChild(temp);

        }
    }


}