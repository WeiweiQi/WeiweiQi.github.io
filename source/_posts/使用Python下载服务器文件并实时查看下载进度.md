---
title: 使用Python下载服务器文件并实时查看下载进度
comments: true
date: 2021-06-04 12:58:26
categories: 后端
tags: Python
---


这是我参与更文挑战的第5天，活动详情查看： [更文挑战](https://juejin.cn/post/6967194882926444557)

生产场景下，因为已知或未知的因素，经常需要我们在生产服务器上查找与定位Bug，日志必不可少。如何方便快捷的在本地下载服务器文件呢。

1. 使用工具软件，如XFTP，拖动文件下载。下载灵活，但操作繁琐，每次都需要跳转到指定路径去找文件。
2. 使用本地脚本下载文件：

#### 下载文件

第三方工具包的选择：

`paramiko`是一个python库，实现了SSH协议，官方文档地址：http://docs.paramiko.org/en/stable/。

paramiko有两个核心组件，SSHClient 与 SFTPClient，一个用于远程执行命令，一个用于文件传输。

如下面代码是典型的采用SFTPClient进行文件下载的样例：

```python
# 下载文件
def downloadLog(thread_name, host, port, username, password, remote_filepath, local_filepath):
    # open a transport
    tranport = paramiko.Transport((host, port))
    # auth
    tranport.connect(None, username, password)
    # go!
    sftp = paramiko.SFTPClient.from_transport(tranport)
    # download
    # remote_filepath = '/root/test.txt'
    # local_filepath = 'D:\\xxxx\\test1.txt'
    # callback是回调函数，用于更新下载进度，后文会说
    sftp.get(remote_filepath, local_filepath, callback=callback)
    # close
    if sftp:
        sftp.close()
    if tranport:
        tranport.close()
    print(local_filepath + ': 下载完成', end='\n')
	
```



#### 显示下载进度

显示进度主要是通过`print`函数的`end`参数实现的。

`print`函数默认换行，是`end='\n'`在起作用，我们设置`end=''`测试出每次打印都会从本行头开始。

```python
def callback(now, total, length=30, prefix='进度：', thread_name='', number=0):
    nowSum[threading.current_thread().getName()] = now
    totalSum[threading.current_thread().getName()] = total
    print(
        '\r文件数量:3, ' + '文件总大小：{}, '.format(str(format(sum(totalSum.values()) / 1024 / 1024, '.2f')) + 'M') + prefix + '{:.2%}\t'.format((sum(nowSum.values()) / sum(totalSum.values())))
        + '[' + '>' * int(sum(nowSum.values()) / sum(totalSum.values()) * length) + '-' * int(length - sum(nowSum.values()) / sum(totalSum.values()) * length) + ']', end='')
```



#### 优化

通常，我们定位问题，需要查找指定字符，可以不需要下载后在本地查找，通过`grep`命令，完成在服务器端查找后，下载筛选后的内容，可以减少传输文件大小。

这里我们没有使用SFTPClient，而是使用了SSHClient，而是直接将命令输出内容写到本文文件中。

**其实这里我们也可以采用SFTPClient，首先将grep查询内容输出到服务器的指定文件中，然后再将文件下载到本地。**

```python
def downloadGrepLog(thread_name, host, port, username, password, remote_filepath, local_filepath, grep_str):
    # 按照指定字符串，筛选其前2行至后20行的内容，并输出到本地
    command = 'grep -A 20 -B 2 "' + grep_str + '" ' + remote_filepath
	
    s = paramiko.SSHClient()
    s.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    s.connect(host, port, username, password)
	
    print('grep命令' + command)
    # 这里我们没有使用SFTPClient，而是直接将命令输出内容写到本文文件中
    (stdin, stdout, stderr) = s.exec_command(command)
    f = open(local_filepath,"w+")
    for line in stdout:
        f.write(line)
    s.close()
    print(local_filepath + ': 下载完成', end='\n')
```

#### 完整代码

该程序的优点在于：

1. 多日志多线程下载；
2. 实时查看下载进度；
3. 可使用`grep`命令筛选日志下载

```python
import paramiko
import _thread
import os
import threading
import time

threadNames = ['1号服务器', '2号服务器', '3号服务器']
nowSum = {} # 当前下载进度
totalSum = {} # 文件总大小
for threadname in  threadNames:
    nowSum[threadname] = 0
    totalSum[threadname] = 0

def callback(now, total, length=30, prefix='进度：', thread_name='', number=0):
    nowSum[threading.current_thread().getName()] = now
    totalSum[threading.current_thread().getName()] = total
    print(
        '\r文件数量:3, ' + '文件总大小：{}, '.format(str(format(sum(totalSum.values()) / 1024 / 1024, '.2f')) + 'M') + prefix + '{:.2%}\t'.format((sum(nowSum.values()) / sum(totalSum.values())))
        + '[' + '>' * int(sum(nowSum.values()) / sum(totalSum.values()) * length) + '-' * int(length - sum(nowSum.values()) / sum(totalSum.values()) * length) + ']', end='')

# time.strftime('%Y-%m-%d', time.localtime(time.time()))

# 提示输入日期
dateStr = input('请输入日期，格式为yyyy-mm-dd(默认今天):')
grep_str = input('请输入查询内容（默认全部）:')

today = time.strftime('%Y-%m-%d', time.localtime(time.time()))
filename = 'MyProject.log'
if not dateStr:
    dateStr = today
if today != dateStr:
    # 服务器日志滚动格式为： MyPrject.log_yyyy-MM-dd.log
    filename = 'MyProject.log_' + dateStr + '.log'

# 若拷贝自用，需要将服务器地址修改为自己的服务器地址，端口，用户名，密码与日志文件的路径
server1 = 'xxx.xxx.xxx.xx'
server1port = 22
server1username = 'xx'
server1password = 'xxxxxx'
server1remotefilepath = '/usr/local/....'
server1localfilepath = 'D:\\xxx\\log\\' + dateStr + '\\'+ grep_str +'$1\\'
server2 = 'xxx.xxx.xxx.xx'
server2port = 22
server2username = 'xxxxxx'
server2password = 'xxx'
server2remotefilepath = '/usr/local/....'
server2localfilepath = 'D:\\xxx\\log\\' + dateStr + '\\'+ grep_str +'$2\\'
server2remotefilepath2 = '/usr/local/....'
server2localfilepath2 = 'D:\\work\\log\\' + dateStr + '\\'+ grep_str +'$3\\'

def getFileDirPath(filepath):
    print(filepath[0:filepath.rfind('\\')])

def getFileName(filepath):
    print(filepath[filepath.rfind('\\'):])

def downloadLog(thread_name, host, port, username, password, remote_filepath, local_filepath):
    # open a transport
    tranport = paramiko.Transport((host, port))
    # auth
    tranport.connect(None, username, password)
    # go!
    sftp = paramiko.SFTPClient.from_transport(tranport)
    # download
    # remote_filepath = '/root/test.txt'
    # local_filepath = 'D:\\xxxx\\test1.txt'
    sftp.get(remote_filepath, local_filepath, callback=callback)
    # close
    if sftp:
        sftp.close()
    if tranport:
        tranport.close()
    print(local_filepath + ': 下载完成', end='\n')
	
def downloadGrepLog(thread_name, host, port, username, password, remote_filepath, local_filepath, grep_str):
    command = 'grep -A 20 -B 2 "' + grep_str + '" ' + remote_filepath
	
    s = paramiko.SSHClient()
    s.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    s.connect(host, port, username, password)
	
    print('grep命令' + command)
    (stdin, stdout, stderr) = s.exec_command(command)
    f = open(local_filepath,"w+")
    for line in stdout:
        f.write(line)
    s.close()
    print(local_filepath + ': 下载完成', end='\n')


class downloadThread(threading.Thread):
    def __init__(self, name, host, port, username, password, remote_filepath, local_filepath, grep_str):
        threading.Thread.__init__(self)
        self.name = name
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.remote_filepath = remote_filepath
        self.local_filepath = local_filepath
        self.grep_str = grep_str
    def run(self):
        # 注释代码主要完成若已下载过log，则创建新的目录去下载
        # local_file_dir_path = getFileDirPath(self.local_filepath)
        # log_filename = getFileName(self.local_filepath)
        # while os.path.exists(local_file_dir_path):
        #     # 文件夹已存在
        #     lastFileDirName = getFileName(local_file_dir_path)
        #     local_file_dir_path = getFileDirPath(local_file_dir_path)
        #     local_file_dir_path = local_file_dir_path
        #     + '\\'
        #     + time.strftime('%Y-%m-%d_%H_%M_%S', time.localtime(time.time())) + '\\' + lastFileDirName
        # if not os.path.exists(local_file_dir_path):
        #     os.mkdir(local_file_dir_path)
        # self.local_filepath = local_file_dir_path + '\\' + log_filename
        if not self.grep_str:
            downloadLog(self.name, self.host, self.port, self.username, self.password, self.remote_filepath, self.local_filepath)
        else:
            downloadGrepLog(self.name, self.host, self.port, self.username, self.password, self.remote_filepath, self.local_filepath,self.grep_str)

if not os.path.exists(server1localfilepath):
    os.makedirs(server1localfilepath)
if not os.path.exists(server2localfilepath):
    os.makedirs(server2localfilepath)
if not os.path.exists(server2localfilepath2):
    os.makedirs(server2localfilepath2)

thread1 = downloadThread('1号服务器', server1, server1port, server1username, server1password, server1remotefilepath + filename,
                         server1localfilepath + filename, grep_str)
thread2 = downloadThread('2号服务器-1', server2, server2port, server2username, server2password, server2remotefilepath + filename,
                         server2localfilepath + filename, grep_str)
thread3 = downloadThread('2号服务器', server2, server2port, server2username, server2password, server2remotefilepath2 + filename,
                         server2localfilepath2 + filename, grep_str)

thread1.setDaemon(True)
thread1.start()

thread2.setDaemon(True)
thread2.start()

thread3.setDaemon(True)
thread3.start()

thread1.join()
thread2.join()
thread3.join()


print('主线程结束：')
```



#### 运行效果

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90cbb9a0631a4e3ca28610c08b46248d~tplv-k3u1fbpfcp-watermark.image)


![4b9f17d033134a9682ca2546c39b96a3_tplv-k3u1fbpfcp-watermark.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c209aca1ecf14d66b9b52d68b9450d68~tplv-k3u1fbpfcp-watermark.image)


![57e035cd66ea4f748423f7b639771044_tplv-k3u1fbpfcp-watermark.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8c123e57df9e4b258a5aa1825136e690~tplv-k3u1fbpfcp-watermark.image)
