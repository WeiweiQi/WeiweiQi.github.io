!window._bd_share_is_recently_loaded&&window._bd_share_main.F.module("trans/trans",function(e,n){var c=e("component/comm_tools"),s=e("conf/const").URLS;n.run=function(e){!function(n){var e,t,i,r,a,o=(new Date).getTime()+3e3,d={click:1,url:(e=n,t=e.bdUrl||c.getPageUrl(),t=t.replace(/\'/g,"%27").replace(/\"/g,"%22")),uid:n.bdUid||"0",to:n.__cmd,type:"text",pic:n.bdPic||"",title:(n.bdText||document.title).substr(0,300),key:(n.bdSnsKey||{})[n.__cmd]||"",desc:n.bdDesc||"",comment:n.bdComment||"",relateUid:n.bdWbuid||"",searchPic:n.bdSearchPic||0,sign:n.bdSign||"on",l:window._bd_share_main.n1.toString(32)+window._bd_share_main.n2.toString(32)+o.toString(32),linkid:c.getLinkId(),firstime:function(e){var n=new RegExp("(^| )bdshare_firstime=([^;]*)(;|$)").exec(document.cookie);if(n)return decodeURIComponent(n[2]||null)}()||""};switch(n.__cmd){case"copy":a=d,window._bd_share_main.F.use("base/tangram",function(e){e.T.browser.ie?(window.clipboardData.setData("text",document.title+" "+(a.bdUrl||c.getPageUrl())),alert("标题和链接复制成功，您可以推荐给QQ/MSN上的好友了！")):window.prompt("您使用的是非IE核心浏览器，请按下 Ctrl+C 复制代码到剪贴板",document.title+" "+(a.bdUrl||c.getPageUrl()))});break;case"print":window.print();break;case"bdxc":window._bd_share_main.F.use("trans/trans_bdxc",function(e){e&&e.run()});break;case"bdysc":r=d,window._bd_share_main.F.use("trans/trans_bdysc",function(e){e&&e.run(r)});break;case"weixin":i=d,window._bd_share_main.F.use("trans/trans_weixin",function(e){e&&e.run(i)});break;default:!function(e,n){var t=s.jumpUrl;"mshare"==e.__cmd?t=s.mshareUrl:"mail"==e.__cmd&&(t=s.emailUrl);var i=t+"?"+function(e){var n=[];for(var t in e)n.push(encodeURIComponent(t)+"="+encodeURIComponent(e[t]));return n.join("&").replace(/%20/g,"+")}(n);window.open(i)}(n,d)}window._bd_share_main.F.use("trans/logger",function(e){e.commit(n,d)})}(e)},window._bd_share_main.F.use("base/tangram",function(e){var n=e.T;null==n.cookie.get("bdshare_firstime")&&n.cookie.set("bdshare_firstime",1*new Date,{path:"/",expires:(new Date).setFullYear(2022)-new Date})})});