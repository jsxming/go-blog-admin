/**
 * 全局反馈 提示
 * @param {String} msg
 */
export  function showInfo(msg){
    let el = document.getElementById('global_info');
    if(el){
        el.style.backgroundColor='rgba(0,0,0,0.8)';
        el.style.color='#fff';
    }else{
        el = document.createElement('div');
        el.id='global_info';
        document.body.appendChild(el);
    }
    el.innerText = msg;
    setTimeout(() => {
        el.style.backgroundColor='rgba(0,0,0,0)';
        el.style.color='rgba(0,0,0,0)';
    }, 3000);
}