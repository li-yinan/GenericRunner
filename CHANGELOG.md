## 2.10.0

### 计划中
预计做一次flow运行时的升级，已经在2.9.0里对资源进行了重构，剩下的就是并发控制node执行
在2.10.0中会把每次从堆栈中取一个node执行变为取出所有ready的node并发执行
现在可以多个node并发，但是会等所有都执行完，当有一个node执行很慢，就会导致并发速度下降
这个问题将会在2.10.0发布后得到解决

## 2.9.0

### 做了一个重大重构，把原来附属于flow的service都放到了运行时的context里
把原来集中存放到flow的service放到了运行时的context里，并且每次运行clone新的context
这样的好处是service是逐级向下传递的，后续流程对于service的覆盖不会影响到上级节点
比如并发打开页面，openpage会提供service，利用这种机制可以保证并发时资源互不干扰

## 2.8.2

### 增加了重要的signal机制，可以用于控制流程了
以signal为基础，增加了signalreciever、signalsender、pager节点
应业务需要，增加了request节点

## 2.8.0

### 修改了无数bug之后，增加了domexists,domvisible等node
2.7的版本号太多了，就发了2.8，我诚恳不？

## 2.7.0

### 增加了对并发的控制
描述一个场景：node1->node2->node3->node4, 加入node1是对列表map，那么2、3、4会被多次执行
一旦node在执行堆栈中堆积就会导致一个node无法得知是否是当次循环应该执行的
v2.7.0通过增加session的方式让每个可以多次输出的node产生一个新的session，每次执行都会找到session相符的node执行

## 2.6.0

### 增加了对第三方模块开发的支持
增加了对第三方开发的模板，https://github.com/li-yinan/generic-runner-plugin-example

## 2.5.2

### 修复getNodes函数，把flow和link从结果中删除
flow和link从字面意思上不属于nodes，所以getNodes函数不应该返回这两个

## 2.5.1

###  增加了对前端配置的补全功能
前端配置会生成一部分，比如merge的keys，但是这时候node的in需要根据keys的长度变化，这个逻辑放在前端处理太繁琐，不够合理，所以放在后端，在保存之前调用postfix对配置进行标准化，然后再存库

## 2.5.0

### 增加了subflow依赖分析和计算

之前subflow功能没有自动的依赖分析功能，现在可以根据内部node来自动计算subflow的依赖了

## 2.4.0

### 增加了node 多次输出的能力

之前的每一个node被执行只能得到一次结果，这导致了有些场景使用非常不便

例如：setInterval类似的场景，需要定时的触发器，在比如我定义一个Koa的router，每次访问都会有一个结果产生

为了解决这些问题，GenericRunner增加了ContinousOutput的功能，可以让一个node多次产生结果

### 增加Interval node 和 koa router node

依赖多次输出特性完成了Interval node和koa router node



## 2.3.0

### 增加了service 功能

2.3.0增加了service功能，可以让一个node提供一个service，这个service会自动的传递给后续node，可以让结构更简单，举个栗子，比如要用headless开一个页面，并向后传递一个chrome的引用，就可以用service来提供，后续获取dom就无需再使用一个参数传递chrome了，直接使用service

为了让这种service方便管理，一个node需要提供service的时候需要明确指出service的名称，并显式调用注册函数来注册service，使用方需要显式声明需要使用的service，这些声明都可以被静态读取，方便程序使用

详细使用可参见openpage node（注册了chrome service），dom node（使用chrome service）

## 2.2.0

### 增加了对多个输入node的支持

增加了每个node对多个输入的支持，并且以此为基础增加了merge node，可以等待到多个异步输入都完成再继续执行

支持“多个分支并行执行，在某一时刻再合并到一起”的使用方式了

## 2.1.0

### 可以使用headless chrome查询一个页面的内容了

## 2.0.0

### 搭建了基础的环境，已经可以把引擎跑起来了
